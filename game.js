const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// game objects
const paddleWidth = 15, paddleHeight = 100;
const player = { x: 5, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, color: "#fff", dy: 0 };
const ai = { x: canvas.width - paddleWidth - 5, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, color: "#fff", dy: 0 };
const ball = { x: canvas.width/2, y: canvas.height/2, radius: 10, speed: 6, dx: 6, dy: 6, color: "#fff" };

// draw functions
function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}
function drawBall(obj) {
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player);
    drawRect(ai);
    drawBall(ball);
}

// control player paddle with mouse
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// collision detection
function collision(p, b) {
    return (
        p.x < b.x + b.radius &&
        p.x + p.width > b.x - b.radius &&
        p.y < b.y + b.radius &&
        p.y + p.height > b.y - b.radius
    );
}

// reset ball
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.dx *= Math.random() > 0.5 ? 1 : -1;
    ball.dy *= Math.random() > 0.5 ? 1 : -1;
}

// update positions
function update() {
    // move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // paddle collision
    if (collision(player, ball)) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
    } else if (collision(ai, ball)) {
        ball.dx = -ball.dx;
        ball.x = ai.x - ball.radius;
    }

    // score
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }

    // simple AI
    if (ball.y < ai.y + ai.height/2) {
        ai.y -= 5;
    } else if (ball.y > ai.y + ai.height/2) {
        ai.y += 5;
    }
    // clamp AI paddle
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();
