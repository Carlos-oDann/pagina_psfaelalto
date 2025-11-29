// =========================================================
// COMPONENTS.JS - Lógica de construcción de la interfaz
// =========================================================

// Accedemos a los datos globales definidos en data.js
const { config, menuData, portadaData } = window.Parroquia;

// ---------------------------------------------------------
// 1. FUNCIÓN DE PORTABILIDAD (Arregla rutas relativas)
// ---------------------------------------------------------
function arreglarRuta(rutaOriginal) {
    // Si la ruta no existe, es externa (http) o es un ancla (#), no la tocamos
    if (!rutaOriginal || rutaOriginal.startsWith('http') || rutaOriginal.startsWith('#')) {
        return rutaOriginal;
    }

    // Detectamos si estamos dentro de la carpeta 'pages' mirando la URL
    const estamosEnSubcarpeta = window.location.pathname.includes('/pages/');

    if (estamosEnSubcarpeta) {
        // CASO A: Estamos en una subcarpeta (ej: pages/misiones.html)

        // Si queremos ir al index, subimos un nivel
        if (rutaOriginal === 'index.html') return '../index.html';

        // Si es otra página en 'pages/', quitamos el prefijo para que sea enlace directo
        if (rutaOriginal.startsWith('pages/')) return rutaOriginal.replace('pages/', '');

        // Si es un recurso en 'assets/', subimos un nivel
        if (rutaOriginal.startsWith('assets/')) return '../' + rutaOriginal;

    } else {
        // CASO B: Estamos en la raíz (index.html)
        // Las rutas se quedan tal cual (ej: pages/misiones.html)
        return rutaOriginal;
    }

    return rutaOriginal;
}

// ---------------------------------------------------------
// 2. RENDERIZAR HEADER (MENÚ) - CON LOGO
// ---------------------------------------------------------
window.Parroquia.construirHeader = function () {
    const contenedor = document.getElementById('inyector-header');
    if (!contenedor) return;

    // A. Lógica del Logo
    let logoHTML = '';
    if (config.logo) {
        // Si hay una ruta de logo configurada, usamos la imagen
        logoHTML = `<img src="${arreglarRuta(config.logo)}" alt="Logo Parroquia" class="logo-img">`;
    } else {
        // Si no, usamos el icono por defecto
        logoHTML = `<i class="fa-solid fa-church"></i>`;
    }

    // B. Construcción del Menú
    const itemsHTML = menuData.map(item => {
        // Verificamos si tiene submenú
        if (item.submenu) {
            const claseDestacado = item.destacado ? 'item-destacado' : '';

            // Construimos los enlaces del dropdown
            const subHTML = item.submenu.map(sub =>
                `<a href="${arreglarRuta(sub.link)}">${sub.label}</a>`
            ).join('');

            return `
                <li class="menu-item ${claseDestacado}">
                    ${item.titulo} <i class="fa-solid fa-chevron-down" style="font-size:0.7em; margin-left:5px;"></i>
                    <div class="submenu">
                        ${subHTML}
                    </div>
                </li>`;
        }

        // Si es un enlace normal
        // Verificamos si es el botón destacado (Misiones)
        const claseBtn = item.destacado ? 'btn-mision-nav' : '';
        const icono = item.destacado ? '<i class="fa-solid fa-star"></i> ' : '';

        // Si es botón destacado, ponemos la clase en el <a>, si no, en el <li>
        const claseLi = item.destacado ? '' : 'menu-item';

        return `<li class="${claseLi}">
                    <a href="${arreglarRuta(item.link)}" class="${claseBtn}">
                        ${icono}${item.titulo}
                    </a>
                </li>`;
    }).join('');

    // C. Inyección del HTML
    contenedor.innerHTML = `
        <header>
            <nav class="container barra-nav">
                <!-- Logo + Nombre -->
                <a href="${arreglarRuta('index.html')}" class="logo">
                    ${logoHTML}
                    <span>${config.nombre}</span>
                </a>
                
                <!-- Lista de Navegación -->
                <ul class="menu-lista">
                    ${itemsHTML}
                </ul>
            </nav>
        </header>
    `;
};

// ---------------------------------------------------------
// 3. RENDERIZAR PORTADA (HOME)
// ---------------------------------------------------------
window.Parroquia.construirPortada = function () {
    const contenedor = document.getElementById('inyector-portada');
    const inyectorInfo = document.getElementById('inyector-info');

    if (!contenedor) return;

    const datos = config.esTemporadaMisiones ? portadaData.mision : portadaData.normal;
    const claseFondo = config.esTemporadaMisiones ? 'portada-mision' : 'portada-normal';
    const claseBtn = config.esTemporadaMisiones ? 'btn-dorado' : 'btn-cafe';

    // Renderizar Banner
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

    // Renderizar Info Flotante
    if (inyectorInfo) {
        inyectorInfo.className = 'grid-flotante'; // Asegura la clase correcta

        if (config.esTemporadaMisiones) {
            inyectorInfo.innerHTML = datos.stats.map(s => `
                <div class="card-info" style="border-top: 5px solid var(--mision-dorado)">
                    <span class="numero-grande">${s.num}</span>
                    <p style="font-weight:bold; color:#555; text-transform:uppercase; margin-top:5px;">${s.txt}</p>
                </div>
            `).join('');
        } else {
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
// 4. RENDERIZAR FOOTER (DATOS REALES)
// ==========================================
window.Parroquia.construirFooter = function () {
    const contenedor = document.getElementById('inyector-footer');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                
                    <!-- COLUMNA 1: IDENTIDAD -->
                    <div class="footer-col" style="text-align: center;">
                        <h3>Parroquia San Francisco de Asís</h3>
                        <p style="font-weight: bold; margin-bottom: 5px;">Diócesis de El Alto</p>
                        <p style="margin-bottom: 15px; font-style: italic; opacity: 0.9;">"¡El que tiene una misión, ha de cumplirla!"</p>
                    </div>

                    <!-- COLUMNA 2: CONTACTO Y HORARIOS -->
                    <div class="footer-col" style="text-align: center;">
                        <h3>Secretaría Parroquial</h3>
                        <ul class="footer-links" style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;">
                                <i class="fa-solid fa-location-dot" style="color: var(--mision-dorado); margin-right: 8px;"></i> 
                                <span>Plaza 25 de Julio, El Alto - Senkata</span>
                            </li>
                            <li style="margin-bottom: 10px;">
                                <i class="fa-solid fa-phone" style="color: var(--mision-dorado); margin-right: 8px;"></i> 
                                <span>+591 730011217</span>
                            </li>
                            <li style="margin-bottom: 5px; font-size: 0.9rem;">
                                <i class="fa-regular fa-clock" style="color: var(--mision-dorado); margin-right: 8px;"></i> 
                                <span>Lun-Mie-Jue-Vie: 09:00 - 12:00 / 15:00 - 18:00</span>
                            </li>
                            <li style="margin-bottom: 5px; font-size: 0.9rem;">
                                <i class="fa-regular fa-clock" style="color: var(--mision-dorado); margin-right: 8px;"></i> 
                                <span>Sábado: 09:00 - 12:00 / 15:00 - 18:00</span>
                            </li>
                            <li style="font-size: 0.9rem; color: #ffcccc;">
                                <i class="fa-solid fa-store-slash" style="margin-right: 8px;"></i> 
                                <span>Martes y Domingo: CERRADO</span>
                            </li>
                        </ul>
                    </div>

                    <!-- COLUMNA 3: REDES Y ACCIÓN -->
                    <div class="footer-col" style="text-align: center;">
                        <h3>Síguenos</h3>
                        <div class="social-icons" style="justify-content: center; margin-bottom: 15px;">
                            <a href="https://www.facebook.com/PSanFranciscoDeAsisElAlto70v7" target="_blank" class="social-btn" title="Facebook">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://www.tiktok.com/@p.sanfrancisco" target="_blank" class="social-btn" title="TikTok">
                                <i class="fa-brands fa-tiktok"></i>
                            </a>
                        </div>
                        <p style="font-size: 0.9rem;">Visita nuestras redes para estar enterado de todo lo que pasa en la parroquia.</p>
                    </div>

                </div>

                <!-- BARRA FINAL DE COPYRIGHT -->
                <div class="footer-bottom" style="text-align: center;">
                    <p>&copy; 2025 Parroquia San Francisco de Asís. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `;
};