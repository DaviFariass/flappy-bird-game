const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentState = 'START';
let frames = 0;
let score = 0;

let topScores = JSON.parse(localStorage.getItem('flappyTopScores')) || [];

function saveScore(newScore) {
    topScores.push(newScore);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 3);
    localStorage.setItem('flappyTopScores', JSON.stringify(topScores));
}

// Cenário: Nuvens ao fundo
const clouds = {
    list: [],
    dx: 0.5,
    
    update() {
        if (frames % 150 === 0) {
            this.list.push({
                x: canvas.width,
                y: Math.random() * (canvas.height / 2),
                size: Math.random() * 30 + 30
            });
        }
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].x -= this.dx;
            if (this.list[i].x + 100 < 0) {
                this.list.shift();
                i--;
            }
        }
    },
    
    draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        this.list.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 0.8, c.y - c.size * 0.3, c.size * 0.8, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 1.5, c.y, c.size * 0.9, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};

// O Passarinho Animado
const bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.14,
    velocity: 0,
    jump: -7.5,
    
    draw() { 
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (this.velocity * 0.12)));
        if (currentState === 'START') rotation = 0;
        ctx.rotate(rotation);

        // Corpo
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#b89a00";
        ctx.stroke();

        // Olho
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(6, -6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(8, -6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Bico
        ctx.fillStyle = "#FF4500";
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(22, 4);
        ctx.lineTo(10, 8);
        ctx.fill();

        // Asa Animada
        let wingY = 0;
        if (currentState === 'PLAYING') {
            wingY = this.velocity < 0 ? Math.sin(frames) * 6 : -4;
        } else {
            wingY = Math.sin(frames * 0.2) * 4;
        }
        
        ctx.fillStyle = "#FFA500";
        ctx.beginPath();
        ctx.ellipse(-4, 2 + wingY, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },
    
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            triggerGameOver();
        }
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    
    flap() {
        this.velocity = this.jump;
    }
};

// Os Canos Coloridos
const pipes = {
    position: [],
    width: 55,
    dx: 2.5,
    pipesGenerated: 0,
    framesSinceLastPipe: 400,
    
    draw() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            ctx.fillStyle = p.color;
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(0,0,0,0.3)";

            // Cano cima
            ctx.fillRect(p.x, 0, this.width, p.y);
            ctx.strokeRect(p.x, 0, this.width, p.y);
            ctx.fillRect(p.x - 3, p.y - 20, this.width + 6, 20);
            ctx.strokeRect(p.x - 3, p.y - 20, this.width + 6, 20);

            // Cano baixo
            let bottomY = p.y + p.gap;
            let bottomHeight = canvas.height - bottomY;
            ctx.fillRect(p.x, bottomY, this.width, bottomHeight);
            ctx.strokeRect(p.x, bottomY, this.width, bottomHeight);
            ctx.fillRect(p.x - 3, bottomY, this.width + 6, 20);
            ctx.strokeRect(p.x - 3, bottomY, this.width + 6, 20);
        }
    },
    
    update() {
        this.framesSinceLastPipe++;

        let currentSpawnRate = 400;
        if (this.pipesGenerated > 10) {
            currentSpawnRate = Math.max(180, 400 - ((this.pipesGenerated - 10) * 20));
        }

        if (this.framesSinceLastPipe >= currentSpawnRate) {
            let currentGap = Math.max(140, 250 - (this.pipesGenerated * 10));
            let currentHue = (this.pipesGenerated * 25) % 360; 
            
            this.position.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - currentGap - 100) + 50,
                gap: currentGap,
                color: `hsl(${currentHue}, 75%, 55%)`
            });
            
            this.pipesGenerated++;
            this.framesSinceLastPipe = 0;
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            if (p.x + this.width <= 0) {
                this.position.shift();
                score++;
                i--;
                continue;
            }

            if (
                bird.x + 5 < p.x + this.width &&
                bird.x + bird.width - 5 > p.x &&
                (bird.y + 5 < p.y || bird.y + bird.height - 5 > p.y + p.gap)
            ) {
                triggerGameOver();
            }
        }
    }
};

function triggerGameOver() {
    currentState = 'GAMEOVER';
    saveScore(score);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if(currentState === 'START') bird.x = canvas.width / 4;
});

// Empacotamos a lógica de pular em uma função única
function handleInput() {
    if (currentState === 'START') {
        currentState = 'PLAYING';
        bird.velocity = bird.jump;
        score = 0;
        frames = 0;
        pipes.position = [];
        pipes.pipesGenerated = 0;
        pipes.framesSinceLastPipe = 400;
        clouds.list = []; 
        
    } else if (currentState === 'PLAYING') {
        bird.flap();
        
    } else if (currentState === 'GAMEOVER') {
        currentState = 'START';
    }
}

// Controle pelo Mouse ou Toque na tela
canvas.addEventListener("click", handleInput);

// Controle pelo Teclado (Barra de Espaço)
window.addEventListener("keydown", (event) => {
    // Verifica se a tecla é 'Space' ou apenas um espaço em branco ' '
    if (event.code === "Space" || event.key === " ") {
        event.preventDefault(); // Impede o navegador de tentar rolar a página
        handleInput();
    }
});

function drawPanel(title, subtitle) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const panelWidth = 340;
    const panelHeight = 350;
    const x = (canvas.width - panelWidth) / 2;
    const y = (canvas.height - panelHeight) / 2;

    let gradient = ctx.createLinearGradient(x, y, x, y + panelHeight);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f4f7f6");

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, panelWidth, panelHeight, 20);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.textAlign = "center";
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 32px 'Segoe UI'";
    ctx.fillText(title, canvas.width / 2, y + 50);
    
    ctx.font = "italic 16px 'Segoe UI'";
    ctx.fillStyle = "#7f8c8d";
    ctx.fillText(subtitle, canvas.width / 2, y + 80);

    ctx.beginPath();
    ctx.moveTo(x + 40, y + 105);
    ctx.lineTo(x + panelWidth - 40, y + 105);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e67e22";
    ctx.font = "bold 20px 'Segoe UI'";
    ctx.fillText("Seu(a) Top 3", canvas.width / 2, y + 145);

    const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    const bgColors = ["rgba(255, 215, 0, 0.15)", "rgba(192, 192, 192, 0.15)", "rgba(205, 127, 50, 0.15)"];
    const textColors = ["#B8860B", "#708090", "#8B4513"];

    for (let i = 0; i < 3; i++) {
        let rankScore = topScores[i] !== undefined ? topScores[i] : "-";
        let rowY = y + 170 + (i * 48);
        
        ctx.fillStyle = bgColors[i];
        ctx.beginPath();
        ctx.roundRect(x + 30, rowY, panelWidth - 60, 40, 10);
        ctx.fill();

        ctx.fillStyle = medalColors[i];
        ctx.beginPath();
        ctx.arc(x + 55, rowY + 20, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = i === 1 ? "#333" : "white";
        ctx.font = "bold 15px 'Segoe UI'";
        ctx.fillText(i + 1, x + 55, rowY + 25);

        ctx.textAlign = "right";
        ctx.fillStyle = textColors[i];
        ctx.font = "bold 22px 'Segoe UI'";
        ctx.fillText(rankScore + " pts", x + panelWidth - 45, rowY + 27);
        
        ctx.textAlign = "center";
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.font = "bold 45px 'Segoe UI'";
    ctx.strokeText(score, 30, 60);
    ctx.fillText(score, 30, 60);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    clouds.update();
    clouds.draw();

    if (currentState === 'START') {
        bird.y = (canvas.height / 2) + Math.sin(frames / 12) * 20;
        bird.draw();
        drawPanel("Voa Passarinho!", "Dê um toque para voar!");
        frames++;
    } 
    else if (currentState === 'PLAYING') {
        bird.update();
        pipes.update();
        
        pipes.draw();
        bird.draw();
        drawScore();
        frames++;
    } 
    else if (currentState === 'GAMEOVER') {
        pipes.draw();
        bird.draw();
        drawPanel("Game Over!", "Toque para tentar de novo");
    }

    requestAnimationFrame(loop);
}

loop();