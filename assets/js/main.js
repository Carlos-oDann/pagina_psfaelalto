document.addEventListener('DOMContentLoaded', () => {

    console.log("Sistema Parroquial Iniciado...");

    // Accedemos a las funciones globales
    const { construirHeader, construirPortada, construirFooter } = window.Parroquia;

    // 1. Construir el Menú de Navegación
    if (construirHeader) construirHeader();

    // 2. Construir la Portada (Solo si existe el contenedor en la página actual)
    if (construirPortada) construirPortada();

    // 3. Construir el Pie de Página
    if (construirFooter) construirFooter();

});

/* =====================================================
   MAIN.JS - Lógica Interactiva del Sitio
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sitio cargado correctamente.");

    // 1. Iniciar el Menú Móvil (Si existe el botón)
    iniciarMenuMovil();

    // 2. Iniciar el Carrusel (Si existe en la página)
    iniciarCarrusel();
});


/* -----------------------------------------------------
   FUNCIÓN 1: MENÚ MÓVIL (Hamburguesa)
   ----------------------------------------------------- */
function iniciarMenuMovil() {
    const menuToggle = document.querySelector('.menu-toggle'); // Asegúrate de tener este botón en tu HTML si usas versión móvil
    const menuLista = document.querySelector('.menu-lista');

    if (menuToggle && menuLista) {
        menuToggle.addEventListener('click', () => {
            menuLista.classList.toggle('activo');

            // Cambiar icono de hamburguesa a X (Opcional, si usas FontAwesome)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (menuLista.classList.contains('activo')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/* -----------------------------------------------------
   FUNCIÓN 2: CARRUSEL DE IMÁGENES (Slider)
   ----------------------------------------------------- */
function iniciarCarrusel() {
    // Buscamos el elemento "track" que contiene las imágenes
    const track = document.getElementById('track');

    // IMPORTANTE: Si no estamos en la página de Misiones, 'track' será null.
    // Esta línea evita que el código falle en las otras páginas.
    if (!track) return;

    // Seleccionamos los elementos necesarios
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('btn-next');
    const prevButton = document.getElementById('btn-prev');
    const dotsContainer = document.getElementById('dots-container');
    const dots = Array.from(dotsContainer.children);

    let currentIndex = 0; // Empezamos en la primera imagen (índice 0)

    // --- Función Principal: Cambiar de Diapositiva ---
    const updateCarousel = (newIndex) => {
        // 1. Quitar la clase 'active' de la diapositiva y punto actual
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // 2. Actualizar el índice actual al nuevo
        currentIndex = newIndex;

        // 3. Añadir la clase 'active' a la nueva diapositiva y punto
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    };

    // --- Evento: Botón Siguiente ---
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Usamos el módulo (%) para volver al 0 cuando llegamos al final
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
            resetAutoPlay(); // Reiniciar el temporizador
        });
    }

    // --- Evento: Botón Anterior ---
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Lógica para ir al último si estamos en el primero
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
            resetAutoPlay();
        });
    }

    // --- Evento: Clic en los Puntos ---
    dots.forEach((dot, index) => {
        // Limpiamos onclicks antiguos si los hubiera en el HTML
        dot.removeAttribute('onclick');

        dot.addEventListener('click', () => {
            updateCarousel(index);
            resetAutoPlay();
        });
    });

    // --- Auto-Play (Automático) ---
    let autoPlayInterval;

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 3000); // Cambia cada 3000ms (3 segundos)
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval); // Detener
        startAutoPlay(); // Volver a empezar
    };

    // Iniciar el movimiento automático
    startAutoPlay();

    // Detener si el usuario pasa el mouse por encima (para leer tranquilo)
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        container.addEventListener('mouseleave', startAutoPlay);
    }
}