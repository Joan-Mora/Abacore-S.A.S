// datos de AVTech hardcodeados porque el repo es privado
const AVTECH_DATA = {
    name: 'AVTech',
    html_url: 'https://github.com/Joan-Mora/AVTech',
    description: 'Plataforma de gestión empresarial para Avellano S.A.S. con módulos de control de acceso, visitas, pedidos vía WhatsApp Bot y pagos integrados con OpenPay. PWA con mapas en tiempo real.',
    language: 'JavaScript',
    stargazers_count: 0,
    private: true
};

// traemos los repos de github
async function fetchGithubRepos() {
    const repos = ['EduVault', 'MediLink'];
    const owner = 'Joan-Mora';

    const requests = repos.map(repo =>
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error en ${repo}`);
                return res.json();
            })
    );

    const results = await Promise.all(requests);
    return [...results, AVTECH_DATA];
}

export { fetchGithubRepos };
