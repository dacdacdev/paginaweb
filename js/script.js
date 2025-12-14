// --- LÓGICA GENERAL ---

// 1. Footer: Año actual
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Menú Móvil
const menuBtn = document.getElementById('mobile-menu-btn'); 
const mobileMenu = document.getElementById('mobile-menu');

if(menuBtn && mobileMenu) {
    // Clonamos para eliminar listeners antiguos
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    
    newMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// 3. Formulario de Contacto
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);

    newForm.addEventListener('submit', function(e) {
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

// 4. Navbar Sombra
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


// --- 6. CHATBOT: VERSIÓN A PRUEBA DE FALLOS ---
function injectChatbot() {
    // 1. LIMPIEZA DE CÓDIGO ZOMBIE
    // Buscamos y eliminamos cualquier widget antiguo que pueda estar oculto o roto
    const oldIds = ['chat-widget', 'chat-widget-container', 'ai-bot-container'];
    oldIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.remove();
    });

    console.log("Inyectando nuevo Chatbot...");

    // 2. ESTILOS FORZADOS (Garantiza visibilidad sobre cualquier otra cosa)
    const cssStyles = `
        #ai-bot-container {
            position: fixed !important;
            bottom: 25px !important;
            right: 25px !important;
            z-index: 999999 !important; /* Capa más alta posible */
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none; /* Permite clicks a través del contenedor vacío */
        }
        
        /* Elementos interactivos activan el puntero */
        #ai-bot-window, #ai-bot-toggle {
            pointer-events: auto; 
        }

        #ai-bot-window {
            width: 320px;
            height: 480px;
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            margin-bottom: 20px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        #ai-bot-window.open { 
            display: flex; 
            opacity: 1; 
            transform: translateY(0); 
        }

        .ai-header {
            background-color: #1e293b;
            padding: 16px;
            border-bottom: 1px solid #334155;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
        }
        
        #ai-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background-color: #0f172a;
        }
        
        .ai-msg { padding: 10px 14px; border-radius: 12px; font-size: 14px; max-width: 85%; line-height: 1.4; }
        .ai-msg.bot { background-color: #1e293b; color: #e2e8f0; border-top-left-radius: 0; border: 1px solid #334155; align-self: flex-start; }
        .ai-msg.user { background-color: #2563eb; color: white; border-top-right-radius: 0; align-self: flex-end; }
        
        .ai-suggestions { padding: 12px; display: flex; gap: 8px; overflow-x: auto; border-top: 1px solid #1e293b; background-color: #0f172a; }
        .ai-chip {
            background-color: #1e293b;
            color: #60a5fa;
            border: 1px solid #334155;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: 0.2s;
        }
        .ai-chip:hover { background-color: #2563eb; color: white; border-color: #2563eb; }

        .ai-input-area { padding: 12px; border-top: 1px solid #334155; background-color: #1e293b; display: flex; gap: 8px; }
        #ai-input {
            flex: 1;
            background-color: #0f172a;
            border: 1px solid #475569;
            border-radius: 20px;
            padding: 8px 16px;
            color: white;
            font-size: 14px;
            outline: none;
        }
        
        #ai-bot-toggle {
            width: 60px;
            height: 60px;
            background-color: #2563eb;
            border-radius: 50%;
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        #ai-bot-toggle:hover { transform: scale(1.1); }
    `;

    // Inyectar estilos (evitando duplicados)
    if (!document.getElementById('ai-chat-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ai-chat-styles';
        styleSheet.textContent = cssStyles;
        document.head.appendChild(styleSheet);
    }

    // 3. HTML DEL CHAT (Con IDs únicos 'ai-')
    const chatHTML = `
        <div id="ai-bot-container">
            <div id="ai-bot-window">
                <div class="ai-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:8px; height:8px; background:#22c55e; border-radius:50%;"></div>
                        <strong>Asistente IA</strong>
                    </div>
                    <button id="ai-close-btn" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer;">&times;</button>
                </div>
                
                <div id="ai-messages">
                    <div class="ai-msg bot">¡Hola! Soy la IA de DacDacDev. 🤖<br>¿En qué puedo ayudarte?</div>
                </div>

                <div class="ai-suggestions">
                    <button class="ai-chip" data-msg="Ver precios">Precios</button>
                    <button class="ai-chip" data-msg="Servicios">Servicios</button>
                    <button class="ai-chip" data-msg="Hablar con humano">Humano</button>
                </div>

                <div class="ai-input-area">
                    <input type="text" id="ai-input" placeholder="Escribe aquí...">
                    <button id="ai-send" style="background:none; border:none; color:#60a5fa; cursor:pointer; font-size:18px;">➤</button>
                </div>
            </div>

            <button id="ai-bot-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // 4. LÓGICA DE INTERACCIÓN
    const toggleBtn = document.getElementById('ai-bot-toggle');
    const closeBtn = document.getElementById('ai-close-btn');
    const windowEl = document.getElementById('ai-bot-window');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send');
    const messagesEl = document.getElementById('ai-messages');
    const chips = document.querySelectorAll('.ai-chip');

    // Base de conocimiento
    const answers = {
        'precios': "Plan Básico: 9.99€ | Estándar: 30€ | Premium: 99.99€",
        'servicios': "Desarrollo Web, Bases de Datos, APIs y E-commerce completo.",
        'humano': "He notificado a un técnico. Te escribiremos a tu correo pronto.",
        'default': "Entendido. Un especialista revisará tu consulta en breve."
    };

    const toggle = () => {
        const isOpen = windowEl.classList.contains('open');
        if (isOpen) {
            windowEl.classList.remove('open');
            setTimeout(() => windowEl.style.display = 'none', 300); // Esperar animación
        } else {
            windowEl.style.display = 'flex';
            // Pequeño timeout para permitir que el display:flex se aplique antes de la opacidad
            setTimeout(() => windowEl.classList.add('open'), 10);
            input.focus();
        }
    };

    const addMsg = (text, type) => {
        const div = document.createElement('div');
        div.className = `ai-msg ${type}`;
        div.innerHTML = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    const processInput = (text) => {
        addMsg(text, 'user');
        
        // Simular "escribiendo..."
        const typing = document.createElement('div');
        typing.className = 'ai-msg bot';
        typing.innerText = '...';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        setTimeout(() => {
            typing.remove();
            let reply = answers['default'];
            const lower = text.toLowerCase();
            
            if(lower.includes('precio') || lower.includes('costo')) reply = answers['precios'];
            else if(lower.includes('servicio')) reply = answers['servicios'];
            else if(lower.includes('humano') || lower.includes('persona')) reply = answers['humano'];
            
            addMsg(reply, 'bot');
        }, 800);
    };

    // Listeners
    toggleBtn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', toggle);
    
    sendBtn.addEventListener('click', () => {
        if(input.value.trim()) {
            processInput(input.value.trim());
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && input.value.trim()) {
            processInput(input.value.trim());
            input.value = '';
        }
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            processInput(chip.getAttribute('data-msg'));
        });
    });
}

// Iniciar cuando el contenido esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChatbot);
} else {
    injectChatbot();
}