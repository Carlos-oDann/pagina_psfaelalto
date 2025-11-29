// Accedemos a los datos globales
const { config, menuData, portadaData } = window.Parroquia;

// ==========================================
// 1. FUNCIÓN DE PORTABILIDAD (Magia de Rutas)
// ==========================================
function arreglarRuta(rutaOriginal) {
    // Si la ruta no existe, es externa (http) o es un ancla (#), no la tocamos
    if (!rutaOriginal || rutaOriginal.startsWith('http') || rutaOriginal.startsWith('#')) {
        return rutaOriginal;
    }

    // Detectamos si estamos dentro de la carpeta 'pages'
    const estamosEnSubcarpeta = window.location.pathname.includes('/pages/');

    if (estamosEnSubcarpeta) {
        // CASO A: Estamos en una subcarpeta (ej: pages/misiones.html)

        // Si queremos ir al index, tenemos que subir un nivel (../)
        if (rutaOriginal === 'index.html') return '../index.html';

        // Si queremos ir a otra página dentro de pages (ej: pages/contacto.html)
        // Eliminamos el prefijo 'pages/' para que quede solo 'contacto.html' (hermano)
        if (rutaOriginal.startsWith('pages/')) return rutaOriginal.replace('pages/', '');

        // Para cualquier otro asset (como imágenes en assets/), subimos un nivel
        if (rutaOriginal.startsWith('assets/')) return '../' + rutaOriginal;

    } else {
        // CASO B: Estamos en la raíz (index.html)
        // Las rutas se quedan tal cual están definidas en data.js (ej: pages/misiones.html)
        return rutaOriginal;
    }

    return rutaOriginal;
}

// ==========================================
// 2. RENDERIZAR HEADER (MENÚ)
// ==========================================
window.Parroquia.construirHeader = function () {
    const contenedor = document.getElementById('inyector-header');
    if (!contenedor) return; // Si no existe el div en el HTML, no hacemos nada

    // Creamos el HTML de la lista del menú
    const itemsHTML = menuData.map(item => {
        // Verificamos si tiene submenú
        if (item.submenu) {
            // Estilo especial si es destacado (Misiones)
            const claseDestacado = item.destacado ? 'item-destacado' : '';

            // Construimos los enlaces del submenú
            const subHTML = item.submenu.map(sub =>
                `<a href="${arreglarRuta(sub.link)}">${sub.label}</a>`
            ).join('');

            // Retornamos el item con dropdown
            return `
                <li class="menu-item ${claseDestacado}">
                    ${item.titulo} <i class="fa-solid fa-chevron-down" style="font-size:0.7em; margin-left:5px;"></i>
                    <div class="submenu">
                        ${subHTML}
                    </div>
                </li>`;
        }

        // Si es un enlace normal
        const claseBtn = item.destacado ? 'btn-mision-nav' : '';
        const icono = item.destacado ? '<i class="fa-solid fa-star"></i> ' : '';

        return `<li class="menu-item">
                    <a href="${arreglarRuta(item.link)}" class="${claseBtn}">
                        ${icono}${item.titulo}
                    </a>
                </li>`;
    }).join('');

    // Inyectamos todo el Header
    contenedor.innerHTML = `
        <header>
            <nav class="container barra-nav">
                <a href="${arreglarRuta('index.html')}" class="logo">
                    <i class="fa-solid fa-church"></i> ${config.nombre}
                </a>
                <ul class="menu-lista">
                    ${itemsHTML}
                </ul>
            </nav>
        </header>
    `;
};

// ==========================================
// 3. RENDERIZAR PORTADA (HOME)
// ==========================================
window.Parroquia.construirPortada = function () {
    const contenedor = document.getElementById('inyector-portada');
    const inyectorInfo = document.getElementById('inyector-info'); // Este div debe estar en el HTML debajo del header

    if (!contenedor) return;

    // A. Elegir datos según temporada
    const datos = config.esTemporadaMisiones ? portadaData.mision : portadaData.normal;

    // B. Clases CSS (Nota: Agregamos 'portada' que tiene los estilos de centrado)
    const claseFondo = config.esTemporadaMisiones ? 'portada-mision' : 'portada-normal';
    const claseBtn = config.esTemporadaMisiones ? 'btn-dorado' : 'btn-cafe'; // Asegúrate de tener btn-cafe en CSS o usa solo btn

    // 1. Renderizar el Banner Principal (Centrado y con aire)
    contenedor.className = `portada ${claseFondo}`;
    contenedor.innerHTML = `
        <div class="container">
            <h1>${datos.titulo}</h1>
            <p>${datos.texto}</p>
            <a href="${arreglarRuta(datos.btnLink)}" class="btn ${claseBtn}">
                ${datos.btnTexto} <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    `;

    // 2. Renderizar la Info Flotante (Las tarjetas que se superponen)
    if (inyectorInfo) {
        // Forzamos la clase grid-flotante para asegurar la superposición correcta
        inyectorInfo.className = 'container grid-flotante';

        if (config.esTemporadaMisiones) {
            // --- MODO MISIÓN: Estadísticas Grandes ---
            inyectorInfo.innerHTML = datos.stats.map(s => `
                <div class="card-info" style="border-top: 5px solid var(--mision-dorado)">
                    <span class="numero-grande">${s.num}</span>
                    <p style="font-weight:bold; color:#555; text-transform:uppercase; margin-top:5px;">${s.txt}</p>
                </div>
            `).join('');

        } else {
            // --- MODO NORMAL: Tarjetas de Información ---
            inyectorInfo.innerHTML = datos.infoCards.map(c => `
                <div class="card-info">
                    <i class="fa-solid ${c.icono}" style="font-size: 2.5rem; color: var(--cafe-primario); margin-bottom: 15px;"></i>
                    <h3 style="margin-bottom:10px;">${c.titulo}</h3>
                    <p>${c.txt}</p>
                </div>
            `).join('');
        }
    }
};

// ==========================================
// 4. RENDERIZAR FOOTER
// ==========================================
window.Parroquia.construirFooter = function () {
    const contenedor = document.getElementById('inyector-footer');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <footer class="pie-pagina">
            <div class="footer-grid">
            
            <!-- COLUMNA 1: IDENTIDAD -->
            <div class="footer-col" style="text-align: center;">
                <h3>Parroquia San Francisco de Asís - Diócesis de El Alto</h3>
                <p style="margin-bottom: 15px; font-style: italic;">"¡El que tiene una misión, ha de cumplirla!"</p>
            </div>

            <!-- COLUMNA 2: CONTACTO Y HORARIOS -->
            <div class="footer-col" style="text-align: center;">
                <h3>Secretaría Parroquial</h3>
                <ul class="footer-contact">
                    <li>
                        <i class="fa-solid fa-location-dot"></i> 
                        <span>Plaza 25 de Julio, El Alto - Senkata</span>
                    </li>
                    <li>
                        <i class="fa-solid fa-phone"></i> 
                        <span>+591 730011217</span>
                    </li>
                    <li>
                        <i class="fa-regular fa-clock"></i> 
                        <span>Lun-Mie-Jue-Vie: 09:00 - 12:00 / 15:00 - 18:00</span>
                        
                    </li>
                    <li>
                        <i class="fa-regular fa-clock"></i> 
                        <span>Sábado: 09:00 - 12:00 / 15:00 - 18:00</span>
                    </li>
                    <li style="margin-bottom: 15px;">
                        <i class="fa-regular fa-clock"></i> 
                        <span>Martes y domingo: Cerrado</span>
                    </li>
                </ul>
            </div>

            <!-- COLUMNA 3: REDES Y ACCIÓN -->
            <div class="footer-col" style="text-align: center;">
                <h3>Síguenos</h3>
                <div class="social-icons">
                    <a href="https://www.facebook.com/PSanFranciscoDeAsisElAlto70v7" title="Facebook"><i class="fa-brands fa-facebook"> Parroquia San Francisco De Asis El Alto</i></a>
                </div>
                <div class="social-icons" style="margin-bottom: 15px;">
                    <a href="https://www.tiktok.com/@p.sanfrancisco" title="Tiktok"><i class="fa-brands fa-tiktok"> p.sanfrancisco</i></a>
                </div>
            </div>

        </div>

        <!-- BARRA FINAL DE COPYRIGHT -->
        <div class="footer-bottom" style="text-align: center;">
            <p>&copy; 2025 Parroquia San Francisco de Asis. Todos los derechos reservados.</p>
        </div>
    </div>
    </footer>
    `;
};