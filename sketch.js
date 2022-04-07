let cameraX = 10,
    cameraY = 10,
    cameraZ = 100; //目の位置。
let targetX = 0,
    targetY = 0,
    targetZ = 0; //見る位置の座標。今のところ原点で固定したほうがいい。
let e = 0;
let A, B, C;
let xSlider, ySlider, zSlider, aSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);

    aSlider = createSlider(-1000, 1000, 0);
    aSlider.position(width - 200, 70);
    aSlider.style("width", "100px");

    rSlider = createSlider(5, 100, 5);
    rSlider.position(width - 200, 90);
    rSlider.style("width", "100px");

    scale(1, -1);
    A = targetX - cameraX; //見る方向のベクトル(x成分)
    B = targetY - cameraY; //見る方向のベクトル(y成分)
    C = targetZ - cameraZ; //見る方向のベクトル(z成分)
}

function draw() {
    background("gray");

    translate(width / 2, height / 2);
    scale(1, -1);

    // if (a || d || w || s) targetX = cameraX, targetY = cameraY;

    A = targetX - cameraX;
    B = targetY - cameraY;
    C = targetZ - cameraZ;
    e = A * cameraX + B * cameraY + C * cameraZ;

    noStroke();

    //軸の描画
    axes(600);

    //立方体の描画
    stroke("black");
    strokeWeight(8);
    myBox(200, -400, 0, 100, 100, 100);

    strokeWeight(2);


    for (let x = -100; x < 100; x++) {
        for (let y = -100; y < 100; y++) {
            let root = sqrt(x ** 2 + y ** 2);
            let r = 100;
            if (90 <= root && root <= 100) {
                let { x: convertedX, y: convertedY } = convertCoordinate(x, y, 0);
                point(convertedX, convertedY);
            }
        }
    }

    // stroke("blue")
    // for (let x = -50; x < 50; x++) {
    //     for (let y = -50; y < 50; y++) {
    //         let z = duplexFunction(x, y);
    //         let { x: convertedX, y: convertedY } = convertCoordinate(x, y, z);
    //         point(convertedX, convertedY);
    //     }
    // }

    mySphere();

    myElipticCurve();


    //目の位置の移動
    if (q) cameraZ += 3;
    if (a) cameraX -= 3;
    if (w) cameraY += 3;
    if (s) cameraY -= 3;
    if (E) cameraZ -= 3;
    if (d) cameraX += 3;
    if (z) {
        cameraX += 1;
        cameraY += 1;
        cameraZ += 1;
    }
    if (c) {
        cameraX -= 1;
        cameraY -= 1;
        cameraZ -= 1;
    }

    scale(1, -1);
    translate(-width / 2, -height / 2);
    fill("white");
    noStroke();
    textSize(30);
    text(`Camera: (${cameraX}, ${cameraY}, ${cameraZ})`, 20, 30);

    text(`Look at: (${targetX}, ${targetY}, ${targetZ})`, 20, 60);

    if (cameraZ < 0) cameraZ = 0;

}

//ある始点と終点の空間座標を入れると平面座標に変換して辺を描画してくれる関数。
function l(x, y, z, x2, y2, z2) {
    let { x: convertedX, y: convertedY } = convertCoordinate(x, y, z);
    let { x: convertedX2, y: convertedY2 } = convertCoordinate(x2, y2, z2);
    line(convertedX, convertedY, convertedX2, convertedY2);
}

// 直方体を描画する関数
function myBox(x, y, z, w, h, d) {
    l(x, y, z, x + w, y, z);
    l(x, y, z, x, y + h, z);
    l(x, y, z, x, y, z + d);
    l(x + w, y, z, x + w, y + h, z);
    l(x + w, y, z, x + w, y, z + d);
    l(x, y + h, z, x + w, y + h, z);
    l(x, y + h, z, x, y + h, z + d);
    l(x + w, y + h, z, x + w, y + h, z + d);
    l(x, y, z + d, x, y + h, z + d);
    l(x, y, z + d, x + w, y, z + d);
    l(x + w, y + h, z + d, x + w, y, z + d);
    l(x + w, y + h, z + d, x, y + h, z + d);
}

// 円を描画する関数
function myCircle() {
    for (let x = -10000; x < 10000; x++) {
        // let y = x**3 / 1000;
        let y = x;
        let root = sqrt(sq(x) + sq(y));
        let r = 100;
        if (90 <= root && root <= 100) {
            let { x: convertedX, y: convertedY } = convertCoordinate(x, y, 0);
            point(convertedX, convertedY);
        }
    }
}

// 球を描画する関数
function mySphere() {
    let tmpR = rSlider.value();

    for (let x = -tmpR; x < tmpR; x++) {
        for (let y = -tmpR; y < tmpR; y++) {
            for (let z = -tmpR; z < tmpR; z++) {
                let root = sqrt(x ** 2 + y ** 2 + z ** 2);
                let r = tmpR;
                if (r * 0.999 <= root && root <= r * 1.001) {
                    let { x: convertedX, y: convertedY } = convertCoordinate(x, y, z);
                    point(convertedX, convertedY);
                }
            }
        }
    }
}

// 楕円曲線を描画する関数
function myElipticCurve() {
    for (let x = -200; x < 200; x++) {
        let y = sqrt((1 / 50) * x ** 3 + aSlider.value() * x);
        let { x: convertedX, y: convertedY } = convertCoordinate(x, y, 0);
        let { x: convertedX2, y: convertedY2 } = convertCoordinate(x, -y, 0);
        point(convertedX, convertedY);
        point(convertedX2, convertedY2);
    }
}

// 座標軸を描画する関数
function axes(len) {
    textSize(20);
    fill("white");
    strokeWeight(5);
    stroke(0, 0, 255);
    l(0, 0, 0, 0, 0, len);
    stroke(0, 255, 0);
    l(0, 0, 0, 0, len, 0);
    stroke(255, 0, 0);
    l(0, 0, 0, len, 0, 0);
    stroke(0, 0, 125);
    l(0, 0, 0, 0, 0, -len);
    stroke(0, 125, 0);
    l(0, 0, 0, 0, -len, 0);
    stroke(125, 0, 0);
    l(0, 0, 0, -len, 0, 0);
}

// 二変数関数（今回はsin cosを使用）
function duplexFunction(x, y) {
    return sin(x) + cos(y);
}

//ある点の空間座標を入れると平面座標に変換して(x, y)を返す。
function convertCoordinate(x, y, z) {
    let v, w, V, W;
    let D, E, F;

    v = new createVector(cameraX + e / A, cameraY - e / B, cameraZ);
    w = new createVector(cameraX, cameraY, cameraZ - sq(e) / (A * B));

    let n = -B;
    let m = A;

    V = new createVector(n, m, 0);
    F = 1;
    D = -(A * C) / (sq(B) + sq(A));
    E = -(B * C) / (sq(B) + sq(A));
    W = new createVector(D, E, F);
    V.normalize(V);
    W.normalize(W);

    V.setMag(
        sqrt(
            sq(targetX - cameraX) +
            sq(targetY - cameraY) +
            sq(targetZ - cameraZ)
        ) / sqrt(125000)
    );
    W.setMag(
        sqrt(
            sq(targetX - cameraX) +
            sq(targetY - cameraY) +
            sq(targetZ - cameraZ)
        ) / sqrt(125000)
    );

    let k = (A * x + B * y + C * z - e) / (-sq(A) - sq(B) - sq(C));
    let t = (z + (1 + k) * C) / W.z;
    let s = (x + (1 + k) * A - t * W.x) / V.x;

    if (V.x == 0) {
        s = (y + (1 + k) * B - t * W.y) / V.y;
    }

    return { x: s, y: t };
}

let q, a, w, s, E, d, z, c;
//キー入力
function keyPressed() {
    if (key == "q") q = true;
    if (key == "a") a = true;
    if (key == "w") w = true;
    if (key == "s") s = true;
    if (key == "e") E = true;
    if (key == "d") d = true;
    if (key == "z") z = true;
    if (key == "c") c = true;
}

function keyReleased() {
    if (key == "q") q = false;
    if (key == "a") a = false;
    if (key == "w") w = false;
    if (key == "s") s = false;
    if (key == "e") E = false;
    if (key == "d") d = false;
    if (key == "z") z = false;
    if (key == "c") c = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, WEBGL);
}

function mouseWheel(event) {
    if (cameraZ > 0 || event.deltaY > 0) cameraZ += event.deltaY / 5 | 0;
    // cameraX += event.deltaX / 5 | 0;
}

// Look at 方式だと、どうも見るところが遠くなるほど、小さく映ってしまうらしい




/**
 * //   円の方程式書きたい
    //   x^2 + y^2 = r^2
    //   √(x^2 + y^2) = r

    //   球の方程式
    //   √(x^2 + y^2 + z^2) = r

    //   楕円曲線
    //   y^2 = x^3 + ax + b
    //   y = √(x^3 + ax + b)


    //   ハートの方程式 x^2+(y−3√x^2)^2=1
    //   x ** 2 + (y - cbrt(x^2)) ** 2 == 1
 */