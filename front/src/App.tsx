import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Layout } from "./components/Layout";
import { BeforeTranslation } from './pages/BeforeTranslation';
// @ts-ignore
import {getBasepath, navigate, usePath, useRoutes} from "hookrouter";
import {Header} from "./components/Header";
import {AboutPage} from "./pages/AboutPage";
import {StartLivePage} from "./pages/StartLivePage";
import { LoginContext } from './state/loginContext';
import {Path} from "./constants";
import Cookies from 'js-cookie';
import {LivePage} from "./pages/LivePage";
import {NotFound} from "./pages/NotFound";
import styles from './App.module.css';
import classNamesBind from "classnames/bind";

const cx = classNamesBind.bind(styles);

const Error: React.FC<any> = ({ errors }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);

        const timer = setTimeout(() => {
            setShow(false)
        }, 7000);

        return () => clearTimeout(timer);
    }, [errors]);

    if (Object.keys(errors).length === 0) {
        return <div className={cx(styles.Error, { Hide: true })} />;
    }

    if (errors.server) {
        return <div className={cx(styles.Error, { Hide: !show })}>
            Что-то пошло не&nbsp;так, повторите попытку позднее.
        </div>
    }

    //@ts-ignore
    if (Object.keys(errors).length > 1) {
        return <div className={cx(styles.Error, { Hide: !show })}>
            Проверьте правильность заполнения всех полей
        </div>;
    }

    const value: any = Object.values(errors)[0];
    const message = Array.isArray(value) ? value[0] : value;
    const translated = /[A-Za-z]/.test(message) ? 'Проверьте правильность заполнения всех полей' : message;

    return <div className={cx(styles.Error, { Hide: !show })}>
        {translated}
    </div>;
};

const Start = () => {
    const { logged } = useContext(LoginContext);

    return logged ? <LivePage /> : <BeforeTranslation />;
}

const routes = {
    [Path.about]: () => <AboutPage />,
    [Path.live]: () => <StartLivePage />,
    [Path.main]: () => <Start />,
    [Path.signin]: () => <Start />,
    [Path.signup]: () => <Start />
};

function App() {
    const route = useRoutes(routes);
    const [logged, setLogged] = useState(false);
    const [serverErrors, setErrors] = useState({});
    const path = usePath();

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            setLogged(true);
        }
    }, []);

    const signup = useCallback(async (params) => {
        try {
            const formData = new FormData();

            for (let key in params) {
                formData.append(key, params[key]);
            }

            const response = await fetch(`${process.env.REACT_APP_API}/signup/`, {
                method: 'POST',
                body: formData
            } as any);
            const res = await response.json();

            if (response.ok) {
                Cookies.set('token', res.token);
                navigate(Path.main);
                setLogged(true);
                return ;
            }

            setErrors(res);
        } catch (e) {
            setErrors({ server: 500 });
        }
    }, []);

    const login = useCallback(async (params) => {
        try {
            const formData = new FormData();

            for (let key in params) {
                formData.append(key, params[key]);
            }

            const response = await fetch(`${process.env.REACT_APP_API}/login/`, {
                method: 'POST',
                body: formData
            } as any);
            const res = await response.json();

            if (response.ok) {
                Cookies.set('token', res.token);
                Cookies.set('partner', res.partner);
                navigate(Path.main);
                setLogged(true);
                return ;
            }

            setErrors(res);
        } catch (e) {
            setErrors({ server: 500 });
        }
    }, []);

    const logout = useCallback(() => {
        Cookies.remove('token');
        Cookies.remove('partner');
        Cookies.set('partner', getBasepath());
        setLogged(false);
    }, []);

    const notFound = !route || (getBasepath().includes('notfound') && path !== Path.about);

    return (
        <LoginContext.Provider value={{ logged, login, logout, signup, serverErrors }}>
            <Layout notFound={notFound}>
                <Header notFound={notFound} />
                {notFound ? <NotFound /> : route}
                <Error errors={serverErrors} />
            </Layout>
        </LoginContext.Provider>
  );
}

export default App;
