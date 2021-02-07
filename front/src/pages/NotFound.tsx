import React from 'react';
import styles from './NotFound.module.css';
import classNamesBind from "classnames/bind";
//@ts-ignore
import {A, getBasepath} from "hookrouter";

const cx = classNamesBind.bind(styles);

const NotFound: React.FC = () => {
    const notMainPage = getBasepath().includes('notfound');

    return (
        <div className={styles.Container}>
            <div className={styles.Shel} />
            <div className={styles.Block}>
                <div className={styles.NF}>404</div>
                <div className={styles.Title}>Страница не&nbsp;найдена</div>
                <div className={styles.Text}>Возможно, она была перемещена, или вы&nbsp;неверно указали адрес страницы.</div>
                {!notMainPage && <A href={'/'} className={cx(styles.Text, styles.Link)}>Перейти на&nbsp;главную</A>}
            </div>
        </div>
    );
}

export { NotFound };