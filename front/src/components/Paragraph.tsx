import React from "react";
import styles from './Paragraph.module.css';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Paragraph: React.FC<any> = ({ children, last, justify }) => (
    <p className={cx(styles.Paragraph, {
        Last: last,
        Justify: justify
    })}>
        {children}
    </p>
);

export { Paragraph };

