// js/script.js

// 1. Manejo de la pantalla de carga (Loader)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Espera a que termine la transición de opacidad
    }
});

// 2. Validación y UX del Formulario de Contacto (Formspree)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const btn = this.querySelector('button[type="submit"]');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const plan = document.getElementById('plan').value;

        // Validación estricta anti-errores
        if (!name || !email || !message || !plan) {
            e.preventDefault(); // Detiene el envío
            alert('Faltan datos tácticos. Completa todos los campos antes de enviar.');
            return;
        }

        // Efecto visual premium mientras Formspree procesa
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin text-lg"></i> Encriptando y Enviando...';
        btn.classList.add('opacity-75', 'cursor-not-allowed', 'pointer-events-none');
        
        // El formulario seguirá su curso natural hacia Formspree
    });
}


// 3. Monitor de Errores Globales (Admin Panel)
window.addEventListener('error', function(event) {
    // 
    const errorLog = {
        mensaje: event.message,
        archivo: event.filename,
        linea: event.lineno,
        fecha: new Date().toISOString(),
        url: window.location.href
    };
    
    console.warn("🔥 [DacDacDev Error Monitor] Anomalía detectada:", errorLog);
});


// 2. Footer: Año actual
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// 3. Menú Móvil
const menuBtn = document.getElementById('mobile-menu-btn'); 
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
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
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


