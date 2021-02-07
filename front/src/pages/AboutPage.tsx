import React, {useState} from 'react';
import styles from "./AboutPage.module.css";
import {Logo} from "../components/Logo";
import {Paragraph} from "../components/Paragraph";
import classNamesBind from "classnames/bind";
import {Instruction} from "../components/Instruction";
const cx = classNamesBind.bind(styles);

const AboutPage: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const handleClick = () => setOpened(!opened);

    return (
        <div className={styles.Container}>
            <Logo small />
            <Paragraph>
                Щелкунчик Reboot&nbsp;&mdash; это новое прочтение старых традиций в&nbsp;форме
                иммерсивного балета, где цифровое искусство и&nbsp;классика объединились в&nbsp;непредсказуемое
                представление.
            </Paragraph>
            <div className={styles.RelativeContainer}>
                <div className={styles.Quote}>
                    <div className={styles.Dots} />
                    <div className={styles.Line} />
                    <p className={styles.Text}>
                        Самая известная новогодняя история&nbsp;&mdash; &laquo;Щелкунчик и&nbsp;мышиный король&raquo; вышла
                        в&nbsp;свет в&nbsp;декабре 1816 года. За&nbsp;два столетия легендарное произведение Эрнста Теодора Амадея
                        Гофмана превратилось в&nbsp;кино, мультфильм, балет и&nbsp;даже оперу.
                    </p>
                    <div className={styles.Line} />
                    <div className={cx(styles.Dots, styles.Revert)} />
                </div>
            </div>
            <Paragraph>
                Уникальная авторская постановка, которая не&nbsp;имеет аналогов, создана Владимиром Варнавой&nbsp;&mdash;
                хореографом Мариинского театра и&nbsp;обладателем национальной театральной премии &laquo;Золотая маска&raquo;&nbsp;&mdash;
                специально для клиентов БКС.
            </Paragraph>
            <div className={styles.RelativeContainer}>
                <div className={cx(styles.Quote, styles.LeftQuote)}>
                    <div className={styles.Dots} />
                    <div className={styles.Line} />
                    <p className={styles.Text}>
                        Каждый человек выбирает для себя сам: отправляться на&nbsp;поиски нового или бережно
                        и&nbsp;внимательно сохранять традиции. Мне интересно поле эксперимента. Но&nbsp;считаю важным
                        сохранить наследие и&nbsp;благодарю людей, занимающихся этим. Нигде в&nbsp;мире не&nbsp;танцуют
                        классический балет так, как танцуют его у&nbsp;нас&nbsp;&mdash; в&nbsp;России. Я&nbsp;горжусь
                        и&nbsp;очарован русской школой классического балета и&nbsp;уверен, она будет обогащаться
                        с&nbsp;приходом новаторских идей в&nbsp;искусстве.
                    </p>
                    <p className={cx(styles.Text, styles.TextRight)}>
                        <i>Владимир Варнава</i>
                    </p>
                    <div className={styles.Line} />
                    <div className={cx(styles.Dots, styles.Revert)} />
                </div>
            </div>
            <div className={styles.RelativeContainer}>
                <div className={styles.Sh} />
                <div className={styles.ShText}>
                    <Paragraph>
                        Во&nbsp;время прямой трансляции балета два режиссера будут сражаться за&nbsp;сохранение традиционной классики
                        и&nbsp;внедрение новаторского подхода. Однако возможность решить, что произойдет на&nbsp;сцене, будет
                        предоставлена только зрителю.
                    </Paragraph>
                    <Paragraph>
                        Моделируйте сценарий постановки и&nbsp;стилистику представления с&nbsp;помощью онлайн-голосования,
                        и, возможно, именно ваш голос будет решающим.
                    </Paragraph>
                    <Paragraph>
                        Компания БКС подготовила для вас этот незабываемый вечер, который перенесет вас в&nbsp;мир волшебства:
                        подарок, который продлит послевкусие новогодних каникул и&nbsp;вновь объединит вас в&nbsp;кругу
                        семьи и&nbsp;теплой компании.
                    </Paragraph>
                    <Paragraph>
                        Пожалуйста, ознакомьтесь с&nbsp;подробной инструкцией о&nbsp;том, как подключиться к&nbsp;трансляции
                        и&nbsp;принять участие в&nbsp;голосовании в&nbsp;разделе&nbsp;
                        <span className={styles.Link} onClick={handleClick}>&laquo;Инструкция&raquo;</span>.
                    </Paragraph>
                    <Paragraph>
                        Приятного просмотра!
                    </Paragraph>
                </div>
            </div>
            {opened && <Instruction onClose={handleClick} />}
        </div>
    );
}

export {AboutPage};