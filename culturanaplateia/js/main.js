// Arquivo com funcionalidades comuns a todas as páginas
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade do menu em dispositivos móveis
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }

    // Botão tema escuro
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Verificar se há uma preferência salva
    const darkMode = localStorage.getItem('darkMode');
    
    // Se o usuário já ativou o tema escuro
    if (darkMode === 'enabled') {
        body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Alternar o tema
            body.classList.toggle('dark-theme');
            
            // Atualizar o ícone
            const icon = themeToggle.querySelector('i');
            
            if (body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // Botão voltar ao topo
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Remover loader após o carregamento completo da página
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('active');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }

    // Animação de entrada para seções
    const animateSections = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (isElementInViewport(section) && !section.classList.contains('fade-in')) {
                section.classList.add('fade-in');
            }
        });
    };
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Executar animação no carregamento inicial e durante o scroll
    window.addEventListener('scroll', animateSections);
    animateSections();
}); 