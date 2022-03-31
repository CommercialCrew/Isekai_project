var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;
var terrain = [];
var framePreset = 0;
let cameraSpeed = 450;
var moonlight = 0;
var flightPosX, flightPosY;
var flyingSpeed = 0;
var timeLimit = 60;
const FRAME_RATE = 60;

function setup() {
    createCanvas(600, 600, WEBGL);
    camera = createCamera();
    cols = w / scl;
    rows = h / scl;
    // 2차원 배열 초기화
    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
        for (var y = 0; y < rows; y++) {
            terrain[x][y] = 0; //specify a default value for now
        }
    }
    noStroke();
    // 비행기 위치 초기화
    flightPosX = 300 - width / 2;
    flightPosY = height / 2 - 150;
    thread(dropCount);
}

function draw() {
    framePreset = frameCount / FRAME_RATE;
    moonlight = framePreset / 3;
    if (sin(framePreset) > 0) {
        background(0);
    } else {
        background(80, 188, 223);
    }
    // 산 높이 및 산 이동 속도 설정
    flyingSpeed -= 0.01;
    setMountain(flyingSpeed);
    translate(0, 50);
    rotateX(PI / 3);
    // 카메라 위치 설정 및 각도 설정
    camera.lookAt(flightPosX, flightPosY, 200);
    camera.setPosition(flightPosX, flightPosY + cameraSpeed, cameraSpeed * 1.73);


    translate(-w / 2, -h / 2);
    // 산 생성
    makeMountain();
    push();
    // 해와 달 생성
    makeSun(framePreset);
    makeMoon(framePreset, moonlight);
    pop();

    translate(w / 2, h / 2);
    /* 비행기 위치 이동 translate */
    translate(flightPosX, flightPosY, 200);
    push();
    flight();
    pop();
}

function setMountain(_flyingSpeed) {
    /* 산 높이를 설정하는 함수 */
    var yoff = _flyingSpeed;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
            xoff += 0.5;
        }
        yoff += 0.2;
    }
}

function makeMountain() {
    /* 산 만드는 함수 */
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
}

function makeSun(_framePreset) {
    /* 태양 만드는 함수 */
    translate(w / 2 - cos(_framePreset) * 800, 0, -sin(_framePreset) * 260);  //sun
    push();
    ambientLight(50);
    pointLight(255, 255, 255, 0, 0, 50);
    specularMaterial(255, 0, 0);
    sphere(50);
    pop();
}

function makeMoon(_framePreset, _moonlight) {
    /* 달 만드는 함수 */
    translate(cos(_framePreset) * 1600, 0, sin(_framePreset) * 520);    //moon
    pointLight(250, 250, 250, 1800 - ((_moonlight * 900) % 3600), -400, 50);
    fill(255, 255, 0);
    sphere(50);
}

function flight() {
    /* 비행기 키보드 이동 및 생성 함수 */
    flightKeyPressed();

    fill(125);
    triangle(-50, 20, 0, -30, 50, 20);
    triangle(-50, 20, -25, 20, -37.5, 37.5);
    fill(0);
    triangle(-25, 20, 0, 20, -12.5, 27.5);
    triangle(0, 20, 25, 20, 12.5, 27.5);
    fill(125);
    triangle(25, 20, 50, 20, 37.5, 37.5);
    noFill();
}

function flightKeyPressed() {
    /* 비행기 및 카메라 조절 함수 */
    if (keyIsDown(UP_ARROW)) {
        cameraSpeed -= 4;
        flightPosY -= 10;
    }
    if (keyIsDown(DOWN_ARROW)) {
        cameraSpeed += 4;
        flightPosY += 10;
    }
    if (keyIsDown(LEFT_ARROW)) {
        rotateY(-PI / 3);
        flightPosX -= 10;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        rotateY(PI / 3);
        flightPosX += 10;
    }
}
