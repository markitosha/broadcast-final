import React, {useCallback} from 'react';
import {Logo} from '../components/Logo';
import {Paragraph} from '../components/Paragraph';
import {Time} from '../components/Time';
import {Button} from "../components/Button";
import styles from './MainPage.module.css';
// @ts-ignore
import {navigate} from "hookrouter";
import {Path} from "../constants";

const MainPage: React.FC = () => {
    const handleClick = useCallback(() => navigate(Path.signup), []);

    return (
        <>
            <Logo/>
            <div className={styles.TextBlock}>
                <Time/>
                <Paragraph>
                    Мы&nbsp;приглашаем вас окунуться в&nbsp;атмосферу волшебства и&nbsp;почувствовать себя в&nbsp;роли
                    режиссера-постановщика знаменитого балета &laquo;Щелкунчик&raquo;.
                </Paragraph>
                <Paragraph last>
                    Моделируйте сценарий и&nbsp;стилистику представления, управляйте происходящим на&nbsp;сцене с&nbsp;помощью
                    онлайн-голосования во&nbsp;время прямой трансляции. Только вы&nbsp;решаете, что будет происходить
                    на&nbsp;сцене в&nbsp;следующий миг.
                </Paragraph>
                <Button sizable wide gold onClick={handleClick}>
                    Зарегистрироваться на&nbsp;мероприятие
                </Button>
            </div>
        </>
    )
}

export {MainPage};