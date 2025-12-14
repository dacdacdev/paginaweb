// --- LÓGICA GENERAL DE LA WEB ---

// 1. Footer: Año actual
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Menú Móvil
const menuBtn = document.getElementById('mobile-menu-btn'); 
const mobileMenu = document.getElementById('mobile-menu');

if(menuBtn && mobileMenu) {
    // Clonamos para asegurar limpieza de eventos
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


// --- 6. CHATBOT: VERSIÓN "FUERZA BRUTA" (Inyección Directa Garantizada) ---
(function() {
    function initChat() {
        // 1. Limpieza preventiva
        const existing = document.getElementById('support-widget-container');
        if (existing) existing.remove();

        // 2. Crear contenedor principal
        const container = document.createElement('div');
        container.id = 'support-widget-container';
        
        // Estilos FORZADOS con JavaScript (No depende de CSS externo)
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '2147483647', // El valor más alto posible
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontFamily: 'sans-serif',
            pointerEvents: 'none' // Permite clicks a través del área vacía
        });

        // 3. HTML del Chat (Con estilos inline para asegurar visualización)
        container.innerHTML = `
            <style>
                /* Estilos internos para asegurar que se vea bien */
                #support-window {
                    width: 320px;
                    height: 450px;
                    background: #1e293b; /* Slate 800 */
                    border: 1px solid #475569;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: none; /* Oculto al inicio */
                    flex-direction: column;
                    margin-bottom: 15px;
                    overflow: hidden;
                    pointer-events: auto; /* Reactivar clicks */
                }
                #support-header {
                    background: #0f172a;
                    padding: 15px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #334155;
                }
                #support-messages {
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    color: #cbd5e1;
                    font-size: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: #1e293b;
                }
                .msg-bot { align-self: flex-start; background: #334155; padding: 10px 14px; border-radius: 12px 12px 12px 0; max-width: 85%; }
                .msg-user { align-self: flex-end; background: #2563eb; color: white; padding: 10px 14px; border-radius: 12px 12px 0 12px; max-width: 85%; }
                
                #support-controls {
                    padding: 12px;
                    background: #0f172a;
                    border-top: 1px solid #334155;
                    pointer-events: auto;
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                }
                .quick-reply {
                    background: #334155;
                    border: 1px solid #475569;
                    color: #60a5fa;
                    padding: 6px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    white-space: nowrap;
                    transition: 0.2s;
                }
                .quick-reply:hover { background: #475569; color: white; }

                /* BOTÓN FLOTANTE */
                #support-btn {
                    width: 60px;
                    height: 60px;
                    background: #2563eb; /* Azul brillante */
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 30px;
                    pointer-events: auto;
                    transition: transform 0.2s;
                }
                #support-btn:hover { transform: scale(1.1); }
            </style>

            <!-- Ventana del Chat -->
            <div id="support-window">
                <div id="support-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:8px; height:8px; background:#22c55e; border-radius:50%;"></div>
                        <strong>Asistente IA</strong>
                    </div>
                    <button id="close-chat" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:24px;">&times;</button>
                </div>
                <div id="support-messages">
                    <div class="msg-bot">¡Hola! 👋 Soy la IA de DacDacDev.<br>¿En qué puedo ayudarte hoy?</div>
                </div>
                <div id="support-controls">
                    <button class="quick-reply" data-msg="Ver precios">Precios</button>
                    <button class="quick-reply" data-msg="Ver servicios">Servicios</button>
                    <button class="quick-reply" data-msg="Hablar con humano">Humano</button>
                </div>
            </div>

            <!-- Botón Principal -->
            <button id="support-btn">💬</button>
        `;

        document.body.appendChild(container);

        // 4. FUNCIONALIDAD
        const btn = document.getElementById('support-btn');
        const windowEl = document.getElementById('support-window');
        const closeEl = document.getElementById('close-chat');
        const msgsEl = document.getElementById('support-messages');
        const replies = document.querySelectorAll('.quick-reply');

        // Función Toggle
        function toggle() {
            if (windowEl.style.display === 'none' || windowEl.style.display === '') {
                windowEl.style.display = 'flex';
                btn.style.display = 'none'; // Ocultar botón al abrir
            } else {
                windowEl.style.display = 'none';
                btn.style.display = 'flex'; // Mostrar botón al cerrar
            }
        }

        btn.onclick = toggle;
        closeEl.onclick = toggle;

        // Base de Respuestas
        const responses = {
            'Ver precios': 'Plan Básico: 9.99€ | Estándar: 30€ | Premium: 99.99€',
            'Ver servicios': 'Desarrollo Web, Bases de Datos, APIs y E-commerce completo.',
            'Hablar con humano': 'He notificado a un técnico. Te escribiremos a tu correo pronto.'
        };

        // Click en sugerencias
        replies.forEach(r => {
            r.onclick = function() {
                const text = this.getAttribute('data-msg'); // Usar el texto de datos
                
                // Mensaje usuario
                const uDiv = document.createElement('div');
                uDiv.className = 'msg-user';
                uDiv.innerText = text;
                msgsEl.appendChild(uDiv);
                msgsEl.scrollTop = msgsEl.scrollHeight;
                
                // Respuesta bot (simulada)
                setTimeout(() => {
                    const bDiv = document.createElement('div');
                    bDiv.className = 'msg-bot';
                    bDiv.innerText = responses[text] || 'Entendido, un técnico revisará tu consulta.';
                    msgsEl.appendChild(bDiv);
                    msgsEl.scrollTop = msgsEl.scrollHeight;
                }, 600);
            }
        });
    }

    // Ejecutar inicialización (Soporte para carga asíncrona)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initChat();
    } else {
        window.addEventListener('DOMContentLoaded', initChat);
    }
})();