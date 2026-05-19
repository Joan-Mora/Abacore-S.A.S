// arrancamos la app
import { initNavbar } from './navbar.js';
import { fetchGithubRepos } from './api.js';
import { renderProjects, showLoading, showError } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    loadProjects();
    initContactForm();
});

async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    showLoading(grid);

    try {
        const repos = await fetchGithubRepos();
        renderProjects(repos, grid);
    } catch (error) {
        console.error('Error cargando repos:', error);
        showError(grid, 'No se pudieron cargar los proyectos. Intenta más tarde.');
    }
}

// manejo del formulario de contacto
function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        feedback.textContent = '';
        feedback.className = 'form-feedback';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok && result.ok) {
                feedback.textContent = 'Mensaje enviado. ¡Pronto te contactaremos!';
                feedback.classList.add('feedback-ok');
                form.reset();
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
        } catch (err) {
            feedback.textContent = 'Hubo un error al enviar. Intenta nuevamente.';
            feedback.classList.add('feedback-error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = `Enviar mensaje <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
        }
    });
}
