let canvas = document.querySelector('.myCanvas');
let context = canvas.getContext('2d');
let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;
let maxRadius = 50;
let minRadius = 10;
let growRadius = 2.5;
let shapeArr = [];
let colorArr = ['#dddddd', '#222831', '#30475e', '#f05454']
let mouse = {
    x: undefined,
    y: undefined
}
canvas.width = innerWidth;
canvas.height = innerHeight;


window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
})


function Circle(r, x, y, dx, dy, color) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.minRadius = r;
    this.origColor = color;

    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        // context.stroke();
        context.fill();
    }

    this.update = function () {
        if (this.x + this.r > innerWidth || this.x - r < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.r > innerHeight || this.y - this.r < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        // Interactivity
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.r < maxRadius) {
                this.r += growRadius;
            }
        } else if (this.r > this.minRadius) {
            this.r -= growRadius;
        }

        // Hide circles behind a square. Find out how you can hide it behind a circle
        // if (mouse.x - this.x < 75 && mouse.x - this.x > -75 && mouse.y - this.y < 75 && mouse.y - this.y > -75) {
        //     this.color = "#fff";
        // } else {
        //     this.color = this.origColor;
        // }

        this.draw();
    }
}

function grn(min, max) {
    let random = Math.floor(Math.random() * max + 1);
    return random >= min ? random : grn(min, max);
}

function init() {
    shapeArr = [];
    for (let i = 0; i < 600; i++) {
        let r = grn(5, 10);
        let x = Math.random() * (innerWidth - r * 2) + r;
        let y = Math.random() * (innerHeight - r * 2) + r;
        let dx = Math.random() - 0.5 * grn(3, 5);
        let dy = Math.random() - 0.5 * grn(3, 5);
    
        let color = colorArr[Math.floor(Math.random() * colorArr.length)];
    
        shapeArr.push(new Circle(r, x, y, dx, dy, color))
    }
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    shapeArr.forEach(element => {
        element.update();
    });

}
init();
animate();