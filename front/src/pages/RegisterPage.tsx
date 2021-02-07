import React, {useContext, useState} from 'react';
import {Card} from "../components/Card";
import styles from "./RegisterPage.module.css";
import {Controller, useForm} from "react-hook-form";
import {Button} from "../components/Button";
import classNamesBind from "classnames/bind";
import {Input, SelectSearch} from "../components/Input";
import {LoginContext} from "../state/loginContext";
import {Policy} from "../components/Policy";
// @ts-ignore
import {getBasepath} from "hookrouter";
import {cities} from "../constants";
import {formatPhone} from "./AuthPage";
import Cookies from "js-cookie";

const cx = classNamesBind.bind(styles);

const RegisterPage: React.FC = () => {
    const [policy, setPolicy] = useState(false);
    const {register, handleSubmit, errors, control} = useForm();
    const { signup, serverErrors } = useContext(LoginContext);
    const onSubmit = (data: any) => {
        data.phone = data.phone?.replace(/[\s()]/g, '');
        signup(data);
    };
    const commonErrors = Object.assign({}, errors, serverErrors);
    const handleOpen = () => {
        setPolicy(!policy);
    };

    return (
        <Card>
            <div className={styles.Text}>
                Зарегистрируйтесь, чтобы принять участие в&nbsp;мероприятии
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.Row}>
                    <Input
                        name="first_name"
                        placeholder="Имя"
                        register={register}
                        errors={commonErrors}
                    />
                    <Input
                        name="last_name"
                        placeholder="Фамилия"
                        register={register}
                        errors={commonErrors}
                    />
                    <Input
                        name="middle_name"
                        placeholder="Отчество"
                        register={register}
                        errors={commonErrors}
                        notRequired
                    />
                </div>
                <div className={styles.Row}>
                    <Controller
                        name={"city"}
                        rules={{required:true}}
                        control={control}
                        render={({ onChange, value = ''}) => (
                            <SelectSearch
                                name="city"
                                placeholder="Город"
                                errors={commonErrors}
                                onChange={(e: any) => onChange(e.target.value)}
                                value={value}
                                options={cities}
                            />
                        )}
                    />
                    <Input name="email" placeholder="Email" register={register} errors={commonErrors}/>
                </div>
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
                    <div className={styles.AddText}>
                        Для участия в&nbsp;мероприятии укажите корректный номер телефона
                    </div>
                </div>
                <div className={styles.Row}>
                    <label className={styles.Label}>
                        <input name="accept" id="accept" type="checkbox" ref={register({required: true})} className={cx(styles.Checkbox, {
                            Error: errors.accept
                        })}/>
                        <span className={cx({
                            ErrorLabel: errors.accept
                        })}>
                            Я&nbsp;принимаю&nbsp;
                            <span className={cx(styles.Link, {
                                ErrorLabel: errors.accept
                            })} onClick={handleOpen}>
                                соглашение на&nbsp;обработку персональных данных
                            </span>.
                        </span>
                    </label>
                </div>
                <input name="partner" defaultValue={Cookies.get('partner') || getBasepath()} ref={register({required: true})} hidden />
                <Button wide blue type={"submit"}>
                    Зарегистрироваться
                </Button>
            </form>
            {policy && <Policy onClose={handleOpen} />}
        </Card>
    );
}

export {RegisterPage};