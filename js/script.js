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
        
        btn.innerHTML = 'Enviando...';
        btn.disabled = true;
        btn.style.opacity = "0.7";

        setTimeout(() => {
            btn.innerHTML = '¡Enviado!';
            this.reset();
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
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

// 5. Animaciones Scroll Reveal (Mantenemos esto si usas el CSS general)
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


// --- CHATBOT: VERSIÓN SIN DEPENDENCIAS (CSS NATIVO) ---
// Esta función inyecta sus propios estilos para no depender de Tailwind
function injectChatbot() {
    // Evitar duplicados
    if (document.getElementById('chat-widget-container')) return;

    // 1. DEFINIR ESTILOS NATIVOS (Garantiza que se vea)
    const cssStyles = `
        #chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        #chat-window {
            width: 320px;
            height: 450px;
            background-color: #0f172a; /* Fondo oscuro */
            border: 1px solid #334155;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            margin-bottom: 16px;
            display: none; /* Oculto por defecto */
            flex-direction: column;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #chat-window.open { display: flex; }
        .chat-header {
            background-color: #1e293b;
            padding: 16px;
            border-bottom: 1px solid #334155;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        }
        .chat-title { font-weight: bold; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .status-dot { width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; }
        .chat-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 20px; padding: 0; }
        .chat-close:hover { color: white; }
        
        #chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background-color: #0f172a;
        }
        .msg { padding: 10px 14px; border-radius: 12px; font-size: 14px; max-width: 85%; line-height: 1.4; }
        .msg.bot { background-color: #1e293b; color: #e2e8f0; border-top-left-radius: 0; border: 1px solid #334155; align-self: flex-start; }
        .msg.user { background-color: #2563eb; color: white; border-top-right-radius: 0; align-self: flex-end; }
        
        .chat-suggestions { padding: 12px; display: flex; gap: 8px; overflow-x: auto; border-top: 1px solid #1e293b; background-color: #0f172a; }
        .suggestion-btn {
            background-color: #1e293b;
            color: #60a5fa;
            border: 1px solid #334155;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .suggestion-btn:hover { background-color: #334155; color: white; border-color: #60a5fa; }

        .chat-input-area { padding: 12px; border-top: 1px solid #334155; background-color: #1e293b; display: flex; gap: 8px; }
        #chat-input {
            flex: 1;
            background-color: #0f172a;
            border: 1px solid #475569;
            border-radius: 20px;
            padding: 8px 16px;
            color: white;
            font-size: 14px;
            outline: none;
        }
        #chat-input:focus { border-color: #3b82f6; }
        #chat-send {
            background-color: #2563eb;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        #chat-send:hover { background-color: #1d4ed8; }

        #chat-toggle-btn {
            width: 60px;
            height: 60px;
            background-color: #2563eb; /* Azul brillante */
            border-radius: 50%;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        #chat-toggle-btn:hover { transform: scale(1.1); background-color: #1d4ed8; }
    `;

    // 2. INYECTAR ESTILOS
    const styleSheet = document.createElement("style");
    styleSheet.textContent = cssStyles;
    document.head.appendChild(styleSheet);

    // 3. INYECTAR HTML (Con iconos SVG directos)
    const chatHTML = `
        <div id="chat-widget-container">
            <div id="chat-window">
                <div class="chat-header">
                    <div class="chat-title">
                        <div class="status-dot"></div> Asistente IA
                    </div>
                    <button class="chat-close" id="chat-close-btn">&times;</button>
                </div>
                
                <div id="chat-messages">
                    <div class="msg bot">¡Hola! Soy la IA de DacDacDev. 👋 ¿En qué puedo ayudarte hoy?</div>
                </div>

                <div class="chat-suggestions">
                    <button class="suggestion-btn" data-msg="¿Cuáles son tus precios?">Precios</button>
                    <button class="suggestion-btn" data-msg="¿Qué servicios ofreces?">Servicios</button>
                    <button class="suggestion-btn" data-msg="Quiero hablar con un humano">Humano</button>
                </div>

                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe aquí...">
                    <button id="chat-send">➤</button>
                </div>
            </div>

            <button id="chat-toggle-btn">
                <!-- Icono de Chat SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // 4. LÓGICA DEL CHAT
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const windowEl = document.getElementById('chat-window');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesEl = document.getElementById('chat-messages');
    const suggestions = document.querySelectorAll('.suggestion-btn');

    // Base de conocimiento
    const knowledgeBase = {
        'precios': "Nuestros planes: Básico (9.99€), Estándar (30€), Premium (99.99€).",
        'servicios': "Desarrollo Web, Bases de Datos, APIs y E-commerce.",
        'humano': "He notificado a un técnico. Te contactaremos pronto.",
        'default': "Gracias. Un técnico analizará tu consulta."
    };

    const toggleChat = () => {
        windowEl.classList.toggle('open');
        if(windowEl.classList.contains('open')) input.focus();
    };

    const addMsg = (text, sender) => {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    const botReply = (text) => {
        // Indicador escribiendo
        const typing = document.createElement('div');
        typing.className = 'msg bot';
        typing.textContent = '...';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        setTimeout(() => {
            typing.remove();
            let reply = knowledgeBase['default'];
            const lower = text.toLowerCase();
            if(lower.includes('precio')) reply = knowledgeBase['precios'];
            else if(lower.includes('servicio')) reply = knowledgeBase['servicios'];
            else if(lower.includes('humano')) reply = knowledgeBase['humano'];
            
            addMsg(reply, 'bot');
        }, 800);
    };

    const send = () => {
        const text = input.value.trim();
        if(!text) return;
        addMsg(text, 'user');
        input.value = '';
        botReply(text);
    };

    // Eventos
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', send);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') send(); });
    
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-msg');
            addMsg(text, 'user');
            botReply(text);
        });
    });
}

// Iniciar inyección cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChatbot);
} else {
    injectChatbot();
}