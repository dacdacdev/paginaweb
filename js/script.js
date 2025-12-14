document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURACIÓN GENERAL ---
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
                this.reset();
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- 2. CHATBOT INTELIGENTE ---
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    if (!chatToggleBtn || !chatWindow) return; // Seguridad

    const knowledgeBase = {
        'precios': "Nuestros planes comienzan desde 9.99€ para webs básicas.",
        'servicios': "Ofrezco Desarrollo Web, Bases de Datos, y E-commerce completo.",
        'tiempos': "Aprox. 1 semana para el Básico, y de 2 a 4 semanas para desarrollos complejos.",
        'humano': "¡Entendido! Un técnico revisará esta conversación y te contactará.",
        'default': "Gracias por tu consulta. Un técnico analizará tu mensaje."
    };

    function toggleChat() {
        chatWindow.classList.toggle('hidden');
        chatWindow.classList.toggle('flex');
        if (!chatWindow.classList.contains('hidden') && chatInput) setTimeout(() => chatInput.focus(), 100);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = sender === 'user' 
            ? "self-end bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md"
            : "self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700";
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function simulateAIResponse(intent) {
        const typingDiv = document.createElement('div');
        typingDiv.className = "self-start bg-slate-800 p-3 rounded-2xl w-12 flex gap-1";
        typingDiv.innerHTML = '<div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div><div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typingDiv.remove();
            addMessage(knowledgeBase[intent] || knowledgeBase['default'], 'bot');
        }, 1500);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        chatInput.value = '';
        
        let intent = 'default';
        const lower = text.toLowerCase();
        if (lower.includes('precio')) intent = 'precios';
        else if (lower.includes('servicio')) intent = 'servicios';
        else if (lower.includes('tiempo')) intent = 'tiempos';
        else if (lower.includes('humano')) intent = 'humano';
        
        simulateAIResponse(intent);
    }

    // Eventos
    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            addMessage(btn.innerText, 'user');
            simulateAIResponse(key.toLowerCase());
        });
    });
});