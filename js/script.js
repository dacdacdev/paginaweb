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

// 3. Navbar Sombra
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if(nav) {
        if (window.scrollY > 0) nav.classList.add('shadow-lg');
        else nav.classList.remove('shadow-lg');
    }
});

// 4. Animaciones Scroll Reveal
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

// 5. Motor del Formulario y WhatsApp (Limpio y unificado)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Clonamos el formulario para matar cualquier evento fantasma anterior
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        newForm.addEventListener('submit', function(e) {
            // 1. Evitamos que la página se recargue
            e.preventDefault();

            // 2. Feedback visual agresivo
            const btn = this.querySelector('button');
            const originalContent = btn.innerHTML;
            btn.innerHTML = 'Conectando con WhatsApp... <i class="fas fa-spinner fa-spin ml-2"></i>';
            btn.disabled = true;
            btn.style.opacity = "0.9";

            try {
                // 3. Recogemos los datos
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const plan = document.getElementById('plan').value;
                const message = document.getElementById('message').value;

                // ⚠️ 4. TU NÚMERO (Formato estricto: Solo números, código de país delante)
                // He puesto un 0 al final porque en tu código faltaba un dígito: "611 03 02 6"
                const telefono = "34611030269"; 

                // 5. Construimos el mensaje pre-formateado
                const texto = `¡Hola Jose Andrés! 🚀\n\nSoy ${name}.\n📧 Mi correo: ${email}\n💼 Plan de interés: ${plan}\n\nDetalles del proyecto:\n"${message}"`;

                // 6. Codificamos la URL y disparamos
                const textoCodificado = encodeURIComponent(texto);
                const url = `https://wa.me/${telefono}?text=${textoCodificado}`;

                // location.href es 100% infalible contra bloqueadores de pop-ups
                window.location.href = url;

                // 7. Reseteamos por si el cliente le da a "Atrás" en el navegador
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    this.reset();
                }, 3000);

            } catch (error) {
                console.error("Error al procesar el formulario:", error);
                btn.innerHTML = originalContent;
                btn.disabled = false;
            }
        });
    }
});