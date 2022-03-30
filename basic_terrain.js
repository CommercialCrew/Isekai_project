var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;
var timeA = 0;
var timeB = 0;
var moonlight = 0;
var xV;
var xY;
var flying = 0;
let locX;
let locY;

var terrain = [];

function setup() {
    createCanvas(600, 600, WEBGL);
    cols = w / scl;
    rows = h / scl;

    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
        for (var y = 0; y < rows; y++) {
            terrain[x][y] = 0; //specify a default value for now
        }
    }
    noStroke();
    vX = 300 - width / 2;
    vY = height / 2 - 150;
}

function draw() {
    timeB++;
    timeA = timeB / 60;
    moonlight = timeA / 3;
    locX = mouseX - width / 2;
    locY = mouseY - height / 2;
    if (sin(timeA) > 0) {
        background(0);
    } else {
        background(80, 188, 223);
    }
    flying -= 0.01;
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
            xoff += 0.5;
        }
        yoff += 0.2;
    }
    translate(0, 50);
    rotateX(PI / 3);
    // fill(200, 200, 200);
    translate(-w / 2, -h / 2);
    for (var y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (var x = 0; x < cols; x++) {
            let v = terrain[x][y];
            v = map(v, -100, 100, 0, 255);
            fill(v - 64, v - 32, v);
            vertex(x * scl, y * scl, terrain[x][y]);
            vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
        }
        endShape();
    }
    push();
    translate(w / 2 - cos(timeA) * 800, -200, -sin(timeA) * 260);  //sun
    push();
    ambientLight(50);
    pointLight(255, 255, 255, 0, 0, 50);
    specularMaterial(255, 0, 0);
    sphere(50);
    pop();
    translate(cos(timeA) * 1600, 0, sin(timeA) * 520);    //moon
    pointLight(250, 250, 250, 1800 - ((moonlight * 900) % 3600), -400, 50);
    fill(255, 255, 0);
    sphere(50);
    pop();
    translate(w / 2, h / 2);
    translate(vX, vY, 200);
    push();
    if (keyIsDown(UP_ARROW)) {
        vY--;
    }
    if (keyIsDown(DOWN_ARROW)) {
        vY++;
    }
    if (keyIsDown(LEFT_ARROW)) {
        rotateY(-PI / 3);
        vX--;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        rotateY(PI / 3);
        vX++;
    }
    fill(125);
    triangle(-50, 20, 0, -30, 50, 20);
    triangle(-50, 20, -25, 20, -37.5, 37.5);
    fill(0);
    triangle(-25, +20, 0, 20, -12.5, 27.5);
    triangle(0, 20, 25, 20, 12.5, 27.5);
    fill(125);
    triangle(25, 20, 50, 20, 37.5, 37.5);
    noFill();
    pop();
}