import React from 'react';
// @ts-ignore
import {useRoutes} from "hookrouter";
import styles from './MainPage.module.css';
import {MainPage} from "./MainPage";
import {RegisterPage} from "./RegisterPage";
import {AuthPage} from "./AuthPage";
import {Path} from "../constants";

const routes = {
    [Path.main]: () => <MainPage />,
    [Path.signup]: () => <RegisterPage />,
    [Path.signin]: () => <AuthPage />,
};

const BeforeTranslation: React.FC = () => {
    const Route = useRoutes(routes);

    return (
        <>
            <div className={styles.Column}>
                {Route}
            </div>
        </>
    );
}

export { BeforeTranslation };