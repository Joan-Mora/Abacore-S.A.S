// manejo del navbar: scroll y menu movil
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbar-toggle');
    const links = document.getElementById('navbar-links');
    const allLinks = links.querySelectorAll('a');

    // efecto al hacer scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // hamburguesa
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    // cerrar menu al hacer click en un link
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

export { initNavbar };
