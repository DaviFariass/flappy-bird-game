# 🐦 Voa Passarinho! (Chroma Flap)

Uma versão moderna, colorida e fluida do clássico Flappy Bird, construída inteiramente com **JavaScript puro (Vanilla)** e a API **HTML5 Canvas**. Sem engines externas ou imagens baixadas — tudo é renderizado via código!

### [Clique aqui para jogar agora direto no navegador!]([https://davifariass.github.io/flappy-bird-game/bird-game/])

---

## ✨ Funcionalidades (Features)

Este projeto vai além de um simples clone, implementando diversas mecânicas de Game Design e UI/UX:

* **Física Customizada:** O pássaro possui gravidade, aceleração e rotação dinâmica (inclina o bico para cima ao pular e para baixo ao cair).
* **Dificuldade Progressiva:** O espaço entre os canos e a velocidade de surgimento diminuem conforme você avança, tornando o jogo cada vez mais desafiador.
* **Cores Dinâmicas (Chroma):** Os canos mudam de cor a cada nova geração usando a paleta HSL, criando um belo efeito arco-íris progressivo.
* **Hall da Fama (Leaderboard):** Sistema de pontuação integrado com o `localStorage` do navegador. Suas 3 melhores pontuações (com medalhas de 🥇, 🥈 e 🥉) ficam salvas mesmo se você fechar a aba!
* **Efeito Parallax:** Nuvens animadas no fundo geram sensação de profundidade.
* **Responsividade:** O Canvas se ajusta dinamicamente ao tamanho da sua tela.

## 🚀 Tecnologias Utilizadas

O projeto utiliza a clássica tríade da web, com os arquivos bem separados para melhor manutenção:

* **HTML5:** Estrutura e elemento `<canvas>`.
* **CSS3:** Estilização da interface, fontes e fundo em degradê.
* **JavaScript:** Lógica de jogo (Game Loop), orientada a objetos (objetos literais), matemática (seno e cosseno para animações) e manipulação do DOM.

## 🎮 Como Jogar

O objetivo é simples: passe pelo meio do maior número de canos possível sem bater nas bordas ou cair no chão.

**Controles:**
* **Mouse/Touch:** Clique (ou toque) em qualquer lugar da tela para bater as asas.
* **Teclado:** Pressione a `Barra de Espaço` para voar.

## 🛠️ Como rodar o projeto na sua máquina

Como o projeto não utiliza dependências externas ou servidores complexos, rodá-lo é extremamente simples:

1. Faça o clone deste repositório ou baixe os arquivos (`index.html`, `style.css` e `script.js`).
2. Coloque os três arquivos na mesma pasta.
3. Dê um duplo clique no arquivo `index.html` para abri-lo no seu navegador favorito (Chrome, Firefox, Edge, etc).
4. Divirta-se!

---

*Criado com muita dedicação, código e café! ☕*
