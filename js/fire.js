"use strict";

let canvas, width, height, ctx;
let fireworks = [];
let particles = [];
let backgroundImage;

function setup() {
    canvas = document.getElementById("canvas");
    setSize(canvas);
    ctx = canvas.getContext("2d");

    // Load the background image
    backgroundImage = new Image();
    backgroundImage.src = "image/f.jpg"; // Replace "path_to_your_image.jpg" with the actual path to your image

    fireworks.push(new Firework(Math.random() * (width - 200) + 100));

    window.addEventListener("resize", windowResized);
    document.addEventListener("click", onClick);
}

setTimeout(setup, 1);

function loop() {
    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    for (let i = 0; i < fireworks.length; i++) {
        let done = fireworks[i].update();
        fireworks[i].draw();
        if (done) fireworks.splice(i, 1);
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].lifetime > 80) particles.splice(i, 1);
    }

    if (Math.random() < 1 / 60) fireworks.push(new Firework(Math.random() * (width - 200) + 100));
}

setInterval(loop, 1 / 60);

class Particle {
    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.vel = randomVec(10); // Adjusted particle speed for a larger effect
        this.lifetime = 0;
        this.size = 8; // Adjusted particle size
    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.vel.y += 0.02;
        this.vel.x *= 0.99;
        this.vel.y *= 0.99;
        this.lifetime++;
    }

    draw() {
        ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Draw particles as circles
        ctx.fill();
    }
}

class Firework {
    constructor(x) {
        this.x = x;
        this.y = height;
        this.isBlown = false;
        this.col = randomCol();
    }

    update() {
        this.y -= 3;
        if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
            this.isBlown = true;
            for (let i = 0; i < 60; i++) {
                particles.push(new Particle(this.x, this.y, this.col));
            }
        }
        return this.isBlown;
    }

    draw() {
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}

function randomCol() {
    var letter = '0123456789ABCDEF';
    var nums = [];

    for (var i = 0; i < 3; i++) {
        nums[i] = Math.floor(Math.random() * 200) + 55; // Adjusted to generate more vibrant colors
    }

    let color = "#";
    for (var i = 0; i < 3; i++) {
        color += letter[Math.floor(nums[i] / 16)];
        color += letter[Math.floor(nums[i] % 16)];
    }
    return color;
}

function randomVec(max) {
    let dir = Math.random() * Math.PI * 2;
    let spd = Math.random() * max;
    return { x: Math.cos(dir) * spd, y: Math.sin(dir) * spd };
}

function setSize(canv) {
    canv.style.width = innerWidth + "px";
    canv.style.height = innerHeight + "px";
    width = innerWidth;
    height = innerHeight;

    canv.width = innerWidth * window.devicePixelRatio;
    canv.height = innerHeight * window.devicePixelRatio;
    canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
}

function onClick(e) {
    fireworks.push(new Firework(e.clientX));
}

function windowResized() {
    setSize(canvas);
    ctx.drawImage(backgroundImage, 0, 0, width, height); // Redraw background image on resize
}
