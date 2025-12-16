import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDqWjgoi8DwcZiXwp3nF1gQ0vvxZ39CUtQ",
    authDomain: "chatbot-web-v1.firebaseapp.com",
    projectId: "chatbot-web-v1",
    storageBucket: "chatbot-web-v1.firebasestorage.app",
    messagingSenderId: "7994049270",
    appId: "1:7994049270:web:f5e6a2652065bf4680a2d7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID DE SESIÓN 
const sessionID = localStorage.getItem('chatSessionID') || 'sess_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('chatSessionID', sessionID);

// CLAVE MAESTRA DE SILENCIO
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

// --- LÓGICA DEL BOT (REESCRITA - MÉTODO GATEKEEPER) ---
async function handleUserMessage(text, keyword = null) {
    // 1. Mostrar mensaje del usuario y guardar en BD
    appendMessage(text, 'user');
    try {
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }


    // --- FASE DE DECISIÓN (AQUÍ ESTÁ LA MAGIA) ---

    // Paso A: ¿Es una palabra clave VIP? (Precios, Horario...)
    // Si es VIP, respondemos SIEMPRE, esté muteado o no.
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
        console.log("Palabra clave detectada. Respondiendo...");
        replyWithBot(vipResponse);
        return; 
    }

    const isMuted = localStorage.getItem(MUTE_KEY) === 'true';
    
    if (isMuted) {
        console.log("El bot está silenciado (MUTE ON). No responde nada.");
        return;
    }

    console.log("Primera vez que no entiendo. Respondo Default y ACTIVO SILENCIO.");
    
    // 1. Respondemos con el default
    replyWithBot(botKnowledge["default"]);
    
    // 2. ACTIVAMOS EL SILENCIO ETERNO
    localStorage.setItem(MUTE_KEY, 'true');
}


// Función auxiliar para responder 
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


// --- ESCUCHAR AL ADMIN ---
const q = query(collection(db, "mensajes_chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            
            // Si el ADMIN habla...
            if (data.sender === 'admin' && data.sessionID === sessionID) {
                appendMessage(data.text, 'bot');
                
                // ...aseguramos que el bot se calle la boca inmediatamente.
                localStorage.setItem(MUTE_KEY, 'true');
                console.log("Admin intervino. Silencio forzado activado.");
            }
        }
    });
});


// --- EVENT LISTENER ---
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