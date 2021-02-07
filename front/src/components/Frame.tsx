import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styles from './Frame.module.css';
import {SocketContext} from "../state/socketContext";
import { ResizeObserver } from 'resize-observer';

const Frame: React.FC<any> = () => {
    const { url } = useContext(SocketContext);
    const [height, setHeight] = useState(0);
    const iframe = useRef<any>(null);
    const resizeObserver = useRef<any>(null);
    const iframeRef = useCallback(node => {
        if (node != null) {
            iframe.current = node;
            handleResize();
        }
    }, []);
    const handleResize = useCallback(() => {
        try {
            if (!iframe.current) {
                return;
            }

            const size = iframe.current?.getBoundingClientRect();
            const height = size.width / 16 * 9;

            setHeight(height);
        } catch (e) {}
    }, [ iframe.current ]);

    useEffect(() => {
        resizeObserver.current = new ResizeObserver(handleResize);
        resizeObserver.current.observe(document.getElementById('frame'));

        return () => {
            resizeObserver.current.disconnect();
        }
    }, []);

    return (
        <iframe
            src={url || 'about:blank'}
            className={styles.Container}
            title={'live'}
            allowFullScreen={true}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            ref={iframeRef}
            height={height}
            id={"frame"}
        />
    )
}

export { Frame };