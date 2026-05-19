// descripciones personalizadas para cada proyecto
const DESCRIPTIONS = {
    EduVault: 'Sistema de gestión educativa que centraliza el control de estudiantes, cursos y calificaciones. Desarrollado con arquitectura limpia orientada a instituciones de cualquier tamaño.',
    MediLink: 'Plataforma de salud digital que conecta pacientes y profesionales médicos. Permite gestión de citas, historial clínico y comunicación segura en tiempo real.',
    AVTech: 'Plataforma empresarial con módulos de control de acceso, visitas, pedidos vía WhatsApp Bot y pagos integrados con OpenPay. PWA con mapas en tiempo real.'
};

// SVG de carpeta para el icono de tarjeta
const folderIcon = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>`;

// SVG de candado para repos privados
const lockIcon = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`;

// aqui pinto las tarjetas
function renderProjects(repos, container) {
    container.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'project-card';

        const desc = DESCRIPTIONS[repo.name] || repo.description || 'Proyecto en desarrollo activo.';
        const isPrivate = repo.private;
        const stars = repo.stargazers_count;

        card.innerHTML = `
            <div class="project-card-header">
                <span class="project-card-icon">${folderIcon}</span>
                ${isPrivate
                ? `<span class="project-card-private">${lockIcon} Privado</span>`
                : `<a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card-link">Ver repo →</a>`
            }
            </div>
            <h3>${repo.name}</h3>
            <p>${desc}</p>
            <div class="project-card-footer">
                <span class="project-lang">
                    <span class="project-lang-dot"></span>
                    ${repo.language || 'Varios'}
                </span>
                ${!isPrivate ? `<span class="project-stars">&#9733; ${stars.toLocaleString()}</span>` : ''}
            </div>
        `;

        container.appendChild(card);
    });
}

function showLoading(container) {
    container.innerHTML = `
        <div class="projects-loading">
            <div class="spinner"></div>
            <p>Cargando proyectos...</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `<div class="projects-error"><p>${message}</p></div>`;
}

export { renderProjects, showLoading, showError };
