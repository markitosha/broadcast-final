import React, {useContext} from 'react';
import {Card} from "../components/Card";
import styles from "./RegisterPage.module.css";
import {Controller, useForm} from "react-hook-form";
import {Button} from "../components/Button";
import {Input} from "../components/Input";
import {LoginContext} from "../state/loginContext";

const formatPhone = (value: string | number) => {
    const str = value.toString().replace(/[^\d]/g, '');
    let newStr = '';

    for (let i = 0; i < str.length; ++i) {
        if (!Number.isInteger(Number(str[i]))) {
            continue;
        }

        if (i === 0) {
            if (str[i] === '8' || str[i] === '7') {
                newStr += '+7 (';
            } else {
                newStr += `+7 (${str[i]}`;
            }

            continue;
        }

        if (newStr.length === 7) {
            newStr += ') ';
        }

        if (newStr.length === 12) {
            newStr += ' ';
        }

        if (newStr.length === 15) {
            newStr += ' ';
        }

        if (newStr.length === 18) {
            return newStr;
        }

        newStr += str[i];
    }

    return newStr;
};

const AuthPage: React.FC = () => {
    const {handleSubmit, errors, control} = useForm();
    const { login, serverErrors } = useContext(LoginContext);
    const onSubmit = (data: any) => {
        data.phone = data.phone?.replace(/[\s()]/g, '');
        login(data);
    };
    const commonErrors = Object.assign({}, errors, serverErrors);

    return (
        <div className={styles.Centered}>
            <Card>
                <div className={styles.Text}>
                    Войдите, чтобы принять участие в&nbsp;мероприятии
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.Row}>
                        <Controller
                            control={control}
                            name="phone"
                            rules={{required:true}}
                            render={({ onChange, value = '' }) => <Input
                                name="phone"
                                placeholder="Телефон"
                                errors={commonErrors}
                                type={"tel"}
                                onChange={(e: any) => {
                                    let val = formatPhone(e.target.value);

                                    onChange(val);
                                }}
                                onFocus={() => {
                                    if (!value) {
                                        onChange('+7 (')
                                    }
                                }}
                                value={value}
                            />}
                        />
                    </div>
                    <Button wide blue type={"submit"}>
                        Войти
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export {AuthPage, formatPhone};