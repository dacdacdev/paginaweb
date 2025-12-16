import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE (TUS CREDENCIALES EXACTAS) ---
const firebaseConfig = {
    apiKey: "AIzaSyDqWjgoi8DwcZiXwp3nF1gQ0vvxZ39CUtQ",
    authDomain: "chatbot-web-v1.firebaseapp.com",
    projectId: "chatbot-web-v1",
    storageBucket: "chatbot-web-v1.firebasestorage.app", // Nota: Corregí un pequeño error común en el bucket si venía de auto-copia, pero este es el estándar
    messagingSenderId: "7994049270",
    appId: "1:7994049270:web:f5e6a2652065bf4680a2d7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID DE SESIÓN
const sessionID = localStorage.getItem('chatSessionID') || 'sess_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionID', sessionID);

const MUTE_KEY = 'bot_is_muted_' + sessionID;

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

// --- FUNCIONES VISUALES ---
function showTypingIndicator() {
    const msgsDiv = document.getElementById('chat-messages');
    if(document.getElementById('typing-dots-loader')) return;
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'typing-dots-loader';
    loaderDiv.className = 'typing-indicator bot-msg';
    loaderDiv.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    msgsDiv.appendChild(loaderDiv);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function hideTypingIndicator() {
    const loader = document.getElementById('typing-dots-loader');
    if (loader) loader.remove();
}

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
    div.innerHTML = text;
    msgsDiv.appendChild(div);
    msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

// --- LÓGICA DEL BOT (Versión Gatekeeper) ---
async function handleUserMessage(text, keyword = null) {
    appendMessage(text, 'user');
    try {
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }

    // Fase de decisión
    const lower = text.toLowerCase();
    let vipResponse = null;

    if (keyword && botKnowledge[keyword]) {
        vipResponse = botKnowledge[keyword];
    } else {
        for (const key in botKnowledge) {
            if (key !== "default" && lower.includes(key)) {
                vipResponse = botKnowledge[key];
                break;
            }
        }
    }

    if (vipResponse) {
        replyWithBot(vipResponse);
        return; 
    }

    const isMuted = localStorage.getItem(MUTE_KEY) === 'true';
    if (isMuted) return;

    replyWithBot(botKnowledge["default"]);
    localStorage.setItem(MUTE_KEY, 'true');
}

function replyWithBot(responseText) {
    showTypingIndicator();
    setTimeout(async () => {
        hideTypingIndicator();
        appendMessage(responseText, 'bot');
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: responseText, sender: "bot", timestamp: serverTimestamp()
        });
    }, 1000);
}

// --- LISTENER 1: Recibir mensajes ---
const q = query(collection(db, "mensajes_chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            // Si el ADMIN habla, mostramos mensaje y forzamos silencio del bot
            if (data.sender === 'admin' && data.sessionID === sessionID) {
                appendMessage(data.text, 'bot');
                localStorage.setItem(MUTE_KEY, 'true');
            }
        }
    });
});

// --- LISTENER 2 (NUEVO): Escuchar si el Admin está escribiendo ---
// Esto escucha un documento especial llamado "chat_status"
onSnapshot(doc(db, "chat_status", sessionID), (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.adminTyping === true) {
            showTypingIndicator(); // Admin escribe -> mostramos puntitos
        } else {
            hideTypingIndicator(); // Admin paró -> quitamos puntitos
        }
    }
});


// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    if(toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    const closeBtn = document.querySelector('.close-chat');
    if(closeBtn) closeBtn.addEventListener('click', toggleChat);
    const sendBtn = document.getElementById('chat-send-btn');
    if(sendBtn) sendBtn.addEventListener('click', sendMessage);
    const inputField = document.getElementById('chat-user-input');
    if(inputField) inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

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