
const draw = (ctx: any, sizes: any) => {
    const incr = 0.03;
    const r_incr = 0.1;

    const stars: any[] = [];

    for (let i = 0; i < 10; ++i) {
        const step = Math.floor(Math.random() * 33);

        stars.push({
            x: 0,
            y: 0,
            opacity: step * incr,
            direction: -1,
            radius: step * r_incr,
            alpha: 0,
        });
    }

    const drawInner = () => {
        try {
            ctx.clearRect(0, 0, sizes.width, sizes.height);
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = "#d4fbff";

            for (let star of stars) {
                if (star.opacity <= 0 && star.direction === -1) {
                    star.x = Math.round(Math.random() * sizes.width);
                    star.y = Math.round(Math.random() * sizes.height);
                    star.alpha = Math.round((Math.random() * 100 - 70) + 70);
                    star.opacity += incr;
                    star.radius += r_incr;
                    star.direction = 1;
                }

                if (star.opacity >= 1 && star.direction === 1) {
                    star.opacity -= incr;
                    star.direction = -1;
                    star.radius -= r_incr;
                }

                star.opacity += star.direction * incr;
                star.radius += star.direction * r_incr;

                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.globalAlpha = star.opacity;

                for (let i = 6; i > 0 && star.radius > 0; --i) {
                    ctx.arc(star.x, star.y, star.radius / 7 * i, 0, Math.PI * 2, true);
                }

                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        } catch (e) {}
    };

    return drawInner;
};

export { draw };
