import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN (PEGA TUS DATOS AQUÍ) ---
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "NUMEROS",
    appId: "TU_APP_ID"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sessionID = localStorage.getItem('chatSessionID') || 'sess_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionID', sessionID);

// --- CONOCIMIENTO DEL BOT ---
const botKnowledge = {
    "precios": "Nuestros servicios empiezan desde 0€ para el plan básico.",
    "horario": "Estamos abiertos de Lunes a Viernes de 9:00 a 18:00.",
    "contacto": "Te paso con un humano. Escribe tu correo y te contactaremos.",
    "default": "Entiendo. Un agente humano revisará tu mensaje en breve."
};

const defaultQuestions = [
    { text: "¿Precios?", keyword: "precios" },
    { text: "¿Horario?", keyword: "horario" },
    { text: "Soporte Humano", keyword: "contacto" }
];

// --- FUNCIONES GLOBALES (Expuestas al HTML) ---
window.toggleChat = () => {
    const chat = document.getElementById('chat-window');
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
};

window.sendMessage = () => {
    const input = document.getElementById('chat-user-input');
    const text = input.value.trim();
    if (text) {
        handleUserMessage(text);
        input.value = '';
    }
};

window.handleKeyPress = (e) => {
    if (e.key === 'Enter') window.sendMessage();
};

window.handleOptionClick = (text, keyword) => {
    handleUserMessage(text, keyword);
};

// --- RENDERIZADO INICIAL ---
const optionsContainer = document.getElementById('options-container');
if(optionsContainer){
    defaultQuestions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = q.text;
        btn.onclick = () => window.handleOptionClick(q.text, q.keyword);
        optionsContainer.appendChild(btn);
    });
}

function appendMessage(text, sender) {
    const msgsDiv = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
    div.innerText = text;
    msgsDiv.appendChild(div);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

// --- LÓGICA PRINCIPAL ---
async function handleUserMessage(text, keyword = null) {
    appendMessage(text, 'user');

    // 1. Guardar mensaje del usuario en Firebase
    try {
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }

    // 2. Respuesta automática local
    setTimeout(async () => {
        let response = botKnowledge["default"];
        const lower = text.toLowerCase();
        
        if (keyword && botKnowledge[keyword]) response = botKnowledge[keyword];
        else {
            for (const key in botKnowledge) {
                if (lower.includes(key)) { response = botKnowledge[key]; break; }
            }
        }

        appendMessage(response, 'bot');
        
        // Guardar respuesta del bot
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: response, sender: "bot", timestamp: serverTimestamp()
        });
    }, 600);
}

// --- ESCUCHA DE RESPUESTAS DEL ADMINISTRADOR ---
const q = query(collection(db, "mensajes_chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            // Solo mostrar si es admin y para esta sesión
            if (data.sender === 'admin' && data.sessionID === sessionID) {
                appendMessage(data.text, 'bot');
            }
        }
    });
});