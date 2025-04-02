document.addEventListener("DOMContentLoaded", function () {
    // Seleção de elementos
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;
    const allLinks = document.querySelectorAll(".link-button");

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
