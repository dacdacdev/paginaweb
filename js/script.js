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

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Evitamos que la página se recargue al enviar
            e.preventDefault();

            // Recogemos los datos que ha escrito el cliente
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // ⚠️ AQUÍ TU NÚMERO: Pon tu móvil pegado al código de España (34)
            const telefono = "34600000000"; 

            // Construimos el mensaje predefinido que te va a llegar
            const texto = `¡Hola Jose Andrés! 🚀\n\nSoy ${name}.\nMi email es: ${email}\n\nTe escribo desde tu portafolio por lo siguiente:\n"${message}"`;

            // Codificamos el texto para que los espacios y saltos de línea funcionen en la URL
            const textoCodificado = encodeURIComponent(texto);

            // Creamos el enlace de la API de WhatsApp
            const url = `https://wa.me/${telefono}?text=${textoCodificado}`;

            // Abrimos WhatsApp en una pestaña nueva
            window.open(url, '_blank');

            // Limpiamos el formulario para que quede vacío
            contactForm.reset();
        });
    }
});