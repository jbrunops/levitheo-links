document.addEventListener("DOMContentLoaded", function () {
    // Seleção de elementos
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;
    const allLinks = document.querySelectorAll(".link-button");
    const container = document.querySelector(".container");
    const heroImage = document.querySelector(".hero-image");
    const heroSection = document.querySelector(".hero-section");

    // Definir classe para controlar animações
    document.body.classList.add("animations-ready");
    
    // Adicionar efeito de parallax aos bonecos 3D
    if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            heroImage.style.transform = `translateY(10px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(y - 0.5) * -5}deg)`;
        });
    }

    // Restaurar a animação quando o mouse sai da página
    document.addEventListener('mouseleave', function() {
        if (heroImage) {
            heroImage.style.transform = '';
        }
    });

    // Verificar se há preferência de tema no localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        enableDarkMode();
    }

    // Alternar entre modos claro e escuro
    themeSwitch.addEventListener("click", function () {
        if (body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Funções para ativar/desativar modo escuro
    function enableDarkMode() {
        body.classList.add("dark-mode");
        themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "dark");
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "light");
    }

    // Adicionar efeitos de clique aos links
    allLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            // Animação de clique
            this.classList.add("clicked");

            // Registrar cliques (poderia ser usado para analytics)
            const category = this.getAttribute("data-category");
            const text = this.querySelector("span").textContent;
            console.log(`Link clicked: ${category} - ${text}`);

            // Remover classe após animação
            setTimeout(() => {
                this.classList.remove("clicked");
            }, 300);
        });
    });

    // Adicionar interatividade ao hover dos bonecos
    if (heroImage) {
        heroImage.addEventListener("mouseover", function() {
            // Apenas pause a animação se não estiver usando o efeito de parallax
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.style.animationPlayState = "paused";
            }
            this.classList.add("pulse-effect");
        });

        heroImage.addEventListener("mouseout", function() {
            this.style.animationPlayState = "running";
            this.classList.remove("pulse-effect");
            // Restaurar transformação padrão
            this.style.transform = '';
        });
        
        // Easter egg: clique triplo faz os bonecos girar
        let clickCount = 0;
        let clickTimer;
        
        heroImage.addEventListener("click", function() {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 500);
            } else if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                this.classList.add("spin-effect");
                setTimeout(() => {
                    this.classList.remove("spin-effect");
                }, 1000);
            }
        });
    }

    // Animação de entrada
    function animateEntrance() {
        const links = document.querySelectorAll(".link-button, .social-button");
        links.forEach((link, index) => {
            link.style.opacity = "0";
            link.style.transform = "translateY(20px)";

            setTimeout(() => {
                link.style.transition = "all 0.5s ease";
                link.style.opacity = "1";
                link.style.transform = "translateY(0)";
            }, 100 * index);
        });
    }

    // Executar animação de entrada
    animateEntrance();
});
