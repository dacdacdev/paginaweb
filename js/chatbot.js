import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TUS_NUMEROS",
    appId: "TU_APP_ID"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sessionID = localStorage.getItem('chatSessionID') || 'sess_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionID', sessionID);

// --- BASE DE CONOCIMIENTO ---
const botKnowledge = {
    "precios": "Nuestros servicios empiezan desde 0€ para el plan básico.",
    "horario": "Estamos abiertos de Lunes a Viernes de 9:00 a 18:00.",
    "contacto": "Te paso con un humano. Deja tu correo y te escribimos.",
    "default": "Entiendo. Un agente humano revisará tu mensaje en breve."
};

const defaultQuestions = [
    { text: "¿Precios?", keyword: "precios" },
    { text: "¿Horario?", keyword: "horario" },
    { text: "Soporte Humano", keyword: "contacto" }
];

// --- FUNCIONES LÓGICAS ---
function toggleChat() {
    const chat = document.getElementById('chat-window');
    // Si usas flex en CSS, cambiamos entre 'flex' y 'none'
    const isVisible = window.getComputedStyle(chat).display !== 'none';
    chat.style.display = isVisible ? 'none' : 'flex';
}

async function sendMessage() {
    const input = document.getElementById('chat-user-input');
    const text = input.value.trim();
    if (text) {
        handleUserMessage(text);
        input.value = '';
    }
}

function handleOptionClick(text, keyword) {
    handleUserMessage(text, keyword);
}

// --- ASIGNACIÓN DE EVENTOS (LA SOLUCIÓN AL ERROR) ---
// Esperamos a que el documento cargue y asignamos los clics desde JS
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Botón Flotante (Abrir/Cerrar)
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    if(toggleBtn) toggleBtn.addEventListener('click', toggleChat);

    // 2. Botón Cerrar (La X)
    const closeBtn = document.querySelector('.close-chat');
    if(closeBtn) closeBtn.addEventListener('click', toggleChat);

    // 3. Botón Enviar
    const sendBtn = document.getElementById('chat-send-btn');
    if(sendBtn) sendBtn.addEventListener('click', sendMessage);

    // 4. Input (Tecla Enter)
    const inputField = document.getElementById('chat-user-input');
    if(inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // 5. Generar preguntas por defecto
    const optionsContainer = document.getElementById('options-container');
    if(optionsContainer) {
        optionsContainer.innerHTML = ''; // Limpiar por si acaso
        defaultQuestions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = q.text;
            // Aquí asignamos el clic directamente al crear el botón
            btn.addEventListener('click', () => handleOptionClick(q.text, q.keyword));
            optionsContainer.appendChild(btn);
        });
    }
});

// --- LÓGICA DE MENSAJES ---
function appendMessage(text, sender) {
    const msgsDiv = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
    div.innerText = text;
    msgsDiv.appendChild(div);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

async function handleUserMessage(text, keyword = null) {
    appendMessage(text, 'user');

    try {
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }

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
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: response, sender: "bot", timestamp: serverTimestamp()
        });
    }, 600);
}

// Escuchar respuestas del Admin
const q = query(collection(db, "mensajes_chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            if (data.sender === 'admin' && data.sessionID === sessionID) {
                appendMessage(data.text, 'bot');
            }
        }
    });
});