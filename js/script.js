// --- LÓGICA GENERAL ---

// 1. Footer: Año actual
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Menú Móvil
const menuBtn = document.querySelector('nav button'); 
const mobileMenu = document.getElementById('mobile-menu');

if(menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// 3. Formulario de Contacto
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalContent = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;
        btn.style.opacity = "0.7";

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
            btn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
            btn.classList.add('bg-green-600', 'hover:bg-green-500');
            btn.style.opacity = "1";
            this.reset();

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.classList.add('bg-brand-600', 'hover:bg-brand-500');
                btn.classList.remove('bg-green-600', 'hover:bg-green-500');
            }, 3000);
        }, 1500);
    });
}

// 4. Navbar Sombra al Scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(nav) {
        if (window.scrollY > 0) nav.classList.add('shadow-lg');
        else nav.classList.remove('shadow-lg');
    }
});

// 5. Animaciones Scroll Reveal
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// --- 6. CHATBOT INTELIGENTE (FUNCIONES GLOBALES) ---

// Base de conocimientos
const knowledgeBase = {
    'precios': "Nuestros planes comienzan desde 9.99€ para webs básicas. El plan estándar es de 30€ y el premium desde 99.99€. ¿Te gustaría saber qué incluye alguno en específico?",
    'servicios': "Ofrezco Desarrollo Web, Bases de Datos, Estructuras Lógicas y E-commerce completo. Todo con tecnologías modernas como React, Node.js y Python.",
    'tiempos': "Los tiempos dependen del proyecto: aprox. 1 semana para el Básico, y de 2 a 4 semanas para desarrollos más complejos.",
    'humano': "¡Entendido! Un técnico humano revisará esta conversación y te contactará lo antes posible. Mientras tanto, ¿puedes dejarme tu correo?",
    'default': "Gracias por tu consulta. Un técnico especializado analizará tu mensaje y te responderá en breve con una solución personalizada."
};

// Hacer funciones accesibles globalmente para el HTML onclick
window.toggleChat = function() {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
        chatWindow.classList.toggle('flex');
        
        if (!chatWindow.classList.contains('hidden') && chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
    }
};

window.sendSuggestion = function(key) {
    let text = "";
    if(key === 'Precios') text = "¿Cuáles son los precios?";
    if(key === 'Servicios') text = "¿Qué servicios ofreces?";
    if(key === 'Tiempos') text = "¿Cuánto tardas en entregar?";
    if(key === 'Humano') text = "Quiero hablar con un humano";

    addMessage(text, 'user');
    simulateAIResponse(key.toLowerCase());
};

window.sendMessage = function() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput) return;

    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    
    let intent = 'default';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('vale')) intent = 'precios';
    else if (lowerText.includes('servicio') || lowerText.includes('haces')) intent = 'servicios';
    else if (lowerText.includes('tiempo') || lowerText.includes('tarda')) intent = 'tiempos';
    else if (lowerText.includes('humano') || lowerText.includes('persona')) intent = 'humano';

    simulateAIResponse(intent);
};

window.handleEnter = function(e) {
    if (e.key === 'Enter') sendMessage();
};

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const div = document.createElement('div');
    const isUser = sender === 'user';
    
    div.className = isUser 
        ? "self-end bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md"
        : "self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700";
    
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateAIResponse(intent) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const typingIndicator = document.createElement('div');
    typingIndicator.className = "self-start bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 w-12 flex items-center justify-center gap-1";
    typingIndicator.id = "typing-indicator";
    typingIndicator.innerHTML = `
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();

        const response = knowledgeBase[intent] || knowledgeBase['default'];
        addMessage(response, 'bot');
    }, 1500);
}