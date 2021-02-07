import React, {useState} from 'react';
import styles from './MainPage.module.css';
import {Logo} from "../components/Logo";
import {Time} from "../components/Time";
import {Paragraph} from "../components/Paragraph";
import {Instruction} from "../components/Instruction";
// @ts-ignore
import video from '../img/intro.MP4';
// @ts-ignore
import video16 from '../img/intro16.mp4';
// @ts-ignore
import {getBasepath} from "hookrouter";
import Cookies from "js-cookie";

const StartLivePage: React.FC = () => {
    const [opened, setOpened] = useState(false);
    const handleOpened = () => setOpened(!opened);
    const partner = Cookies.get('partner') || getBasepath();
    const videoHref = partner.includes('sibir') ? video16 : video;

    return (
        <div className={styles.Block}>
            <div className={styles.Column}>
                <Logo />
                <div className={styles.Animate}>
                    <Time />
                    <Paragraph>
                        Погрузитесь в&nbsp;сказочную атмосферу классического балета &laquo;Щелкунчик&raquo;
                        в&nbsp;совершенно новом исполнении.
                    </Paragraph>
                    <Paragraph>
                        Всего несколько дней отделяют вас от&nbsp;истории, которая вызывает трепет с&nbsp;самого детства.
                        Прямо сейчас звезды балета оттачивают рисунок танца на&nbsp;репетициях, а&nbsp;костюмеры доводят
                        до&nbsp;идеала костюмы и&nbsp;припудривают пуанты, чтобы в&nbsp;назначенный день встретиться
                        с&nbsp;вами и&nbsp;поразить в&nbsp;самое сердце.
                    </Paragraph>
                    <Paragraph>
                        Пригласите своих друзей, отправив им&nbsp;приглашение со&nbsp;ссылкой на&nbsp;регистрацию
                        в&nbsp;мероприятии. Соберите близких за&nbsp;уютным праздничным столом.
                    </Paragraph>
                    <Paragraph>
                        Для просмотра трансляции и&nbsp;участия в&nbsp;голосовании мы&nbsp;рекомендуем заранее
                        ознакомиться с&nbsp;<span className={styles.Link} onClick={handleOpened}>инструкцией</span>.
                    </Paragraph>
                </div>
            </div>
            <div className={styles.ColumnSecond}>
                <div className={styles.StartPage}>
                    <video width={"100%"} autoPlay loop muted className={styles.Video}>
                        <source src={videoHref} type="video/mp4" />
                        Sorry, your browser doesn't support embedded videos.
                    </video>
                </div>
            </div>
            { opened && <Instruction onClose={handleOpened} /> }
        </div>
    );
}

export { StartLivePage };