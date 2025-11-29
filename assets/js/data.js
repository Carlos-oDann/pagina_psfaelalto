// ==========================================
// 1. CONFIGURACIÓN GENERAL
// ==========================================
window.Parroquia = window.Parroquia || {};

window.Parroquia.config = {
    // El interruptor de la temporada
    esTemporadaMisiones: true,

    nombre: "Parroquia San Francisco de Asís",
    parroco: "P. Javier",

    // AGREGAMOS ESTO: La ruta de tu logo
    logo: "assets/img/logo_parroquia.png"
};

// ==========================================
// 2. ESTRUCTURA DEL MENÚ
// ==========================================
// Nota: Usamos rutas simples. El sistema se encargará de 
// agregar "../" si estás dentro de una subcarpeta.
window.Parroquia.menuData = [
    { titulo: "INICIO", link: "index.html" },
    {
        titulo: "PARROQUIA",
        submenu: [
            { label: "Información General", link: "pages/parroquia.html" },
            { label: "Nuestros Sacerdotes", link: "pages/parroquia.html#sacerdotes" }
        ]
    },
    {
        titulo: "SACRAMENTOS",
        submenu: [
            { label: "Bautismo", link: "pages/sacramentos.html" },
            { label: "Confirmación (Jóvenes)", link: "pages/sacramentos.html#confirmacion" },
            { label: "Matrimonio", link: "pages/sacramentos.html#matrimonio" }
        ]
    },
    {
        titulo: "GRUPOS",
        submenu: [
            { label: "Ver todos los grupos", link: "pages/grupos.html" },
            { label: "Comunicaciones", link: "pages/grupos.html#comunicaciones" }
        ]
    },
    {
        titulo: "MISIONES",
        destacado: true, // Esto hará que se pinte de rojo/dorado
        link: "pages/misiones.html"
    },
    { titulo: "CONTACTO", link: "pages/contacto.html" }
];

// ==========================================
// 3. CONTENIDO DE LA PORTADA (HOME)
// ==========================================
// Aquí defines qué sale en la página principal según la temporada
window.Parroquia.portadaData = {
    // A. Datos para Diciembre (Modo Misión)
    mision: {
        titulo: "Esta Navidad, llevamos Esperanza",
        texto: "+60 Jóvenes. 6 lugares de misión",
        btnTexto: "¡APOYAR AHORA!",
        btnLink: "pages/misiones.html",
        // Estadísticas que salen debajo de la portada
        stats: [
            { num: "60", txt: "Misioneros" },
            { num: "6", txt: "Comunidades" }
        ]
    },
    // B. Datos para el resto del año (Modo Normal)
    normal: {
        titulo: "Bienvenidos a Casa",
        texto: "Un espacio de fe, encuentro y comunidad en el corazón de nuestro barrio.",
        btnTexto: "VER HORARIOS",
        btnLink: "pages/parroquia.html",
        // Tarjetas informativas que salen debajo de la portada
        infoCards: [
            { titulo: "Misa Hoy", icono: "fa-bell", txt: "19:00 hrs" },
            { titulo: "Confesiones", icono: "fa-hands-praying", txt: "Jueves 17:00" },
            { titulo: "Despacho", icono: "fa-clock", txt: "Lun-Vie 09:00" }
        ]
    }
};