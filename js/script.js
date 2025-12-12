// 1. Establecer el año actual automáticamente en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Funcionalidad del Menú Móvil (Hamburguesa)
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// 3. Manejo del Formulario de Contacto (Simulación)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button');
    const originalContent = btn.innerHTML;
    
    // Cambiar estado a "Enviando..."
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simular tiempo de espera
    setTimeout(() => {
        // Mensaje de éxito
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
        btn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
        btn.classList.add('bg-green-600', 'hover:bg-green-500');
        btn.style.opacity = "1";
        
        // Limpiar formulario
        this.reset();

        // Restaurar botón
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            btn.classList.add('bg-brand-600', 'hover:bg-brand-500');
            btn.classList.remove('bg-green-600', 'hover:bg-green-500');
        }, 3000);
    }, 1500);
});

// 4. Efecto de sombra en el Navbar al hacer scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 0) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// --- 5. Sistema de Animación al hacer Scroll (Intersection Observer) ---
// Configuración: se activa cuando el 10% del elemento es visible
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
};

// Crear el observador
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Si el elemento entra en pantalla
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // Añade la clase CSS que activa la animación
            observer.unobserve(entry.target); // Deja de observar para que no se repita la animación
        }
    });
}, observerOptions);

// Buscar todos los elementos con la clase 'reveal' y empezar a observarlos
document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});