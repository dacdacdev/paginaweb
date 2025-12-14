// --- LÓGICA GENERAL ---

// 1. Footer: Año actual
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Menú Móvil
const menuBtn = document.getElementById('mobile-menu-btn'); 
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


// --- CHATBOT: INYECCIÓN AUTOMÁTICA (SOLUCIÓN DEFINITIVA) ---
function injectChatbot() {
    // Evitar duplicados
    if (document.getElementById('chat-widget')) return;

    // 1. Crear el HTML del chat
    const chatHTML = `
        <div id="chat-widget" class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            <!-- Ventana del chat -->
            <div id="chat-window" class="hidden flex-col w-80 h-[28rem] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl mb-4 overflow-hidden transform transition-all duration-300 origin-bottom-right">
                <!-- Header -->
                <div class="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-white font-bold text-sm">Asistente IA</span>
                    </div>
                    <button id="chat-close-btn" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Mensajes -->
                <div id="chat-messages" class="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900">
                    <div class="self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700">
                        ¡Hola! Soy la IA de DacDacDev. 👋 ¿En qué puedo ayudarte hoy?
                    </div>
                </div>

                <!-- Sugerencias -->
                <div class="p-3 bg-slate-900 flex gap-2 overflow-x-auto border-t border-slate-800">
                    <button class="chat-suggestion whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-brand-500 text-xs px-3 py-1 rounded-full border border-slate-700 transition-colors" data-msg="¿Cuáles son tus precios?">Precios</button>
                    <button class="chat-suggestion whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-brand-500 text-xs px-3 py-1 rounded-full border border-slate-700 transition-colors" data-msg="¿Qué servicios ofreces?">Servicios</button>
                    <button class="chat-suggestion whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-brand-500 text-xs px-3 py-1 rounded-full border border-slate-700 transition-colors" data-msg="Quiero hablar con un humano">Humano</button>
                </div>

                <!-- Input -->
                <div class="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                    <input type="text" id="chat-input" placeholder="Escribe aquí..." class="flex-1 bg-slate-900 text-white text-sm rounded-full px-4 py-2 border border-slate-600 focus:outline-none focus:border-brand-500">
                    <button id="chat-send-btn" class="bg-brand-600 hover:bg-brand-500 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                        <i class="fas fa-paper-plane text-xs"></i>
                    </button>
                </div>
            </div>

            <!-- Botón Flotante -->
            <button id="chat-toggle-btn" class="bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center w-14 h-14">
                <i class="fas fa-robot text-2xl"></i>
            </button>
        </div>
    `;

    // 2. Insertar en el body
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // 3. Capturar elementos
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const windowEl = document.getElementById('chat-window');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messages = document.getElementById('chat-messages');
    const suggestions = document.querySelectorAll('.chat-suggestion');

    // 4. Lógica del Chat
    const toggleChat = () => {
        windowEl.classList.toggle('hidden');
        windowEl.classList.toggle('flex');
        if(!windowEl.classList.contains('hidden')) input.focus();
    };

    const addMessage = (text, sender) => {
        const div = document.createElement('div');
        div.className = sender === 'user' 
            ? "self-end bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md" 
            : "self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700";
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const botReply = (text) => {
        // Indicador escribiendo
        const typing = document.createElement('div');
        typing.className = "self-start bg-slate-800 p-3 rounded-2xl w-12 flex gap-1 border border-slate-700";
        typing.innerHTML = '<div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div><div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        // Respuesta simple
        setTimeout(() => {
            typing.remove();
            let reply = "Gracias. Un técnico revisará tu mensaje pronto.";
            const lower = text.toLowerCase();
            
            if(lower.includes('precio')) reply = "Precios desde: 9.99€ (Básico), 30€ (Estándar), 99.99€ (Premium).";
            else if(lower.includes('servicio')) reply = "Ofrezco Desarrollo Web, Bases de Datos y E-commerce completo.";
            else if(lower.includes('humano')) reply = "He notificado a un humano. Te contactarán por email.";
            
            addMessage(reply, 'bot');
        }, 1000);
    };

    const send = () => {
        const text = input.value.trim();
        if(!text) return;
        addMessage(text, 'user');
        input.value = '';
        botReply(text);
    };

    // 5. Asignar Eventos
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', send);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') send(); });

    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-msg');
            addMessage(text, 'user');
            botReply(text);
        });
    });
}

// Ejecutar la inyección
injectChatbot();