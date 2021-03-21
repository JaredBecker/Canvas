// Getting canvas info
let canvas = document.querySelector('.myCanvas');
let context = canvas.getContext('2d');
let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;
let shapeArr = [];
let animation;
let clearScreen = true;
let showTitle = true;
canvas.width = innerWidth;
canvas.height = innerHeight;

// Redraw on screen resize to make sure the canvas boundary is always the edge of the screen
window.addEventListener('resize', () => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
})

// Shape Constructor functions
function Circle(r, x, y, dx, dy, color, outline, outlineWidth, trippyMode, colorArr) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.outline = outline;
    this.outlineWidth = outlineWidth;
    this.trippyMode = trippyMode;
    this.colorArr = colorArr;
    
    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        
        if (this.trippyMode) {
            context.fillStyle = colorArr[Math.floor(Math.random() * (colorArr.length - 1))];
        } else {
            context.fillStyle = this.color;
        }
        
        if (this.outline) {
            context.strokeStyle = '#000';
            context.lineWidth = this.outlineWidth;
            context.stroke();
        }
        context.fill();
    }

    this.update = function () {
        this.x + this.r > innerWidth || this.x - r < 0 ? this.dx = -this.dx : ''
        this.y + this.r > innerHeight || this.y - this.r < 0 ? this.dy = -this.dy : ''
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

function Square(x, y, w, h, dx, dy, color, outline, outlineWidth, trippyMode, colorArr) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.outline = outline;
    this.outlineWidth = outlineWidth;
    this.trippyMode = trippyMode;
    this.colorArr = colorArr;

    this.draw = function () {
        context.beginPath();

        if (this.trippyMode) {
            context.fillStyle = colorArr[Math.floor(Math.random() * (colorArr.length - 1))];
        } else {
            context.fillStyle = this.color;
        }
        
        if (this.outline) {
            context.strokeStyle = '#000';
            context.lineWidth = this.outlineWidth;
            context.strokeRect(this.x, this.y, this.w, this.h);
        }
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    this.update = function () {
        this.x + this.w > innerWidth || this.x < 0 ? this.dx = -this.dx : '';
        this.y + this.h > innerHeight || this.y < 0 ? this.dy = -this.dy : '';
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

// Random number generator
function grn(min, max) {
    let random = Math.floor(Math.random() * max + 1);
    return random >= min ? random : grn(min, max);
}

// 
function animateCanvas() {
    animation = requestAnimationFrame(animateCanvas);
    if (clearScreen) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    shapeArr.forEach(element => {
        element.update();
    });
}

function getAllSettings() {
    let title = document.getElementById('page_title').value;
    let show_title = document.getElementById('show_title').checked;
    let num_shapes = document.getElementById('num_shapes').value;
    let colors = document.getElementById('colors').value;
    let bg_color = document.getElementById('background_color').value;
    let max_radius = document.getElementById('max_radius').value;
    let min_radius = document.getElementById('min_radius').value;
    let shapes = document.getElementById('shapes').value;
    let max_dx = document.getElementById('max_dx').value;
    let min_dx = document.getElementById('min_dx').value;
    let max_dy = document.getElementById('max_dy').value;
    let min_dy = document.getElementById('min_dy').value;
    let outline_thickness = document.getElementById('outline_thickness').value;
    let show_outline = document.getElementById('show_outline').checked;
    let trippy_mode = document.getElementById('enable_trippy_mode').checked;
    let clear_screen = document.getElementById('clear_screen').checked;

    return {
        title: title,
        show_title: show_title,
        num_shapes: num_shapes,
        colors: colors,
        bg_color: bg_color,
        max_radius: max_radius,
        min_radius: min_radius,
        shapes: shapes,
        max_dx: max_dx,
        min_dx: min_dx,
        max_dy: max_dy,
        min_dy: min_dy,
        outline_thickness: outline_thickness,
        show_outline: show_outline,
        trippy_mode: trippy_mode,
        clear_screen: clear_screen
    }
}

function init() {
    // Get all settings and set default values
    let s = getAllSettings();
    let limit = s.num_shapes > 0 ? s.num_shapes : 150;
    let min_r = s.min_radius > 0 ? s.min_radius : 10;
    let max_r = s.max_radius > 0 ? s.max_radius : 30;
    let min_dx = s.min_dx > 0 ? s.min_dx : 5;
    let max_dx = s.max_dx > 0 ? s.max_dx : 10;
    let min_dy = s.min_dy > 0 ? s.min_dy : 5;
    let max_dy = s.max_dy > 0 ? s.max_dy : 10;
    let colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
    if (s.colors != '') {
        colors = s.colors.trim().split(',');
    }
    let shapes = s.shapes;
    let bgColor = s.bg_color !== '' ? s.bg_color : "#fff";
    canvas.style.backgroundColor = bgColor;
    let title = s.title !== '' ? s.title : 'Just Relax';
    showTitle = s.show_title;
    let titleTag = document.querySelector('h1.title');
    if (showTitle) {
        titleTag.style.display = 'block';
        titleTag.textContent = title;
    } else {
        titleTag.style.display = 'none';
    }

    clearScreen = s.clear_screen;

    // Reset shape array to make sure it doesn't just keep adding on more and more shapes
    shapeArr = [];

    // Set the parameters for shapes and build all the shapes that will display on the screen
    for (let i = 0; i < limit; i++) {
        let r = grn(min_r, max_r);

        if (shapes == 'circle' || shapes == 'both') {
            x = Math.random() * (innerWidth - r * 2) + r;
            y = Math.random() * (innerHeight - r * 2) + r;
        }

        if (shapes == 'rect' || shapes == 'both') {
            w = grn(min_r, max_r);
            h = grn(min_r, max_r);
        }

        let dx = Math.random() - 0.5 * grn(min_dx, max_dx);
        let dy = Math.random() - 0.5 * grn(min_dy, max_dy);

        let colorArr = colors;
        let color = colorArr[Math.floor(Math.random() * colorArr.length)];

        if (shapes == 'circle') {
            shapeArr.push(new Circle(r, x, y, dx, dy, color, s.show_outline, s.outline_thickness, s.trippy_mode, colors));
        }

        if (shapes == 'rect') {
            shapeArr.push(new Square(x, y, w, h, dx, dy, color, s.show_outline, s.outline_thickness, s.trippy_mode, colors))
        }

        if (shapes == 'both') {
            if (i % 2 == 0) {
                shapeArr.push(new Circle(r, x, y, dx, dy, color, s.show_outline, s.outline_thickness, s.trippy_mode, colors))
            } else {
                shapeArr.push(new Square(x, y, w, h, dx, dy, color, s.show_outline, s.outline_thickness, s.trippy_mode, colors))
            }
        }
    }

    // Clear previous animation because there is a weird behaviour where it seems like the animation frames stack which gives you the effect of increased velocity why velocity remains unaffected...
    window.cancelAnimationFrame(animation);
    animateCanvas();
}

init();
animateCanvas();