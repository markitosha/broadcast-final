import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import styles from './Layout.module.css';
// @ts-ignore
import {useRoutes} from "hookrouter";
import {Path} from "../constants";
import {LoginContext} from "../state/loginContext";
import {draw} from "./drawStars";
import {drawBall} from "./drawBall";

const params = {
    [Path.signin]: () => ({ ballerina: true }),
    [Path.signup]: () => ({ ballerina: true }),
    [Path.main]: () => ({ ballerina: true }),
    [Path.about]: () => ({ ballerina: false }),
    [Path.live]: () => ({ ballerina: false })
};

const Layout: React.FC<any> = ({ children, notFound }) => {
    const loaded = useRef(false);
    const interval = useRef<any>(null);
    const intervalBall = useRef<any>(null);
    const canvas = useRef<any>();
    const canvasRef = useCallback(node => {
        if (node) {
            canvas.current = node;
            handleResize();
            startAnimation('layout');
        }
    }, []);
    const canvasBall = useRef<any>();
    const canvasBallRef = useCallback(node => {
        if (node) {
            canvasBall.current = node;
            handleResize();
            startAnimation('ballerina');
        }
    }, []);

    const [sizes, setSizes] = useState({ height: window.innerHeight, width: window.innerWidth });
    const [sizesBall, setSizesBall] = useState({
        height: 0.4 * window.innerWidth,
        width: 0.5 * window.innerWidth - 80 - 40
    });

    const { logged } = useContext(LoginContext);
    const { ballerina } = useRoutes(params) || {};

    const handleResize = useCallback(() => {
        setSizes({
            height: window.innerHeight,
            width: window.innerWidth
        });
        setSizesBall({
            height: 0.4 * window.innerWidth,
            width: 0.5 * window.innerWidth - 80 - 40
        });
    }, []);

    useEffect(() => {
        startAnimation('layout');
        startAnimation('ballerina');
    }, [ sizes, sizesBall ]);

    const loadAnimation = (e: Event) => {
        loaded.current = true;
        handleResize();
    };

    const startAnimation = (type: 'layout' | 'ballerina') => {
        try {
            if (!loaded.current) {
                return;
            }

            if (type === 'layout' && canvas.current) {
                const ctx = canvas.current.getContext('2d');
                const drawInner = draw(ctx, sizes);

                if (interval.current) {
                    clearInterval(interval.current);
                    interval.current = null;
                }

                interval.current = setInterval(drawInner, 20);

                return;
            }

            if (type === 'ballerina' && canvasBall.current) {
                const ctx = canvasBall.current.getContext('2d');
                const drawInner = drawBall(ctx, sizesBall);

                if (intervalBall.current) {
                    clearInterval(intervalBall.current);
                    intervalBall.current = null;
                }

                intervalBall.current = setInterval(drawInner, 100);

                return;
            }
        } catch (e) {}
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('load', loadAnimation);

        return () => {
            window.removeEventListener('load', loadAnimation);
        }
    }, []);

    return (
        <>
            <canvas width={sizes.width} height={sizes.height} className={styles.Canvas} ref={canvasRef} />
            <div className={styles.Layout}>
                {children}
                {ballerina && !logged && !notFound && <>
                    <div className={styles.Ballerina} />
                    <canvas width={sizesBall.width} height={sizesBall.height} className={styles.Ballerina} ref={canvasBallRef} />
                    <div className={styles.Clock} />
                </>}
            </div>
            <a href={"mailto:bcsnutcracker@gmail.com"} className={styles.QuestionButton}>
                <div className={styles.Question} />
            </a>
        </>
    );
}

export { Layout };

