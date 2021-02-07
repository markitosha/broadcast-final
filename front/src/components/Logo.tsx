import React from "react";
import styles from './Logo.module.css';
import classNamesBind from "classnames/bind";

const cx = classNamesBind.bind(styles);

const Logo: React.FC<any> = ({ small }) => (
    <div className={cx('Logo', { Small: small })}/>
);

export { Logo };

