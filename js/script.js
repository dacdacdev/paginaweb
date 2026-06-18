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

// 3. Navbar Sombra
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(nav) {
        if (window.scrollY > 0) nav.classList.add('shadow-lg');
        else nav.classList.remove('shadow-lg');
    }
});

// 4. Animaciones Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 5. SOLUCIÓN AGRESIVA: Formulario a WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Quitamos cualquier posible listener previo reseteando el formulario
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            
            console.log("Formulario interceptado. Iniciando redirección...");

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const plan = document.getElementById('plan').value;
            const message = document.getElementById('message').value;

            // NÚMERO DIRECTO SIN ESPACIOS
            const telefono = "34611030269"; 
            const texto = `¡Hola Jose Andrés! 🚀\n\nSoy ${name}.\n📧 Mi correo: ${email}\n💼 Plan: ${plan}\n\nDetalles: "${message}"`;
            
            const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

            // Fuerza la redirección en la misma ventana
            window.location.href = url;
            
            return false;
        };
    }
});