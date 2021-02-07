import React, {useState} from "react";
import styles from "./Input.module.css";
import classNamesBind from "classnames/bind";

const cx = classNamesBind.bind(styles);

const Input: React.FC<any> = ({name, placeholder, register, errors, onChange, value, onFocus, notRequired }) => {
    if (!register) {
        return (
            <input
                name={name}
                placeholder={placeholder}
                className={cx(styles.Input, {
                    Error: errors && errors[name]
                })}
                onChange={onChange}
                value={value}
                onFocus={onFocus}
            />
        );
    }

    if (notRequired) {
        return (
            <input
                name={name}
                placeholder={placeholder}
                className={cx(styles.Input, {
                    Error: errors && errors[name]
                })}
                ref={register()}
            />
        );
    }

    return (
        <input
            name={name}
            placeholder={placeholder}
            className={cx(styles.Input, {
                Error: errors && errors[name]
            })}
            ref={register({required: true})}
        />
    );
}

const SelectSearch: React.FC<any> = ({name, placeholder, register, errors, onChange, value, onFocus, options }) => {
    const [opened, setOpened] = useState(false);
    const handleSelect = (val: any) => (e: any) => {
        onChange({ target: { value: val }});
        setOpened(false);
    };
    const handleFocus = (...data: any) => {
        setOpened(true);
        onFocus && onFocus(...data);
    };
    const handleBlur = () => setTimeout(() => setOpened(false), 300);

    if (!register) {
        return (
            <div className={styles.DropdownContainer}>
                <input
                    name={name}
                    placeholder={placeholder}
                    className={cx(styles.Input, {
                        Error: errors && errors[name]
                    })}
                    onChange={onChange}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {opened && <div className={styles.Dropdown}>
                    {options.map((val: any) => {
                        return val.toLowerCase().includes(value.toLowerCase()) &&
                        <div className={styles.DropdownItem} key={val} onClick={handleSelect(val)}>{val}</div>
                    })}
                </div>}
            </div>
        );
    }

    return (
        <input
            name={name}
            placeholder={placeholder}
            className={cx(styles.Input, {
                Error: errors && errors[name]
            })}
            ref={register({required: true})}
        />
    );
}

export { Input, SelectSearch };