import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE (Asegúrate de que tus datos siguen aquí) ---
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

// CLAVE PARA EL SILENCIO (Usamos una clave única por sesión)
const MUTE_KEY = 'botMuted_' + sessionID;

const botKnowledge = {
    "precios": "Nuestros servicios empiezan desde 0€ para el plan básico.",
    "horario": "Estamos abiertos de Lunes a Viernes de 9:00 a 18:00.",
    "contacto": "Te paso con un humano. Deja tu correo y te escribimos.",
    "default": "Entiendo. He notificado a un agente humano. Te responderemos pronto y dejaré de interrumpir."
};

const defaultQuestions = [
    { text: "¿Precios?", keyword: "precios" },
    { text: "¿Horario?", keyword: "horario" },
    { text: "Soporte Humano", keyword: "contacto" }
];

// --- FUNCIONES UI ---
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

// --- LÓGICA PRINCIPAL DEL BOT (CORREGIDA) ---
async function handleUserMessage(text, keyword = null) {
    appendMessage(text, 'user');

    // 1. Guardar mensaje del usuario
    try {
        await addDoc(collection(db, "mensajes_chat"), {
            sessionID: sessionID, text: text, sender: "user", timestamp: serverTimestamp(), read: false
        });
    } catch (e) { console.error("Error DB:", e); }

    // 2. LEER ESTADO DE SILENCIO DIRECTAMENTE DEL STORAGE
    // Esto asegura que leemos el valor real actual
    const isMuted = localStorage.getItem(MUTE_KEY) === 'true';
    console.log("Estado del Bot (Silenciado):", isMuted);

    let response = null;
    let shouldReply = true;
    const lower = text.toLowerCase();

    // Prioridad 1: Palabras clave conocidas (El bot SIEMPRE responde a esto, aunque esté silenciado)
    if (keyword && botKnowledge[keyword]) {
        response = botKnowledge[keyword];
    } else {
        // Buscar keywords en el texto
        let found = false;
        for (const key in botKnowledge) {
            if (key !== "default" && lower.includes(key)) {
                response = botKnowledge[key];
                found = true;
                break;
            }
        }

        // Prioridad 2: No entendió nada
        if (!found) {
            if (isMuted) {
                // SI YA ESTÁ SILENCIADO -> NO HACEMOS NADA
                console.log("El bot está silenciado. No responderá.");
                shouldReply = false;
            } else {
                // SI ES LA PRIMERA VEZ -> RESPONDE Y SE SILENCIA
                console.log("No entiendo. Respondo default y me silencio.");
                response = botKnowledge["default"];
                // Activamos el silencio inmediatamente
                localStorage.setItem(MUTE_KEY, 'true');
            }
        }
    }

    // 3. Ejecutar respuesta si corresponde
    if (shouldReply && response) {
        showTypingIndicator();
        setTimeout(async () => {
            hideTypingIndicator();
            appendMessage(response, 'bot');
            
            await addDoc(collection(db, "mensajes_chat"), {
                sessionID: sessionID, text: response, sender: "bot", timestamp: serverTimestamp()
            });
        }, 1000);
    }
}

// --- ESCUCHAR AL ADMIN---
const q = query(collection(db, "mensajes_chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const data = change.doc.data();
            if (data.sender === 'admin' && data.sessionID === sessionID) {
                appendMessage(data.text, 'bot');
                localStorage.setItem(MUTE_KEY, 'true'); 
                console.log("Admin habló. Bot mantenido en silencio.");
            }
        }
    });
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