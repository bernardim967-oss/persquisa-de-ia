/* =========================================================
   BETINHA ❤️
   SCRIPT.JS
========================================================= */

const USER_KEY = "betinha_usuario";
const CHATS_KEY = "betinha_chats";
const CURRENT_CHAT_KEY = "betinha_chat_atual";


/* =========================================================
   ELEMENTOS
========================================================= */

const introScreen =
    document.getElementById("intro-screen");

const loginScreen =
    document.getElementById("login-screen");

const app =
    document.getElementById("app");

const loginForm =
    document.getElementById("login-form");

const usernameInput =
    document.getElementById("username");

const sidebarUsername =
    document.getElementById("sidebar-username");

const userAvatar =
    document.getElementById("user-avatar");

const messages =
    document.getElementById("messages");

const messageForm =
    document.getElementById("message-form");

const messageInput =
    document.getElementById("message-input");

const typingIndicator =
    document.getElementById("typing-indicator");

const chatHistory =
    document.getElementById("chat-history");

const sidebar =
    document.getElementById("sidebar");

const newChatButton =
    document.getElementById("new-chat");

const headerNewChat =
    document.getElementById("header-new-chat");

const openSidebarButton =
    document.getElementById("open-sidebar");

const closeSidebarButton =
    document.getElementById("close-sidebar");

const logoutButton =
    document.getElementById("logout-button");


/* MODAL */

const newChatModal =
    document.getElementById("new-chat-modal");

const closeModalButton =
    document.getElementById("close-modal");

const cancelNewChatButton =
    document.getElementById("cancel-new-chat");

const confirmNewChatButton =
    document.getElementById("confirm-new-chat");


/* =========================================================
   DADOS
========================================================= */

let usuario =
    localStorage.getItem(USER_KEY);

let chats =
    carregarChats();

let chatAtual =
    localStorage.getItem(CURRENT_CHAT_KEY);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


function iniciar() {

    configurarEventos();

    setTimeout(() => {

        if (usuario) {

            mostrarAplicativo();

        } else {

            mostrarLogin();

        }

    }, 3900);
}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    loginForm.addEventListener(
        "submit",
        fazerLogin
    );

    messageForm.addEventListener(
        "submit",
        enviarMensagem
    );

    newChatButton.addEventListener(
        "click",
        abrirModalNovoChat
    );

    headerNewChat.addEventListener(
        "click",
        abrirModalNovoChat
    );

    closeModalButton.addEventListener(
        "click",
        fecharModalNovoChat
    );

    cancelNewChatButton.addEventListener(
        "click",
        fecharModalNovoChat
    );

    confirmNewChatButton.addEventListener(
        "click",
        confirmarNovoChat
    );

    openSidebarButton.addEventListener(
        "click",
        () => {
            sidebar.classList.add("open");
        }
    );

    closeSidebarButton.addEventListener(
        "click",
        () => {
            sidebar.classList.remove("open");
        }
    );

    logoutButton.addEventListener(
        "click",
        sair
    );

    messageInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                messageForm.requestSubmit();
            }

        }
    );

    messageInput.addEventListener(
        "input",
        ajustarTextarea
    );
}


/* =========================================================
   LOGIN
========================================================= */

function fazerLogin(event) {

    event.preventDefault();

    const nome =
        usernameInput.value.trim();

    if (!nome) {

        usernameInput.focus();

        return;
    }

    usuario = nome;

    localStorage.setItem(
        USER_KEY,
        usuario
    );

    mostrarAplicativo();
}


/* =========================================================
   MOSTRAR LOGIN
========================================================= */

function mostrarLogin() {

    loginScreen.classList.remove("hidden");

    app.classList.add("hidden");
}


/* =========================================================
   MOSTRAR APLICATIVO
========================================================= */

function mostrarAplicativo() {

    loginScreen.classList.add("hidden");

    app.classList.remove("hidden");

    sidebarUsername.textContent =
        usuario || "Usuário";

    if (usuario) {

        userAvatar.textContent =
            usuario
                .charAt(0)
                .toUpperCase();

    }

    if (chats.length === 0) {

        criarChat();

    } else {

        let chatEncontrado =
            chats.find(
                chat => chat.id === chatAtual
            );

        if (!chatEncontrado) {

            chatEncontrado =
                chats[0];

            chatAtual =
                chatEncontrado.id;

        }

        salvarEstado();

        abrirChat(
            chatEncontrado.id
        );
    }
}


/* =========================================================
   SAIR
========================================================= */

function sair() {

    const confirmar =
        confirm(
            "Deseja sair da Betinha?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(
        USER_KEY
    );

    usuario = null;

    loginScreen.classList.remove(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

    usernameInput.value = "";

    chats = carregarChats();
}


/* =========================================================
   CRIAR CHAT
========================================================= */

function criarChat() {

    const id =
        Date.now().toString();

    const novoChat = {

        id: id,

        titulo: "Nova conversa",

        mensagens: [

            {
                autor: "ia",

                texto:
                    `Olá, ${usuario || "amigo"}! ❤️

Eu sou a Betinha.

Pode conversar comigo sobre o que quiser. Estou aqui para ouvir você, sem julgamentos.

Pode começar quando quiser. 🫂`,

                data:
                    new Date().toISOString()

            }

        ],

        criadoEm:
            new Date().toISOString()

    };

    chats.unshift(
        novoChat
    );

    chatAtual = id;

    salvarEstado();

    renderizarHistorico();

    abrirChat(id);
}


/* =========================================================
   MODAL
========================================================= */

function abrirModalNovoChat() {

    newChatModal.classList.remove(
        "hidden"
    );
}


function fecharModalNovoChat() {

    newChatModal.classList.add(
        "hidden"
    );
}


function confirmarNovoChat() {

    fecharModalNovoChat();

    criarChat();
}


/* =========================================================
   ABRIR CHAT
========================================================= */

function abrirChat(id) {

    const chat =
        chats.find(
            item => item.id === id
        );

    if (!chat) {
        return;
    }

    chatAtual = id;

    salvarEstado();

    renderizarHistorico();

    renderizarMensagens(chat);

    sidebar.classList.remove(
        "open"
    );
}


/* =========================================================
   HISTÓRICO
========================================================= */

function renderizarHistorico() {

    chatHistory.innerHTML = "";

    chats.forEach(chat => {

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "history-item";

        if (chat.id === chatAtual) {

            item.classList.add(
                "active"
            );

        }

        const icon =
            document.createElement("span");

        icon.className =
            "history-icon";

        icon.textContent =
            "💬";

        const name =
            document.createElement("span");

        name.className =
            "history-name";

        name.textContent =
            chat.titulo ||
            "Nova conversa";

        item.appendChild(icon);

        item.appendChild(name);

        item.addEventListener(
            "click",
            () => abrirChat(chat.id)
        );

        chatHistory.appendChild(item);

    });
}


/* =========================================================
   RENDERIZAR MENSAGENS
========================================================= */

function renderizarMensagens(chat) {

    messages.innerHTML = "";

    if (
        chat.mensagens.length === 1 &&
        chat.mensagens[0].autor === "ia"
    ) {

        mostrarWelcome(chat);

        return;
    }

    chat.mensagens.forEach(
        mensagem => {

            adicionarMensagem(
                mensagem.autor,
                mensagem.texto
            );

        }
    );

    rolarParaBaixo();
}


/* =========================================================
   WELCOME
========================================================= */

function mostrarWelcome(chat) {

    const nome =
        usuario || "amigo";

    const welcome =
        document.createElement("div");

    welcome.className =
        "welcome";

    welcome.innerHTML = `

        <div class="welcome-avatar">
            ✦
        </div>

        <h1>
            Olá, <span></span> ❤️
        </h1>

        <p>
            Eu sou a Betinha.
        </p>

        <p>
            Estou aqui para conversar com você,
            ouvir o que quiser contar e fazer companhia.
        </p>

        <p class="small">
            Pode começar falando do jeito que quiser.
        </p>

    `;

    welcome.querySelector(
        "span"
    ).textContent = nome;

    messages.appendChild(
        welcome
    );
}


/* =========================================================
   ADICIONAR MENSAGEM
========================================================= */

function adicionarMensagem(
    autor,
    texto
) {

    const isUser =
        autor === "usuario";

    const message =
        document.createElement("div");

    message.className =
        "message " +
        (isUser ? "user" : "ia");

    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        isUser
            ? (
                usuario
                    ? usuario.charAt(0).toUpperCase()
                    : "U"
            )
            : "✦";

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    const name =
        document.createElement("div");

    name.className =
        "message-name";

    name.textContent =
        isUser
            ? "Você"
            : "Betinha";

    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";

    bubble.textContent =
        texto;

    content.appendChild(name);

    content.appendChild(bubble);

    message.appendChild(avatar);

    message.appendChild(content);

    messages.appendChild(message);
}


/* =========================================================
   ENVIAR MENSAGEM PARA A IA
========================================================= */

async function enviarMensagem(event) {

    event.preventDefault();

    const texto =
        messageInput.value.trim();

    if (!texto) {
        return;
    }

    const chat =
        chats.find(
            item => item.id === chatAtual
        );

    if (!chat) {
        return;
    }


    /* =========================================
       MENSAGEM DO USUÁRIO
    ========================================= */

    chat.mensagens.push({

        autor: "usuario",

        texto: texto,

        data:
            new Date().toISOString()

    });


    /* =========================================
       TÍTULO DO CHAT
    ========================================= */

    if (
        chat.titulo === "Nova conversa"
    ) {

        let titulo =
            texto
                .replace(/\s+/g, " ")
                .trim();

        if (titulo.length > 32) {

            titulo =
                titulo.substring(0, 32) +
                "...";

        }

        chat.titulo =
            titulo || "Nova conversa";
    }


    messageInput.value = "";

    ajustarTextarea();

    salvarEstado();

    renderizarMensagens(chat);

    renderizarHistorico();

    rolarParaBaixo();


    /* =========================================
       MOSTRAR "BETINHA ESTÁ DIGITANDO"
    ========================================= */

    mostrarDigitando();


    try {

        /*
           Transformamos o histórico da Betinha
           no formato que a API entende.
        */

        const mensagensParaIA =
            chat.mensagens
                .slice(-30)
                .map(mensagem => ({

                    role:
                        mensagem.autor === "usuario"
                            ? "user"
                            : "assistant",

                    content:
                        mensagem.texto

                }));


        /* =====================================
           CHAMADA PARA NOSSO BACKEND
        ===================================== */

        const resposta =
            await fetch(
                "/api/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            messages:
                                mensagensParaIA
                        })

                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.error ||
                "Erro ao conversar com a IA."
            );
        }


        const textoResposta =
            dados.response;


        if (!textoResposta) {

            throw new Error(
                "A IA não retornou uma resposta."
            );
        }


        /* =====================================
           ADICIONAR RESPOSTA DA BETINHA
        ===================================== */

        chat.mensagens.push({

            autor: "ia",

            texto: textoResposta,

            data:
                new Date().toISOString()

        });


        salvarEstado();

        removerDigitando();

        renderizarMensagens(chat);

        rolarParaBaixo();


    } catch (erro) {

        console.error(
            "Erro ao chamar a IA:",
            erro
        );


        removerDigitando();


        chat.mensagens.push({

            autor: "ia",

            texto:
                "Desculpa, tive um problema para me conectar à minha IA agora. 😕\n\n" +
                "Verifique se a API está configurada corretamente na Vercel e tente novamente.",

            data:
                new Date().toISOString()

        });


        salvarEstado();

        renderizarMensagens(chat);

        rolarParaBaixo();
    }
}


/* =========================================================
   DIGITANDO
========================================================= */

function mostrarDigitando() {

    typingIndicator.classList.remove(
        "hidden"
    );

    rolarParaBaixo();
}


function removerDigitando() {

    typingIndicator.classList.add(
        "hidden"
    );
}


/* =========================================================
   TEXTAREA
========================================================= */

function ajustarTextarea() {

    messageInput.style.height =
        "auto";

    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            150
        ) + "px";
}


/* =========================================================
   ROLAR
========================================================= */

function rolarParaBaixo() {

    setTimeout(
        () => {

            messages.scrollTop =
                messages.scrollHeight;

        },
        50
    );
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function salvarEstado() {

    localStorage.setItem(
        CHATS_KEY,
        JSON.stringify(chats)
    );

    if (chatAtual) {

        localStorage.setItem(
            CURRENT_CHAT_KEY,
            chatAtual
        );
    }
}


function carregarChats() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CHATS_KEY
            ) || "[]"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar chats:",
            erro
        );

        return [];
    }
}


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

newChatModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            newChatModal
        ) {

            fecharModalNovoChat();

        }

    }
);
