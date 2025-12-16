import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE---
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TUS_NUMEROS",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sessionID = localStorage.getItem('chatSessionID') || 'sess_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionID', sessionID);

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

// Función para mostrar los 3 puntitos de "escribiendo..."
function showTypingIndicator() {
    const msgsDiv = document.getElementById('chat-messages');
    if(document.getElementById('typing-dots-loader')) return;

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'typing-dots-loader';
    loaderDiv.className = 'typing-indicator bot-msg';
    loaderDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    msgsDiv.appendChild(loaderDiv);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

// Función para quitar los 3 puntitos
function hideTypingIndicator() {
    const loader = document.getElementById('typing-dots-loader');
    if (loader) loader.remove();
}


// --- FUNCIONES LÓGICAS PRINCIPALES ---

function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.classList.toggle('open');
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

function appendMessage(text, sender) {
    const msgsDiv = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `message ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
    // Usamos innerHTML para permitir saltos de línea si la respuesta los tuviera
    div.innerHTML = text; 
    msgsDiv.appendChild(div);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}


// --- LÓGICA DEL BOT MEJORADA CON INDICADOR DE CARGA ---
async function handleUserMessage(text, keyword = null) {
    // 1. Mostrar mensaje del usuario inmediatamente
    appendMessage(text, 'user');

    // 2. Guardar en Firebase (en segundo plano)
    try {
        addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }

    // 3. MOSTRAR INDICADOR DE ESCRIBIENDO...
    showTypingIndicator();

    // 4. Simular tiempo de "pensar"
    setTimeout(async () => {
        // Calcular respuesta
        let response = botKnowledge["default"];
        const lower = text.toLowerCase();
        if (keyword && botKnowledge[keyword]) response = botKnowledge[keyword];
        else {
            for (const key in botKnowledge) {
                if (lower.includes(key)) { response = botKnowledge[key]; break; }
            }
        }

        // 5. OCULTAR INDICADOR Y MOSTRAR RESPUESTA
        hideTypingIndicator();
        appendMessage(response, 'bot');
        
        // Guardar respuesta del bot
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: response, sender: "bot", timestamp: serverTimestamp()
        });

    }, 1500);
}


// --- INICIALIZACIÓN DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    if(toggleBtn) toggleBtn.addEventListener('click', toggleChat);

    const closeBtn = document.querySelector('.close-chat');
    if(closeBtn) closeBtn.addEventListener('click', toggleChat);

    const sendBtn = document.getElementById('chat-send-btn');
    if(sendBtn) sendBtn.addEventListener('click', sendMessage);

    const inputField = document.getElementById('chat-user-input');
    if(inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    const optionsContainer = document.getElementById('options-container');
    if(optionsContainer) {
        optionsContainer.innerHTML = '';
        defaultQuestions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = q.text;
            btn.addEventListener('click', () => handleOptionClick(q.text, q.keyword));
            optionsContainer.appendChild(btn);
        });
    }
});

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