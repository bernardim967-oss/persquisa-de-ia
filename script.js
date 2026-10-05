/* =========================================================
   BETINHA ❤️
   Sistema de conversa, login e histórico
   ========================================================= */

const STORAGE_USER = "betinha_usuario";
const STORAGE_CHATS = "betinha_chats";
const STORAGE_CURRENT = "betinha_chat_atual";

/* =========================================================
   ELEMENTOS
   ========================================================= */

const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const userNameDisplay = document.getElementById("user-name");
const logoutButton = document.getElementById("logout");

const newChatButton = document.getElementById("new-chat");
const chatList = document.getElementById("chat-list");

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

/* =========================================================
   DADOS
   ========================================================= */

let usuario = localStorage.getItem(STORAGE_USER);

let chats = JSON.parse(
    localStorage.getItem(STORAGE_CHATS) || "[]"
);

let chatAtual = localStorage.getItem(STORAGE_CURRENT);

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (usuario) {
        entrarNoSite();
    } else {
        mostrarLogin();
    }

    configurarEventos();
});


/* =========================================================
   EVENTOS
   ========================================================= */

function configurarEventos() {

    if (loginForm) {
        loginForm.addEventListener("submit", fazerLogin);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", sair);
    }

    if (newChatButton) {
        newChatButton.addEventListener("click", criarNovoChat);
    }

    if (sendButton) {
        sendButton.addEventListener("click", enviarMensagem);
    }

    if (messageInput) {

        messageInput.addEventListener("keydown", function(event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                enviarMensagem();
            }
        });
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

function fazerLogin(event) {

    event.preventDefault();

    const nome = usernameInput
        ? usernameInput.value.trim()
        : "";

    const senha = passwordInput
        ? passwordInput.value
        : "";

    if (!nome || !senha) {

        alert("Digite seu nome e sua senha.");

        return;
    }

    /*
       Por enquanto o login é local.

       Depois podemos colocar um sistema de conta
       verdadeiro com banco de dados.
    */

    usuario = nome;

    localStorage.setItem(
        STORAGE_USER,
        usuario
    );

    entrarNoSite();
}


/* =========================================================
   ENTRAR NO SITE
   ========================================================= */

function entrarNoSite() {

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

    if (app) {
        app.style.display = "flex";
    }

    if (userNameDisplay) {
        userNameDisplay.textContent = usuario;
    }

    carregarChats();

    if (chats.length === 0) {

        criarNovoChat();

    } else {

        let encontrado = chats.find(
            chat => chat.id === chatAtual
        );

        if (!encontrado) {
            encontrado = chats[0];
            chatAtual = encontrado.id;
        }

        abrirChat(encontrado.id);
    }
}


/* =========================================================
   MOSTRAR LOGIN
   ========================================================= */

function mostrarLogin() {

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    if (app) {
        app.style.display = "none";
    }
}


/* =========================================================
   SAIR
   ========================================================= */

function sair() {

    /*
       Apaga apenas a sessão.

       Os chats continuam salvos no navegador.
    */

    localStorage.removeItem(STORAGE_USER);

    usuario = null;

    mostrarLogin();
}


/* =========================================================
   NOVO CHAT
   ========================================================= */

function criarNovoChat() {

    const novoChat = {

        id: Date.now().toString(),

        titulo: "Nova conversa",

        mensagens: [

            {
                autor: "ia",

                texto:
                    "Olá! 👋 Eu sou a Betinha. " +
                    "Pode conversar comigo sobre o que quiser. " +
                    "Estou aqui para ouvir você. ❤️",

                data: new Date().toISOString()
            }

        ],

        criadoEm: new Date().toISOString()
    };


    chats.unshift(novoChat);

    chatAtual = novoChat.id;

    salvarChats();

    mostrarListaChats();

    abrirChat(novoChat.id);
}


/* =========================================================
   ABRIR CHAT
   ========================================================= */

function abrirChat(id) {

    const chat = chats.find(
        item => item.id === id
    );

    if (!chat) {
        return;
    }

    chatAtual = id;

    localStorage.setItem(
        STORAGE_CURRENT,
        id
    );

    mostrarListaChats();

    mostrarMensagens(chat);
}


/* =========================================================
   MOSTRAR LISTA DE CHATS
   ========================================================= */

function mostrarListaChats() {

    if (!chatList) {
        return;
    }

    chatList.innerHTML = "";

    chats.forEach(chat => {

        const item = document.createElement("button");

        item.className = "chat-item";

        if (chat.id === chatAtual) {
            item.classList.add("ativo");
        }

        item.textContent =
            "💬 " + (chat.titulo || "Nova conversa");

        item.addEventListener(
            "click",
            () => abrirChat(chat.id)
        );

        chatList.appendChild(item);
    });
}


/* =========================================================
   MOSTRAR MENSAGENS
   ========================================================= */

function mostrarMensagens(chat) {

    if (!messagesContainer) {
        return;
    }

    messagesContainer.innerHTML = "";

    chat.mensagens.forEach(mensagem => {

        adicionarMensagemNaTela(
            mensagem.autor,
            mensagem.texto
        );
    });

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =========================================================
   ADICIONAR MENSAGEM NA TELA
   ========================================================= */

function adicionarMensagemNaTela(
    autor,
    texto
) {

    if (!messagesContainer) {
        return;
    }

    const mensagem = document.createElement("div");

    mensagem.className =
        autor === "usuario"
            ? "mensagem usuario"
            : "mensagem ia";


    const nome =
        autor === "usuario"
            ? "Você"
            : "Betinha";


    mensagem.innerHTML = `

        <div class="mensagem-nome">
            ${nome}
        </div>

        <div class="mensagem-texto"></div>

    `;

    const textoElemento =
        mensagem.querySelector(".mensagem-texto");

    /*
       textContent é usado para evitar que alguém
       consiga colocar HTML malicioso na conversa.
    */

    textoElemento.textContent = texto;

    messagesContainer.appendChild(mensagem);
}


/* =========================================================
   ENVIAR MENSAGEM
   ========================================================= */

async function enviarMensagem() {

    if (!messageInput) {
        return;
    }

    const texto =
        messageInput.value.trim();

    if (!texto) {
        return;
    }


    const chat = chats.find(
        item => item.id === chatAtual
    );

    if (!chat) {
        return;
    }


    /* Mensagem do usuário */

    chat.mensagens.push({

        autor: "usuario",

        texto: texto,

        data: new Date().toISOString()

    });


    /* Nome automático do chat */

    if (
        chat.titulo === "Nova conversa" &&
        chat.mensagens.length <= 3
    ) {

        chat.titulo =
            texto.length > 30
                ? texto.substring(0, 30) + "..."
                : texto;
    }


    messageInput.value = "";

    salvarChats();

    mostrarMensagens(chat);

    mostrarListaChats();


    /* Indicador de digitação */

    mostrarDigitando();


    /*
       Aqui futuramente entra a IA REAL.

       Por enquanto estamos usando uma resposta
       local para testar o sistema.
    */

    const resposta =
        gerarRespostaLocal(texto);


    setTimeout(() => {

        removerDigitando();

        chat.mensagens.push({

            autor: "ia",

            texto: resposta,

            data: new Date().toISOString()

        });

        salvarChats();

        mostrarMensagens(chat);

    }, 700);
}


/* =========================================================
   RESPOSTA TEMPORÁRIA
   ========================================================= */

function gerarRespostaLocal(texto) {

    const mensagem =
        texto.toLowerCase();


    if (
        mensagem.includes("oi") ||
        mensagem.includes("olá") ||
        mensagem.includes("ola")
    ) {

        return "Oi! ❤️ Que bom conversar com você. Pode me contar o que está acontecendo.";
    }


    if (
        mensagem.includes("triste") ||
        mensagem.includes("tristeza")
    ) {

        return "Sinto muito que você esteja se sentindo assim. 🫂 Se quiser, pode me contar um pouco mais. Eu vou te ouvir sem julgamentos.";
    }


    if (
        mensagem.includes("sozinho") ||
        mensagem.includes("sozinha")
    ) {

        return "Imagino como isso pode ser difícil. ❤️ Você pode ficar aqui e conversar comigo. Quer me contar o que fez você se sentir assim?";
    }


    if (
        mensagem.includes("obrigado") ||
        mensagem.includes("obrigada")
    ) {

        return "Você não precisa agradecer. ❤️ Estou aqui para conversar com você.";
    }


    return "Eu estou te ouvindo. ❤️ Pode continuar. Quero entender melhor o que você está sentindo e pensando.";
}


/* =========================================================
   INDICADOR DE DIGITAÇÃO
   ========================================================= */

function mostrarDigitando() {

    if (!messagesContainer) {
        return;
    }

    const elemento =
        document.createElement("div");

    elemento.id = "betinha-digitando";

    elemento.className =
        "mensagem ia digitando";

    elemento.innerHTML = `

        <div class="mensagem-nome">
            Betinha
        </div>

        <div class="mensagem-texto">
            Betinha está digitando...
        </div>

    `;

    messagesContainer.appendChild(elemento);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


function removerDigitando() {

    const elemento =
        document.getElementById(
            "betinha-digitando"
        );

    if (elemento) {
        elemento.remove();
    }
}


/* =========================================================
   SALVAR CHATS
   ========================================================= */

function salvarChats() {

    localStorage.setItem(
        STORAGE_CHATS,
        JSON.stringify(chats)
    );

    localStorage.setItem(
        STORAGE_CURRENT,
        chatAtual
    );
}


/* =========================================================
   CARREGAR CHATS
   ========================================================= */

function carregarChats() {

    chats = JSON.parse(
        localStorage.getItem(
            STORAGE_CHATS
        ) || "[]"
    );

    chatAtual =
        localStorage.getItem(
            STORAGE_CURRENT
        );
}


/* =========================================================
   SEGURANÇA BÁSICA
   ========================================================= */

window.addEventListener(
    "beforeunload",
    salvarChats
);
