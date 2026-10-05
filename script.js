// ==========================================
// PESQUISA DA VIDA
// ==========================================

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const nomeUsuario = document.getElementById("nomeUsuario");
const welcome = document.getElementById("welcome");

let etapa = "nome";
let nome = "";


// ==========================================
// QUANDO A PÁGINA CARREGAR
// ==========================================

window.addEventListener("load", () => {

    adicionarMensagem(
        "assistant",
        "Olá! 👋 Qual é o seu nome?"
    );

    input.focus();

});


// ==========================================
// ENVIAR RESPOSTA
// ==========================================

function enviarResposta() {

    const resposta = input.value.trim();

    if (resposta === "") {
        return;
    }

    // Mostra a resposta do usuário
    adicionarMensagem("user", resposta);

    // Limpa o campo
    input.value = "";

    // Processa a resposta
    processarResposta(resposta);

}


// ==========================================
// ENTER TAMBÉM ENVIA
// ==========================================

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        enviarResposta();

    }

});


// ==========================================
// PROCESSAR AS RESPOSTAS
// ==========================================

function processarResposta(resposta) {

    const texto = resposta.toLowerCase().trim();


    // -------------------------------
    // NOME
    // -------------------------------

    if (etapa === "nome") {

        nome = resposta;

        nomeUsuario.textContent = nome;

        adicionarMensagem(
            "assistant",
            `Prazer em conhecer você, ${nome}! 😄`
        );

        setTimeout(() => {

            adicionarMensagem(
                "assistant",
                `Tudo bem com você, ${nome}?`
            );

            mostrarBotoes([
                {
                    texto: "Sim 👍",
                    valor: "sim"
                },
                {
                    texto: "Não 😕",
                    valor: "não"
                }
            ]);

        }, 500);

        etapa = "tudoBem";

        return;
    }


    // -------------------------------
    // TUDO BEM?
    // -------------------------------

    if (etapa === "tudoBem") {

        removerBotoes();

        if (texto === "sim" || texto === "s") {

            adicionarMensagem(
                "assistant",
                "Que bom! 😄"
            );

            setTimeout(() => {

                adicionarMensagem(
                    "assistant",
                    "Vamos fazer uma pesquisa da sua vida?"
                );

                mostrarBotoes([
                    {
                        texto: "Sim, vamos! 🚀",
                        valor: "sim"
                    },
                    {
                        texto: "Não",
                        valor: "não"
                    }
                ]);

            }, 500);

            etapa = "pesquisa";

        } else {

            adicionarMensagem(
                "assistant",
                "Vix carambolas! 😰 Espero que as coisas melhorem."
            );

            setTimeout(() => {

                adicionarMensagem(
                    "assistant",
                    "Mesmo assim, se quiser, podemos conversar. ❤️"
                );

            }, 700);

            etapa = "fim";

        }

        return;
    }


    // -------------------------------
    // QUER FAZER A PESQUISA?
    // -------------------------------

    if (etapa === "pesquisa") {

        removerBotoes();

        if (texto === "sim" || texto === "s") {

            adicionarMensagem(
                "assistant",
                "Ok, então vamos começar! 🚀"
            );

            setTimeout(() => {

                adicionarMensagem(
                    "assistant",
                    "Você é menor de idade?"
                );

                mostrarBotoes([
                    {
                        texto: "Sim",
                        valor: "sim"
                    },
                    {
                        texto: "Não",
                        valor: "não"
                    }
                ]);

            }, 600);

            etapa = "menor";

        } else {

            adicionarMensagem(
                "assistant",
                "Tudo bem, fica para outra hora! 😄"
            );

            etapa = "fim";

        }

        return;
    }


    // -------------------------------
    // É MENOR?
    // -------------------------------

    if (etapa === "menor") {

        removerBotoes();

        if (texto === "sim" || texto === "s") {

            adicionarMensagem(
                "assistant",
                "Sério? 😮 Deixa eu tentar adivinhar..."
            );

            setTimeout(() => {

                adicionarMensagem(
                    "assistant",
                    "Você tem entre 14 e 15 anos. Acertei?"
                );

                mostrarBotoes([
                    {
                        texto: "Sim 😎",
                        valor: "sim"
                    },
                    {
                        texto: "Não 😂",
                        valor: "não"
                    }
                ]);

            }, 700);

            etapa = "idade";

        } else {

            adicionarMensagem(
                "assistant",
                "Ok, sr. adultão KKKK 😄"
            );

            setTimeout(() => {

                adicionarMensagem(
                    "assistant",
                    "Obrigado por participar da pesquisa! 👍"
                );

            }, 600);

            etapa = "fim";

        }

        return;
    }


    // -------------------------------
    // ACERTOU A IDADE?
    // -------------------------------

    if (etapa === "idade") {

        removerBotoes();

        if (texto === "sim" || texto === "s") {

            adicionarMensagem(
                "assistant",
                "KKKK eu sabia! Acertei! 😎"
            );

        } else {

            adicionarMensagem(
                "assistant",
                "Vixx kkk, errei feio! 😂"
            );

        }

        setTimeout(() => {

            adicionarMensagem(
                "assistant",
                "Obrigado por responder! Essa foi só uma brincadeira, beleza? 😄"
            );

        }, 700);

        etapa = "fim";

        return;
    }


    // -------------------------------
    // FINALIZADO
    // -------------------------------

    if (etapa === "fim") {

        adicionarMensagem(
            "assistant",
            "A pesquisa já terminou. 😄 Clique em «Nova conversa» para começar novamente."
        );

    }

}


// ==========================================
// ADICIONAR MENSAGEM
// ==========================================

function adicionarMensagem(tipo, texto) {

    const message = document.createElement("div");

    message.className = `message ${tipo}`;


    const content = document.createElement("div");

    content.className = "message-content";

    content.textContent = texto;


    message.appendChild(content);

    messages.appendChild(message);


    // Rola para a última mensagem

    messages.scrollTop = messages.scrollHeight;

}


// ==========================================
// BOTÕES DE RESPOSTA
// ==========================================

function mostrarBotoes(opcoes) {

    removerBotoes();


    const container = document.createElement("div");

    container.className = "answer-buttons";


    opcoes.forEach(opcao => {

        const button = document.createElement("button");

        button.textContent = opcao.texto;

        button.className = "answer-button";


        button.addEventListener("click", () => {

            input.value = opcao.valor;

            enviarResposta();

        });


        container.appendChild(button);

    });


    messages.appendChild(container);

    messages.scrollTop = messages.scrollHeight;

}


// ==========================================
// REMOVER BOTÕES
// ==========================================

function removerBotoes() {

    const botoes = document.querySelector(".answer-buttons");

    if (botoes) {

        botoes.remove();

    }

}


// ==========================================
// NOVA CONVERSA
// ==========================================

function reiniciarConversa() {

    location.reload();

}
