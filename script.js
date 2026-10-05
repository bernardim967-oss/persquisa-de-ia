/* =========================================================
   BETINHA ❤️
   SCRIPT.JS

   Este arquivo funciona junto com:
   index.html
   style.css
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
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

    /*
       A intro fica alguns segundos.
       Depois mostramos login ou aplicativo.
    */

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

    /* LOGIN */

    loginForm.addEventListener(
        "submit",
        fazerLogin
    );


    /* CHAT */

    messageForm.addEventListener(
        "submit",
        enviarMensagem
    );


    /* NOVO CHAT */

    newChatButton.addEventListener(
        "click",
        abrirModalNovoChat
    );

    headerNewChat.addEventListener(
        "click",
        abrirModalNovoChat
    );


    /* MODAL */

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


    /* SIDEBAR */

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


    /* LOGOUT */

    logoutButton.addEventListener(
        "click",
        sair
    );


    /* ENTER */

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


    /* ALTURA DO TEXTAREA */

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


    /* Nome */

    sidebarUsername.textContent =
        usuario || "Usuário";


    /* Avatar */

    if (usuario) {

        userAvatar.textContent =
            usuario
                .charAt(0)
                .toUpperCase();

    }


    /*
       Se ainda não existir nenhuma conversa,
       criamos automaticamente.
    */

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
   ABRIR MODAL NOVO CHAT
========================================================= */

function abrirModalNovoChat() {

    newChatModal.classList.remove(
        "hidden"
    );
}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModalNovoChat() {

    newChatModal.classList.add(
        "hidden"
    );
}


/* =========================================================
   CONFIRMAR NOVO CHAT
========================================================= */

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


    /*
       Tela inicial quando o chat ainda
       possui somente a mensagem inicial.
    */

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

    /*
       textContent evita que uma mensagem
       execute HTML ou JavaScript.
    */

    bubble.textContent =
        texto;


    content.appendChild(name);

    content.appendChild(bubble);

    message.appendChild(avatar);

    message.appendChild(content);

    messages.appendChild(message);
}


/* =========================================================
   ENVIAR MENSAGEM
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


    /* Mensagem do usuário */

    chat.mensagens.push({

        autor: "usuario",

        texto: texto,

        data:
            new Date().toISOString()

    });


    /*
       Criar título automaticamente
       usando a primeira mensagem.
    */

    if (
        chat.titulo === "Nova conversa"
    ) {

        let titulo =
            texto.replace(/\s+/g, " ").trim();

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


    /* Mostrar digitando */

    mostrarDigitando();


    /*
       Resposta local temporária.

       Quando colocarmos uma IA REAL,
       esta parte será substituída por uma
       chamada segura ao servidor/API.
    */

    const resposta =
        gerarRespostaLocal(texto);


    setTimeout(
        () => {

            removerDigitando();


            chat.mensagens.push({

                autor: "ia",

                texto: resposta,

                data:
                    new Date().toISOString()

            });


            salvarEstado();

            renderizarMensagens(chat);

            rolarParaBaixo();

        },
        900
    );
}


/* =========================================================
   RESPOSTA DA BETINHA
========================================================= */

function gerarRespostaLocal(texto) {

    const mensagem =
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    /* Oi */

    if (
        mensagem.includes("oi") ||
        mensagem.includes("ola") ||
        mensagem.includes("olá") ||
        mensagem === "hey"
    ) {

        return (
            "Oi! ❤️\n\n" +
            "Que bom ter você aqui. " +
            "Pode me contar o que está acontecendo. " +
            "Eu estou te ouvindo. 🫂"
        );
    }


    /* Tristeza */

    if (
        mensagem.includes("triste") ||
        mensagem.includes("chorando") ||
        mensagem.includes("chorei")
    ) {

        return (
            "Poxa... sinto muito que você esteja passando por isso. 🫂❤️\n\n" +
            "Você não precisa organizar tudo o que está sentindo antes de falar comigo. " +
            "Pode simplesmente colocar para fora, do jeito que conseguir.\n\n" +
            "Quer me contar o que aconteceu?"
        );
    }


    /* Solidão */

    if (
        mensagem.includes("sozinho") ||
        mensagem.includes("sozinha") ||
        mensagem.includes("solidao") ||
        mensagem.includes("solidão")
    ) {

        return (
            "Eu imagino como essa sensação pode pesar. ❤️\n\n" +
            "Pode ficar aqui comigo e conversar um pouco. " +
            "Se quiser, me conta o que fez você se sentir assim hoje."
        );
    }


    /* Ansiedade */

    if (
        mensagem.includes("ansioso") ||
        mensagem.includes("ansiosa") ||
        mensagem.includes("ansiedade")
    ) {

        return (
            "Entendo... quando a ansiedade aparece, parece que a cabeça não consegue desligar. 🫂\n\n" +
            "Vamos devagar. Você não precisa resolver tudo agora.\n\n" +
            "Se quiser, me conta qual é o pensamento que mais está incomodando você."
        );
    }


    /* Raiva */

    if (
        mensagem.includes("raiva") ||
        mensagem.includes("bravo") ||
        mensagem.includes("brava") ||
        mensagem.includes("irritado") ||
        mensagem.includes("irritada")
    ) {

        return (
            "Parece que isso realmente mexeu com você. ❤️\n\n" +
            "Pode falar. Não precisa fingir que está tudo bem comigo.\n\n" +
            "O que aconteceu?"
        );
    }


    /* Cansaço */

    if (
        mensagem.includes("cansado") ||
        mensagem.includes("cansada") ||
        mensagem.includes("exausto") ||
        mensagem.includes("exausta")
    ) {

        return (
            "Você parece estar carregando bastante coisa. 🫂\n\n" +
            "Às vezes a gente só precisa de um lugar onde possa parar um pouco e respirar.\n\n" +
            "Quer me contar o que está te deixando tão cansado?"
        );
    }


    /* Obrigado */

    if (
        mensagem.includes("obrigado") ||
        mensagem.includes("obrigada")
    ) {

        return (
            "Não precisa agradecer. ❤️\n\n" +
            "Eu fico feliz em poder conversar com você."
        );
    }


    /* Amor */

    if (
        mensagem.includes("te amo") ||
        mensagem.includes("amo voce") ||
        mensagem.includes("amo você")
    ) {

        return (
            "Aaaah ❤️ fico feliz que você se sinta confortável conversando comigo.\n\n" +
            "Estou aqui para te ouvir e fazer companhia."
        );
    }


    /* Despedida */

    if (
        mensagem.includes("tchau") ||
        mensagem.includes("vou dormir") ||
        mensagem.includes("boa noite")
    ) {

        return (
            "Tudo bem. ❤️\n\n" +
            "Cuide de você e descanse. " +
            "Quando quiser conversar novamente, pode voltar."
        );
    }


    /* Resposta padrão */

    const respostas = [

        "Estou te ouvindo. ❤️ Pode continuar. Quero entender melhor o que você está sentindo.",

        "Pode falar comigo. 🫂 Não precisa escolher as palavras perfeitas.",

        "Entendi... me conta um pouco mais sobre isso.",

        "Estou aqui com você nessa conversa. ❤️ O que aconteceu depois?",

        "Pode colocar isso para fora. Eu vou acompanhar você e tentar entender."

    ];


    return respostas[
        Math.floor(
            Math.random() *
            respostas.length
        )
    ];
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
