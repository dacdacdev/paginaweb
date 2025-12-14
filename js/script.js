// 1. Establecer el año actual automáticamente en el footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Funcionalidad del Menú Móvil (Hamburguesa)
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('hidden');
}

// 3. Manejo del Formulario de Contacto (Simulación)
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button');
        const originalContent = btn.innerHTML;
        
        // Cambiar estado a "Enviando..."
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;
        btn.style.opacity = "0.7";

        // Simular tiempo de espera (1.5 segundos)
        setTimeout(() => {
            // Mensaje de éxito
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
            btn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
            btn.classList.add('bg-green-600', 'hover:bg-green-500');
            btn.style.opacity = "1";
            
            // Limpiar formulario
            this.reset();

            // Restaurar botón a su estado original después de 3 segundos
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.classList.add('bg-brand-600', 'hover:bg-brand-500');
                btn.classList.remove('bg-green-600', 'hover:bg-green-500');
            }, 3000);
        }, 1500);
    });
}

// 4. Efecto de sombra en el Navbar al hacer scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(nav) {
        if (window.scrollY > 0) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    }
});

// 5. Sistema de Animación al hacer Scroll (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// --- 6. FUNCIONALIDAD DEL CHATBOT INTELIGENTE ---

const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatToggleBtn = document.getElementById('chat-toggle-btn');

// Base de conocimientos simple para la IA
const knowledgeBase = {
    'precios': "Nuestros planes comienzan desde 350€ para webs básicas. El plan estándar es de 950€ y el premium desde 2500€. ¿Te gustaría saber qué incluye alguno en específico?",
    'servicios': "Ofrezco Desarrollo Web, Bases de Datos, Estructuras Lógicas y E-commerce completo. Todo con tecnologías modernas como React, Node.js y Python.",
    'tiempos': "Los tiempos dependen del proyecto: aprox. 1 semana para el Básico, y de 2 a 4 semanas para desarrollos más complejos.",
    'humano': "¡Entendido! Un técnico humano revisará esta conversación y te contactará lo antes posible. Mientras tanto, ¿puedes dejarme tu correo?",
    'default': "Gracias por tu consulta. Un técnico especializado analizará tu mensaje y te responderá en breve con una solución personalizada."
};

// Alternar visibilidad del chat
function toggleChat() {
    chatWindow.classList.toggle('hidden');
    chatWindow.classList.toggle('flex');
    // Si se abre, poner foco en el input
    if(!chatWindow.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 100);
    }
}

// Enviar sugerencia (chips)
function sendSuggestion(key) {
    let text = "";
    // Mapear la clave al texto visible del botón (simulado)
    if(key === 'Precios') text = "¿Cuáles son los precios?";
    if(key === 'Servicios') text = "¿Qué servicios ofreces?";
    if(key === 'Tiempos') text = "¿Cuánto tardas en entregar?";
    if(key === 'Humano') text = "Quiero hablar con un humano";

    addMessage(text, 'user');
    simulateAIResponse(key.toLowerCase());
}

// Enviar mensaje desde el input
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    
    // Lógica simple para detectar intención (muy básica)
    let intent = 'default';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('vale')) intent = 'precios';
    else if (lowerText.includes('servicio') || lowerText.includes('haces')) intent = 'servicios';
    else if (lowerText.includes('tiempo') || lowerText.includes('tarda')) intent = 'tiempos';
    else if (lowerText.includes('humano') || lowerText.includes('persona')) intent = 'humano';

    simulateAIResponse(intent);
}

// Manejar tecla Enter
function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// Añadir mensaje al DOM
function addMessage(text, sender) {
    const div = document.createElement('div');
    const isUser = sender === 'user';
    
    div.className = isUser 
        ? "self-end bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md"
        : "self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700";
    
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll al fondo
}

// Simular respuesta de la IA
function simulateAIResponse(intent) {
    // Mostrar indicador de "escribiendo..."
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

    // Retraso aleatorio para parecer humano/IA procesando (1-2 segundos)
    setTimeout(() => {
        // Eliminar indicador
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();

        // Responder
        const response = knowledgeBase[intent] || knowledgeBase['default'];
        addMessage(response, 'bot');
    }, 1500);
}