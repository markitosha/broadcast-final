import React from "react";
import styles from './Time.module.css';
import classNamesBind from "classnames/bind";
import Cookies from "js-cookie";
// @ts-ignore
import {getBasepath} from "hookrouter";

const cx = classNamesBind.bind(styles);

const Time: React.FC<any> = (props) => {
    const partner = Cookies.get('partner') || getBasepath();
    const time = partner.includes('sibir') ? '16:00' : '19:00';

    return (
        <div className={cx(styles.Block, {
            BlockRose: props.rose
        })}>
            <div className={cx(styles.Time, {
                Rose: props.rose
            })}>
                7 февраля 2021{props.rose ? <br /> : ','}&nbsp;
            </div>
            <div className={cx(styles.Time, {
                Rose: props.rose
            })}>
                {time}
            </div>
            <div className={cx(styles.GMT, {
                RoseGMT: props.rose
            })}>
                МСК
            </div>
        </div>
    );
}

export { Time };

