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
    threshold: 0.1 // Se activa cuando el 10% del elemento entra en pantalla
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // Añade la clase CSS para animar
            observer.unobserve(entry.target); // Deja de observar una vez animado
        }
    });
}, observerOptions);

// Aplicar el observador a todos los elementos con la clase 'reveal'
document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// --- 6. FUNCIONALIDAD DEL MODAL DE VISTA PREVIA ---

// Función para abrir el modal con la URL del proyecto
function openPreview(url) {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewFrame');
    const loader = document.getElementById('loadingIndicator');
    const externalLink = document.getElementById('externalLink');
    
    // Verificación de seguridad: si no encuentra los elementos, no hace nada
    if (!modal || !iframe) return;

    // Actualizar el botón de "Abrir en pestaña nueva" con la URL correcta
    if(externalLink) externalLink.href = url;

    // Resetear el iframe y mostrar el spinner de carga
    iframe.src = "";
    if(loader) loader.classList.remove('hidden');
    
    // Mostrar el modal y bloquear el scroll de la página principal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
    
    // Cargar la URL en el iframe con un pequeño retraso
    setTimeout(() => {
        iframe.src = url;
    }, 50);
}

// Función para cerrar el modal
function closePreview() {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewFrame');
    
    if (!modal || !iframe) return;
    
    modal.classList.add('hidden');
    iframe.src = ""; // Limpiar src para detener la ejecución de la web interna
    document.body.style.overflow = ''; // Restaurar el scroll de la página
}

// Event Listeners para cerrar el modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('previewModal');
    
    if(modal) {
        // Cerrar al hacer click fuera del contenido (en el fondo oscuro)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePreview();
            }
        });
    }

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePreview();
        }
    });
});