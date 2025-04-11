document.addEventListener("DOMContentLoaded", function () {
    // Seleção de elementos DOM
    const themeSwitch = document.getElementById("theme-switch");
    const body = document.body;
    const loginForm = document.getElementById("login-form");
    const adminPanel = document.getElementById("admin-panel");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const loginError = document.getElementById("login-error");
    const logoutButton = document.getElementById("logout-button");
    const linksList = document.getElementById("links-list");
    const addLinkButton = document.getElementById("add-link-button");
    const linkTitleInput = document.getElementById("link-title");
    const linkUrlInput = document.getElementById("link-url");
    const linkCategoryInput = document.getElementById("link-category");
    const linkIconInput = document.getElementById("link-icon");
    const iconPreview = document.querySelector(".icon-preview i");
    
    // Elementos do formulário de troca de senha
    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const changePasswordButton = document.getElementById("change-password-button");
    const passwordMessage = document.getElementById("password-message");

    // Credenciais de acesso
    const validCredentials = [
        { username: "luziene", password: "123" },
        { username: "aline", password: "123" }
    ];

    // Carregar credenciais salvas
    loadSavedCredentials();

    // Verificar estado de autenticação
    checkAuthState();

    // Verificar e aplicar tema
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        enableDarkMode();
    }

    // Alternância de tema
    themeSwitch.addEventListener("click", function () {
        if (body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Autenticação
    loginButton.addEventListener("click", function () {
        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (isValid) {
            // Salvar estado de autenticação
            localStorage.setItem("adminAuthenticated", "true");
            localStorage.setItem("adminUser", username);
            
            // Mostrar painel administrativo
            showAdminPanel();
        } else {
            loginError.textContent = "Usuário ou senha incorretos";
        }
    });

    // Adicionar evento para tecla Enter no login
    passwordInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            loginButton.click();
        }
    });

    // Logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminUser");
        showLoginForm();
    });

    // Gerenciamento de links
    addLinkButton.addEventListener("click", addNewLink);

    // Troca de senha
    changePasswordButton.addEventListener("click", changePassword);

    // Carregar links existentes
    loadLinks();

    // Atualizar preview do ícone quando o usuário selecionar uma opção
    linkIconInput.addEventListener("change", updateIconPreview);

    // Inicializar preview do ícone
    updateIconPreview();

    function updateIconPreview() {
        const selectedIcon = linkIconInput.value;
        // Atualizar a classe do ícone
        iconPreview.className = selectedIcon;
    }

    // Funções do tema
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

    // Funções de autenticação
    function checkAuthState() {
        const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
        if (isAuthenticated) {
            showAdminPanel();
        } else {
            showLoginForm();
        }
    }

    function showLoginForm() {
        loginForm.style.display = "block";
        adminPanel.style.display = "none";
        // Limpar formulário
        usernameInput.value = "";
        passwordInput.value = "";
        loginError.textContent = "";
    }

    function showAdminPanel() {
        loginForm.style.display = "none";
        adminPanel.style.display = "block";
        // Carregar links ao mostrar o painel
        loadLinks();
    }

    function loadSavedCredentials() {
        const savedCredentials = localStorage.getItem("adminCredentials");
        if (savedCredentials) {
            // Atualizar credenciais com as salvas no localStorage
            const parsedCredentials = JSON.parse(savedCredentials);
            // Usar Object.assign para modificar o array original
            parsedCredentials.forEach((cred, index) => {
                if (index < validCredentials.length) {
                    Object.assign(validCredentials[index], cred);
                }
            });
        }
    }

    function saveCredentials() {
        localStorage.setItem("adminCredentials", JSON.stringify(validCredentials));
    }

    function changePassword() {
        // Limpar mensagem anterior
        passwordMessage.textContent = "";
        passwordMessage.className = "message";
        
        // Obter o usuário atual
        const currentUser = localStorage.getItem("adminUser");
        if (!currentUser) {
            showPasswordMessage("Erro ao identificar usuário atual.", "error");
            return;
        }
        
        // Obter valores dos campos
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validar senha atual
        const userIndex = validCredentials.findIndex(cred => 
            cred.username === currentUser && cred.password === currentPassword
        );
        
        if (userIndex === -1) {
            showPasswordMessage("Senha atual incorreta.", "error");
            return;
        }
        
        // Verificar se a nova senha é válida
        if (!newPassword) {
            showPasswordMessage("A nova senha não pode estar vazia.", "error");
            return;
        }
        
        // Verificar se as senhas coincidem
        if (newPassword !== confirmPassword) {
            showPasswordMessage("As novas senhas não coincidem.", "error");
            return;
        }
        
        // Atualizar senha
        validCredentials[userIndex].password = newPassword;
        
        // Salvar credenciais
        saveCredentials();
        
        // Mostrar mensagem de sucesso
        showPasswordMessage("Senha alterada com sucesso!", "success");
        
        // Limpar campos
        currentPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
    }
    
    function showPasswordMessage(message, type) {
        passwordMessage.textContent = message;
        passwordMessage.className = `message ${type}`;
    }

    // Funções de gerenciamento de links
    function loadLinks() {
        // Recuperar links do localStorage
        const links = getLinksFromStorage();
        
        // Limpar a lista
        linksList.innerHTML = "";
        
        // Construir lista de links
        links.forEach((link, index) => {
            const linkElement = createLinkElement(link, index);
            linksList.appendChild(linkElement);
        });
    }

    function getLinksFromStorage() {
        const linksJSON = localStorage.getItem("siteLinks");
        return linksJSON ? JSON.parse(linksJSON) : getDefaultLinks();
    }

    function saveLinksToStorage(links) {
        localStorage.setItem("siteLinks", JSON.stringify(links));
    }

    function getDefaultLinks() {
        // Links padrão com base no index.html
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

    function createLinkElement(link, index) {
        const linkItem = document.createElement("div");
        linkItem.className = "link-item";
        
        // Container principal para ícone e detalhes
        const mainContainer = document.createElement("div");
        mainContainer.className = "link-main-container";
        mainContainer.style.display = "flex";
        mainContainer.style.alignItems = "center";
        mainContainer.style.width = "100%";
        
        // Ícone do link
        const iconDiv = document.createElement("div");
        iconDiv.className = "icon-wrapper";
        iconDiv.innerHTML = `<i class="${link.icon}"></i>`;
        
        // Detalhes do link
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "link-details";
        
        const titleP = document.createElement("p");
        titleP.className = "link-title";
        titleP.textContent = link.title;
        
        const urlP = document.createElement("p");
        urlP.className = "link-url";
        urlP.textContent = link.url;
        
        detailsDiv.appendChild(titleP);
        detailsDiv.appendChild(urlP);
        
        // Adicionar ícone e detalhes ao container principal
        mainContainer.appendChild(iconDiv);
        mainContainer.appendChild(detailsDiv);
        
        // Ações do link
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "link-actions";
        
        // Botões de reordenação
        const moveUpBtn = document.createElement("button");
        moveUpBtn.className = "link-btn move-up-btn";
        moveUpBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        moveUpBtn.title = "Mover para cima";
        moveUpBtn.addEventListener("click", () => moveLink(index, "up"));
        // Desabilitar o botão se for o primeiro item
        if (index === 0) {
            moveUpBtn.disabled = true;
            moveUpBtn.classList.add("disabled");
        }
        
        const moveDownBtn = document.createElement("button");
        moveDownBtn.className = "link-btn move-down-btn";
        moveDownBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
        moveDownBtn.title = "Mover para baixo";
        moveDownBtn.addEventListener("click", () => moveLink(index, "down"));
        
        // Obter a lista de links para verificar se este é o último item
        const links = getLinksFromStorage();
        // Desabilitar o botão se for o último item
        if (index === links.length - 1) {
            moveDownBtn.disabled = true;
            moveDownBtn.classList.add("disabled");
        }
        
        // Botões de edição e exclusão
        const editBtn = document.createElement("button");
        editBtn.className = "link-btn edit-btn";
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = "Editar";
        editBtn.addEventListener("click", () => editLink(index));
        
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "link-btn delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = "Excluir";
        deleteBtn.addEventListener("click", () => deleteLink(index));
        
        // Adicionar botões ao div de ações
        actionsDiv.appendChild(moveUpBtn);
        actionsDiv.appendChild(moveDownBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        // Montar o item completo
        linkItem.appendChild(mainContainer);
        linkItem.appendChild(actionsDiv);
        
        return linkItem;
    }

    // Função para mover links para cima ou para baixo
    function moveLink(index, direction) {
        const links = getLinksFromStorage();
        
        // Verificar se o movimento é válido
        if (direction === "up" && index > 0) {
            // Trocar com o item acima
            [links[index], links[index - 1]] = [links[index - 1], links[index]];
        } else if (direction === "down" && index < links.length - 1) {
            // Trocar com o item abaixo
            [links[index], links[index + 1]] = [links[index + 1], links[index]];
        } else {
            // Movimento inválido, não fazer nada
            return;
        }
        
        // Salvar a nova ordem e recarregar
        saveLinksToStorage(links);
        loadLinks();
    }

    function addNewLink() {
        const title = linkTitleInput.value.trim();
        const url = linkUrlInput.value.trim();
        const category = linkCategoryInput.value;
        const icon = linkIconInput.value;
        
        // Validação básica
        if (!title || !url) {
            alert("Por favor, preencha o título e a URL do link.");
            return;
        }
        
        // Adicionar http:// se não estiver presente
        let finalUrl = url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            finalUrl = "https://" + url;
        }
        
        // Obter links existentes
        const links = getLinksFromStorage();
        
        // Adicionar novo link
        links.push({
            title: title,
            url: finalUrl,
            category: category,
            icon: icon
        });
        
        // Salvar e recarregar
        saveLinksToStorage(links);
        loadLinks();
        
        // Limpar formulário
        linkTitleInput.value = "";
        linkUrlInput.value = "";
        linkIconInput.selectedIndex = 0;
        updateIconPreview();
    }

    function editLink(index) {
        const links = getLinksFromStorage();
        const link = links[index];
        
        // Preencher formulário com dados do link
        linkTitleInput.value = link.title;
        linkUrlInput.value = link.url;
        linkCategoryInput.value = link.category;
        
        // Selecionar o ícone correto no dropdown
        const iconOptions = linkIconInput.options;
        for (let i = 0; i < iconOptions.length; i++) {
            if (iconOptions[i].value === link.icon) {
                linkIconInput.selectedIndex = i;
                break;
            }
        }
        
        // Atualizar o preview do ícone
        updateIconPreview();
        
        // Remover o link atual
        links.splice(index, 1);
        saveLinksToStorage(links);
        loadLinks();
        
        // Focar no título para edição
        linkTitleInput.focus();
    }

    function deleteLink(index) {
        if (confirm("Tem certeza que deseja excluir este link?")) {
            const links = getLinksFromStorage();
            links.splice(index, 1);
            saveLinksToStorage(links);
            loadLinks();
        }
    }
}); 