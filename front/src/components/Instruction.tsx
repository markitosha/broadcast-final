import React, {useCallback, useState} from "react";
import styles from './Instruction.module.css';
import classNamesBind from "classnames/bind";
import {Popup} from "./Popup";
import {Paragraph} from "./Paragraph";
import {isMobile} from 'react-device-detect';
import {Button} from "./Button";

const cx = classNamesBind.bind(styles);

const Instruction: React.FC<any> = ({ onClose }) => {
    const [activeMenu, setActive] = useState(0);
    const handleOpenController = useCallback(() => {
        window.open('/controller/signin');
    }, []);
    const handleActiveFirst = useCallback(() => setActive(0), []);
    const handleActiveSecond = useCallback(() => setActive(1), []);

    return <Popup onCloseClick={onClose}>
        <div className={styles.Header}>Инструкция</div>
        <Paragraph>
            Для просмотра балета и&nbsp;участия в&nbsp;голосовании вам потребуется стабильное подключение
            к&nbsp;интернету и&nbsp;любое удобное для вас устройство: компьютер, ноутбук, телефон или SMART&nbsp;TV.
        </Paragraph>
        <Paragraph>
            Кнопки голосования появятся на&nbsp;экране вашего устройства, когда в&nbsp;прямой трансляции произойдет
            сюжетный поворот. Если вы&nbsp;смотрите балет в&nbsp;полноэкранном режиме, выйдите из&nbsp;него,
            чтобы проголосовать. У&nbsp;вас будет ровно 2&nbsp;минуты, чтобы сделать свой выбор и&nbsp;повлиять
            на&nbsp;развитие сюжета.
        </Paragraph>
        <Paragraph>
            Выберите один из&nbsp;возможных способов подключения к&nbsp;трансляции:
        </Paragraph>
        <div className={styles.HeaderContainer}>
            <div className={styles.Way}>Способ&nbsp;&#8470;&nbsp;1</div>
            <div className={styles.HeaderInner}>Просмотр через компьютер</div>
        </div>
        <div className={cx(styles.Container, styles.Horizontal)}>
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Laptop, styles.Icon)} />
                <div className={styles.Text}>Откройте трансляцию на&nbsp;вашем ноутбуке или компьютере</div>
                <div className={cx(styles.Next, styles.HideOnMobile)} />
            </div>
            <div className={cx(styles.Next, styles.HideOnDesktop)} />
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Play, styles.Icon)} />
                <div className={styles.Text}>Перейдите в&nbsp;полноэкранный режим для полноты ощущений</div>
                <div className={cx(styles.Next, styles.HideOnMobile)} />
            </div>
            <div className={cx(styles.Next, styles.HideOnDesktop)} />
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Tap, styles.Icon)} />
                <div className={styles.Text}>Не&nbsp;забудьте выйти из&nbsp;полноэкранного режима для того, чтобы проголосовать</div>
            </div>
        </div>
        <div className={styles.Line} />
        <div className={styles.HeaderContainer}>
            <div className={styles.Way}>Способ&nbsp;&#8470;&nbsp;2</div>
            <div className={styles.HeaderInner}>Просмотр через HDMI-подключение</div>
        </div>
        <div className={cx(styles.Container, styles.Horizontal)}>
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Laptop, styles.Icon)} />
                <div className={styles.Text}>Откройте трансляцию на&nbsp;вашем ноутбуке</div>
                <div className={cx(styles.Next, styles.HideOnMobile)} />
            </div>
            <div className={cx(styles.Next, styles.HideOnDesktop)} />
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Hdmi, styles.Icon)} />
                <div className={styles.Text}>Подключите к&nbsp;телевизору провод HDMI</div>
                <div className={cx(styles.Next, styles.HideOnMobile)} />
            </div>
            <div className={cx(styles.Next, styles.HideOnDesktop)} />
            <div className={styles.InnerContainer}>
                <div className={cx(styles.Play, styles.Icon)} />
                <div className={styles.Text}>Наслаждайтесь представлением на&nbsp;большом экране</div>
            </div>
        </div>
        <div className={styles.Line} />
        <div className={styles.HeaderContainer}>
            <div className={styles.Way}>Способ&nbsp;&#8470;&nbsp;3</div>
            <div className={styles.HeaderInner}>Просмотр на&nbsp;Smart TV&nbsp;через приложение Vimeo</div>
        </div>
        <div className={styles.Menu}>
            <div className={cx(styles.MenuItem, { ActiveItem: activeMenu === 0 })} onClick={handleActiveFirst}>Через браузер</div>
            <div className={cx(styles.MenuItem, { ActiveItem: activeMenu === 1 })} onClick={handleActiveSecond}>Через приложение Vimeo</div>
        </div>
        {activeMenu === 0 ? (
            <div className={cx(styles.Container, styles.Horizontal)}>
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.TV, styles.Icon)} />
                    <div className={styles.Text}>
                        Включите Smart TV&nbsp;и&nbsp;введите <span className={styles.YellowText}>vimeo.com</span> в&nbsp;поле
                        поиска браузера, зарегистрируйтесь
                    </div>
                    <div className={cx(styles.Next, styles.HideOnMobile)} />
                </div>
                <div className={cx(styles.Next, styles.HideOnDesktop)} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Search, styles.Icon)} />
                    <div className={styles.Text}>Найдите канал <span className={styles.YellowText}>BCSNutcracker</span> в&nbsp;поиске Vimeo</div>
                    <div className={cx(styles.Next, styles.HideOnMobile)} />
                </div>
                <div className={cx(styles.Next, styles.HideOnDesktop)} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Play, styles.Icon)} />
                    <div className={styles.Text}>
                        Подключитесь к&nbsp;прямой трансляции и&nbsp;наслаждайтесь
                        представлением на&nbsp;большом экране. Используйте телефон для голосования.
                    </div>
                </div>
            </div>) :
            <div className={cx(styles.Container, styles.Horizontal)}>
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.TV, styles.Icon)} />
                    <div className={styles.Text}>
                        Включите Smart TV, откройте приложение Vimeo или скачайте, если у&nbsp;вас его нет
                    </div>
                    <div className={cx(styles.Next, styles.HideOnMobile)} />
                </div>
                <div className={cx(styles.Next, styles.HideOnDesktop)} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Search, styles.Icon)} />
                    <div className={styles.Text}>Откройте приложение Vimeo и&nbsp;найдите канал <span className={styles.YellowText}>BCSNutcracker</span> в&nbsp;поиске</div>
                    <div className={cx(styles.Next, styles.HideOnMobile)} />
                </div>
                <div className={cx(styles.Next, styles.HideOnDesktop)} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Play, styles.Icon)} />
                    <div className={styles.Text}>
                        Подключитесь к&nbsp;прямой трансляции и&nbsp;наслаждайтесь представлением
                        на&nbsp;большом экране. Используйте телефон для голосования.
                    </div>
                </div>
            </div>
        }
        <div className={styles.HeaderContainer}>
            <div className={styles.Way}>Важно</div>
        </div>
        <Paragraph>
            Если у&nbsp;вас не&nbsp;получилось подключиться к&nbsp;трансляции через телевизор,
            пожалуйста, попробуйте подключиться к&nbsp;трансляции ноутбук, компьютер или телефон.
        </Paragraph>
        <div className={styles.HeaderContainer}>
            <div className={styles.HeaderInner}>Голосование</div>
        </div>
        <Paragraph>
            Если вы&nbsp;смотрите балет с&nbsp;большого экрана, вы&nbsp;можете воспользоваться своим телефоном,
            как пультом управления голосованием, отсканировав QR-код.
        </Paragraph>
        <div className={styles.LastContainer}>
            <div className={styles.Container}>
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Qr, styles.Icon)} />
                    <div className={styles.Text}>Отсканируйте QR-код с&nbsp;помощью камеры телефона</div>
                </div>
                <div className={styles.Next} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Phone, styles.Icon)} />
                    <div className={styles.Text}>Авторизируйтесь на&nbsp;сайте с&nbsp;помощью вашего номера телефона</div>
                </div>
                <div className={styles.Next} />
                <div className={styles.InnerContainer}>
                    <div className={cx(styles.Tap, styles.Icon)} />
                    <div className={styles.Text}>Голосуйте и&nbsp;влияйте на&nbsp;ход событий</div>
                </div>
            </div>
            {isMobile ?
                <div className={styles.Button}>
                    <Button blue onClick={handleOpenController}>
                        Активировать пульт управления трансляцией
                    </Button>
                </div> :
                <div className={styles.BigQR} />}
        </div>
    </Popup>;
}

export { Instruction };