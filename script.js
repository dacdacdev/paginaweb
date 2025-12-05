// script.js

// 1. Establecer el año actual automáticamente en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Funcionalidad del Menú Móvil (Hamburguesa)
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    // Alternar la clase 'hidden' para mostrar/ocultar
    menu.classList.toggle('hidden');
}

// 3. Manejo del Formulario de Contacto (Simulación)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    
    const btn = this.querySelector('button');
    const originalContent = btn.innerHTML;
    
    // Cambiar estado a "Enviando..."
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simular tiempo de espera de red (1.5 segundos)
    setTimeout(() => {
        // Mensaje de éxito
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje Enviado!';
        btn.classList.remove('bg-brand-600', 'hover:bg-brand-500');
        btn.classList.add('bg-green-600', 'hover:bg-green-500');
        btn.style.opacity = "1";
        
        // Limpiar los campos del formulario
        this.reset();

        // Restaurar el botón a su estado original después de 3 segundos
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