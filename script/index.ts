let gravity = 2000; // pixels/s²
let velocity = 0;
let positionY = 300;
let positionXGround = 0;
let positionXPipes = 300;
let speed = -900; // pixels/s
let jumpForce = 600;

let difficulty : string = "easy";
let easyMultiplier : number = 1;
let mediumMultiplier : number = 1.5;
let hardMultiplier : number = 2;
let originalSpawnTime : number = 1500;
let lastScore : number = 0;

let multiplier : number = 1;

const skylevel = 0;
const groundLevel = 555;
let score = 0;
let running = true;

const player = document.getElementById("player")!;
const ground1 = document.getElementById("ground1")!;
const ground2 = document.getElementById("ground2")!;
const ground3 = document.getElementById("ground3")!;
const pipes = document.getElementsByClassName("pipe");
const scoretext = document.getElementById("score")!;
const gameover = document.getElementById("gameover")!;
const restart = document.getElementById("restart");
const gameOverScore = document.getElementById("gameOverScore")!;
const mainMenu = document.getElementById("MainMenu")!;
const fpsCounter = document.getElementById("fps-counter")!;
const background = document.getElementById("background")!;

let pipeContainers: HTMLElement[] = [];
let pipeContainerXPositions: number[] = [];
let pipeScored: boolean[] = [];

let gameStarted : boolean = false;

let createPipeInterval: number;

let lastTime = performance.now();

function update(deltaTime: number): void {
    
    scoretext.innerHTML = `Score: ${score}`;

    // Update positions
    if(gameStarted){
        velocity += gravity * deltaTime;
        positionY += velocity * deltaTime;
        positionXPipes += speed * deltaTime;
    }
    positionXGround += speed * deltaTime;

    // Clamp to screen bounds
    if (positionY >= groundLevel) {
        positionY = groundLevel;
        velocity = 0;
        running = false;
        gameOver();
        return;
    } else if (positionY <= skylevel) {
        positionY = skylevel;
        velocity = 0;
        running = false;
        gameOver();
        return;
    }

    player.style.top = `${positionY}px`;

    if (positionXGround <= -ground1.offsetWidth) {
        positionXGround = 0;
    }

    ground1.style.left = `${positionXGround}px`;
    ground2.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    ground3.style.left = `${positionXGround + 2 * ground1.offsetWidth - 2}px`;

    // Move pipes
    for (let i = 0; i < pipeContainers.length; i++) {
        pipeContainerXPositions[i] += speed * deltaTime;
        const pos = pipeContainerXPositions[i];
        pipeContainers[i].style.left = `${pos}px`;

        if (pos <= -20 && !pipeScored[i]) {
            pipeScored[i] = true;
            score++;
        }

        if (pos <= -200) {
            pipeContainers[i].remove();
            pipeContainers.splice(i, 1);
            pipeContainerXPositions.splice(i, 1);
            pipeScored.splice(i, 1);
            i--;
        }
    }

    if (isCollidingWithAny(player, pipes)) {
        running = false;
        gameOver();
        return;
    }

    if(difficulty === "easy"){
        multiplier = easyMultiplier;
    } else if(difficulty === "medium"){
        multiplier = mediumMultiplier;
    }else if(difficulty === "hard"){
        multiplier = hardMultiplier;
    }

    if(score === lastScore + 15 && difficulty === "easy"){
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier);
        lastScore += 15;
        speed *= 1.1;
    }else if (score === lastScore + 15 && difficulty === "medium"){
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier);
        lastScore += 15;
        speed *= 1.5;
    }else if (score === lastScore + 20 && difficulty === "hard"){
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier);
        lastScore += 20;
        speed *= 2;
    }
}

function gameLoopFunction(currentTime: number): void {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (running) {
        update(deltaTime);
        requestAnimationFrame(gameLoopFunction);
    }
}

function Jump(): void {
    velocity = -jumpForce;
}

function isCollidingWithAny(player: HTMLElement, pipes: HTMLCollectionOf<Element>): boolean {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i] as HTMLElement;
        if (isColliding(player, pipe)) {
            return true;
        }
    }
    return false;
}

function isColliding(el1: HTMLElement, el2: HTMLElement): boolean {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const shrink = 5;

    return (
        rect1.left + shrink < rect2.right - shrink &&
        rect1.right - shrink > rect2.left + shrink &&
        rect1.top + shrink < rect2.bottom - shrink &&
        rect1.bottom - shrink > rect2.top + shrink
    );
}

document.addEventListener("keydown", (event) => {

    if (event.code === "Space") {
        if(!gameStarted){
            gameStarted = true;
        }
        Jump();
    }
});

document.addEventListener("wheel", function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

function createPipe() {
    mainMenu.style.display = "none";
    if (!running) return;
    if(!gameStarted) return;

    const pipeStartPos = 1350;
    const pipeContainer = document.createElement("div");
    pipeContainer.classList.add("pipe-container");
    pipeContainer.style.left = `${pipeStartPos}px`;

    const pipeUp = document.createElement("div");
    pipeUp.classList.add("pipe", "pipe-up");

    const pipeDown = document.createElement("div");
    pipeDown.classList.add("pipe", "pipe-down");

    pipeContainer.appendChild(pipeUp);
    pipeContainer.appendChild(pipeDown);

    const minOffset = -300;
    const maxOffset = 0;
    const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;

    pipeContainer.style.top = `${randomOffset}px`;

    document.body.appendChild(pipeContainer);
    pipeContainers.push(pipeContainer);
    pipeContainerXPositions.push(pipeStartPos);
    pipeScored.push(false);
}

function gameOver() {
    gameStarted = false;
    gameover.style.display = "block";
    gameOverScore.innerHTML = `Your Score is: ${score}`;
    clearInterval(createPipeInterval);
}

restart?.addEventListener("click", restartGame);

function restartGame() {
    background.style.display = "none";
    mainMenu.style.display = "none";
    clearInterval(createPipeInterval);

    pipeContainers.forEach(pipe => pipe.remove());
    pipeContainers = [];
    pipeContainerXPositions = [];
    pipeScored = [];

    resetVariables();
    gameover.style.display = "none";

    createPipeInterval = setInterval(createPipe, 1500);
    lastTime = performance.now();
    requestAnimationFrame(gameLoopFunction);
}

function resetVariables() {
    positionY = 300;
    velocity = 0;
    positionXGround = 0;
    positionXPipes = 300;
    score = 0;
    running = true;
    scoretext.innerHTML = `Score: ${score}`;
}

function MainMenu() {
    background.style.display = "block";
    mainMenu.style.display = "block";
    gameover.style.display = "none";
    running = false;
    clearInterval(createPipeInterval);
}

// FPS COUNTER
let frameCount = 0;
let fps = 0;
let visible = false;
let lastFpsTime = performance.now();

window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f") {
        visible = !visible;
        fpsCounter.style.display = visible ? "block" : "none";
    }
});

function updateFPS(currentTime: number): void {
    console.log(gameStarted);
    console.log(gameStarted);
    frameCount++;

    if (currentTime - lastFpsTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsTime = currentTime;
        fpsCounter.textContent = `FPS: ${fps}`;
    }

    requestAnimationFrame(updateFPS);
}

requestAnimationFrame(updateFPS);

