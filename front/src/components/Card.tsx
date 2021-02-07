import React from 'react';
import styles from './Card.module.css';

const Line = () => (
    <div className={styles.Line} />
)
const Card: React.FC = ({ children }) => (
    <div className={styles.Container}>
        <div className={styles.Header}>
            <Line />
            <div className={styles.Logo} />
            <Line />
        </div>
        {children}
    </div>
)

export { Card };