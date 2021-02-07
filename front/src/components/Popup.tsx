import React, {useEffect} from "react";
import styles from './Popup.module.css';

const Popup: React.FC<any> = ({ children, onCloseClick }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    return (
        <div className={styles.FixedLayout}>
            <div className={styles.Close} onClick={onCloseClick} />
            {children}
        </div>
    );
}

export { Popup };