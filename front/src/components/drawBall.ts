const dots = [
    [0.35, 0.18], // A
    [0.25, 0.13], // B
    [0.09, 0.03], // C
    [0, 0], // D
    [0.03, 0.07], // E
    [0.25, 1], // F
    [0.11, 0.07], // G
    [0.20, 0.18], // H
    [0.25, 1], // F
    [0.245, 0.9], // J
    [0.20, 0.18], // H
    [0.30, 0.24], // I
    [0.245, 0.9], // J
    [0.28, 0.8], // K
    [0.30, 0.24], // I
    [0.32, 0.39], // L
    [0.415, 0.31], // M
    [0.45, 0.24], // N
    [0.53, 0.30], // O
    [0.62, 0.30], // P
    [0.68, 0.36], // R
    [0.76, 0.40], // S
    [0.78, 0.38], // T
    [0.91, 0.38], // U
    [0.90, 0.45], // V
    [0.55, 0.66], // W
    [0.30, 1], // x
    [0.25, 1], // F
    [0.30, 1], // x
    [0.342, 0.90], // E1
    [0.50, 0.55], // Y
    [0.62, 0.40], // Z
    [0.62, 0.30], // P
    [0.62, 0.40], // Z
    [0.68, 0.36], // R
    [0.62, 0.40], // Z
    [0.76, 0.40], // S
    [0.62, 0.40], // Z
    [0.50, 0.55], // Y
    [0.76, 0.45], // A1
    [0.90, 0.45], // V
    [0.76, 0.45], // A1
    [0.50, 0.55], // Y
    [0.39, 0.63], // B1
    [0.39, 0.74], // С1
    [0.33, 0.85], // D1
    [0.342, 0.90], // E1
    [0.30, 1], // x
];

const randomed: any = {};

const drawBall = (ctx: any, sizes: any) => {
    let counter = 0;
    let direction = 1;
    let itr = 20;

    for (let i = 0; i < dots.length - 1; ++i) {
        const label = dots[i][0].toString() + ':' + dots[i][1].toString();

        if (randomed[label]) {
            dots[i][2] = randomed[label][2];
            dots[i][3] = randomed[label][3];
            continue ;
        }

        dots[i][2] = Math.random() * 2 - 1;
        dots[i][3] = Math.random() * 2 - 1;

        randomed[label] = dots[i];
        // dots[i][2] = 0;
        // dots[i][3] = 0;
    }

    const board = (val: any, max: any) => {
        if (val < 0) {
            return val;
        }

        if (val > max) {
            return max;
        }

        return val;
    }

    function drawInner() {
        try {
            if (counter === 0 && direction === -1) {
                return;
            }

            ctx.clearRect(0, 0, sizes.width, sizes.height);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = "#ffe9c4";
            // ctx.strokeStyle = "red";
            ctx.lineWidth = "2";

            ctx.beginPath();

            if (counter === itr && direction === 1) {
                direction = -1;
            }

            for (let i = 0; i < dots.length - 1; ++i) {
                const [xFrom, yFrom, dx, dy] = dots[i];
                const [xTo, yTo, dtx, dty] = dots[i + 1];
                const {height, width} = sizes;

                const xf = board(xFrom * width + dx * counter, sizes.width);
                const yf = board(yFrom * height + dy * counter, sizes.height);
                const xt = board(xTo * width + dtx * counter, sizes.width);
                const yt = board(yTo * height + dty * counter, sizes.height);

                ctx.moveTo(xf, yf);
                ctx.lineTo(xt, yt);
            }

            // ctx.strokeStyle = '2px';
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            counter += direction;
        } catch (e) {}
    };

    return drawInner;
};

export { drawBall };
