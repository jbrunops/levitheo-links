document.addEventListener("DOMContentLoaded", function () {
    // Seleção de elementos
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;
    const container = document.querySelector(".container");
    const heroImage = document.querySelector(".hero-image");
    const heroSection = document.querySelector(".hero-section");
    const linksContainer = document.querySelector(".links-container");

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

    // Carregar links dinamicamente
    loadLinks();

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

    // Função para carregar links do localStorage
    function loadLinks() {
        // Limpar contêiner de links
        linksContainer.innerHTML = "";
        
        // Obter links do localStorage ou usar padrão
        const links = getLinksFromStorage();
        
        // Adicionar links ao contêiner
        links.forEach(link => {
            const linkElement = createLinkElement(link);
            linksContainer.appendChild(linkElement);
        });
        
        // Adicionar eventos de clique aos links
        addLinkClickEvents();
        
        // Animação de entrada
        animateEntrance();
    }
    
    // Obter links do localStorage
    function getLinksFromStorage() {
        const linksJSON = localStorage.getItem("siteLinks");
        return linksJSON ? JSON.parse(linksJSON) : getDefaultLinks();
    }
    
    // Retornar links padrão baseados no HTML original
    function getDefaultLinks() {
        // Links padrão com base no index.html original
        return [
            {
                title: "Catálogo Levitheo",
                url: "https://vesti.co/levitheo/catalogo/e865e700dfca101",
                category: "catalog",
                icon: "fas fa-book"
            },
            {
                title: "Consultora Luziene",
                url: "https://whatsa.me/5581994253026",
                category: "consultant",
                icon: "fas fa-user-tie"
            },
            {
                title: "Consultora Aline",
                url: "https://whatsa.me/5581993243843",
                category: "consultant",
                icon: "fas fa-user-tie"
            },
            {
                title: "Grupo WhatsApp 1",
                url: "https://chat.whatsapp.com/K1z5pvdYRtWKxTb4Xgef6b",
                category: "whatsapp",
                icon: "fab fa-whatsapp"
            },
            {
                title: "Grupo WhatsApp 2",
                url: "https://chat.whatsapp.com/Fzh1L57StWO2SV19hLR8Nd",
                category: "whatsapp",
                icon: "fab fa-whatsapp"
            },
            {
                title: "Grupo WhatsApp 3",
                url: "https://chat.whatsapp.com/LTyIzio07MGAMbPjq5Zt1K",
                category: "whatsapp",
                icon: "fab fa-whatsapp"
            },
            {
                title: "Grupo WhatsApp 4",
                url: "https://chat.whatsapp.com/IrLOMEn6esFGDwEe9OJfVt",
                category: "whatsapp",
                icon: "fab fa-whatsapp"
            },
            {
                title: "Facebook",
                url: "https://www.facebook.com/uselevitheo",
                category: "facebook",
                icon: "fab fa-facebook-f"
            }
        ];
    }
    
    // Criar elemento de link HTML
    function createLinkElement(link) {
        // Criar elemento <a>
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.target = "_blank";
        linkElement.className = `link-button ${link.category}`;
        linkElement.setAttribute("data-category", link.category);
        
        // Adicionar ícone
        const iconWrapper = document.createElement("div");
        iconWrapper.className = "icon-wrapper";
        iconWrapper.innerHTML = `<i class="${link.icon}"></i>`;
        
        // Adicionar título
        const span = document.createElement("span");
        span.textContent = link.title;
        
        // Adicionar seta
        const linkArrow = document.createElement("div");
        linkArrow.className = "link-arrow";
        linkArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Montar elemento completo
        linkElement.appendChild(iconWrapper);
        linkElement.appendChild(span);
        linkElement.appendChild(linkArrow);
        
        return linkElement;
    }
    
    // Adicionar eventos de clique aos links
    function addLinkClickEvents() {
        const allLinks = document.querySelectorAll(".link-button");
        
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
});
