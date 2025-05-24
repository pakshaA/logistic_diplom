'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/templates";
import { Input, notification } from "antd";
import { Check, CircleX, X } from "lucide-react";
import { register } from "@/helpers/api/register/register";
import { login } from "@/helpers/api/login/login";
import { checkAuth } from "@/helpers/api/checkAuth/checkAuth";
import { logout } from "@/helpers/api/logout/logout";

export const MainLoginButton = () => {
    const [api, contextHolder] = notification.useNotification();
    const [modalMode, setModalMode] = useState<'login' | 'register' | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(null);

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        checkAuth().then(() => setIsAuth(true));
    }, []);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        setEmailError(null);
        setPasswordError(null);
        setRepeatPasswordError(null);
    };

    const validate = (): boolean => {
        setEmailError(null);
        setPasswordError(null);
        setRepeatPasswordError(null);

        let isValid = true;
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailError("Поле email не может быть пустым");
            isValid = false;
        } else if (trimmedEmail.length > 254) {
            setEmailError("Email не может быть длиннее 254 символов");
            isValid = false;
        } else {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
            if (!emailRegex.test(trimmedEmail)) {
                setEmailError("Введите корректный email");
                isValid = false;
            }
        }

        if (!password) {
            setPasswordError("Поле пароль не может быть пустым");
            isValid = false;
        } else {
            if (password.length < 8) {
                setPasswordError("Пароль должен быть не короче 8 символов");
                isValid = false;
            } else if (password.length > 64) {
                setPasswordError("Пароль должен быть не длиннее 64 символов");
                isValid = false;
            } else {
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumbers = /\d/.test(password);
                const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
                if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecial)) {
                    setPasswordError("Пароль должен содержать заглавные, строчные буквы, цифры и спецсимволы");
                    isValid = false;
                }
            }
        }

        if (modalMode === 'register') {
            if (!passwordRepeat) {
                setRepeatPasswordError("Повторите пароль");
                isValid = false;
            } else if (password !== passwordRepeat) {
                setRepeatPasswordError("Пароли не совпадают");
                isValid = false;
            }
        }

        return isValid;
    };

    const openNotificationWithIcon = ({ type, message, description }: { type: 'success' | 'error', message: string, description: string }) => {
        api.open({
            message,
            description,
            icon: type === 'success' ? <Check color="green" /> : <CircleX color="red" />
        });
    };

    const handleRegister = async () => {
        if (!validate()) return;
        let data;
        try {
            const newUser = {
                id: crypto.randomUUID(),
                email: email?.trim(),
                password: password
            };
    
            const response = await register(newUser);
            data = response.data;
    
            console.log("Новый пользователь:", data);
            if (response.status === 200) {
                setModalMode('login');
                openNotificationWithIcon({ type: 'success', message: "Успешно", description: "Вы зарегистрированы" });
            }
        } catch (error: unknown) {
            const err = error as { status?: number, message?: string };
            if (err.status === 409) {
                setEmailError("Пользователь с таким email уже существует");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: "Пользователь с таким email уже существует" });
            } else if (err.status === 500) {
                setPasswordError("Ошибка сервера");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: "Ошибка сервера" });
            } else {
                setPasswordError("Произошла ошибка");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: err.message || "Произошла ошибка" });
            }
        }
    
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
    };

    const handleLogin = async () => {
        if (!validate()) return;
        try {
            const response = await login({ email: email?.trim(), password });
            if (response.status === 200) {
                openNotificationWithIcon({ type: 'success', message: "Вход", description: "Вы успешно вошли" });
                setModalMode(null);
                resetForm();
            }
        } catch (error: unknown) {
            const err = error as { status?: number, message?: string };
            if (err.status === 401) {
                setPasswordError("Неверный email или пароль");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: "Неверный email или пароль" });
            } else if (err.status === 500) {
                setPasswordError("Ошибка сервера");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: "Ошибка сервера" });
            } else {
                setPasswordError("Произошла ошибка");
                openNotificationWithIcon({ type: 'error', message: "Ошибка", description: err.message || "Произошла ошибка" });
            }
        }
    };

    const handleLogout = () => {
        logout().then(() => {
            setIsAuth(false);
            openNotificationWithIcon({ type: 'success', message: "Выход", description: "Вы успешно вышли" });
        }).catch((error: unknown) => {
            const err = error as { message?: string };
            openNotificationWithIcon({ type: 'error', message: "Ошибка", description: err.message || "Произошла ошибка" });
        });
    }

    useEffect(() => {
        if (email) setEmailError(null);
        if (password) setPasswordError(null);
        if (passwordRepeat) setRepeatPasswordError(null);
    }, [email, password, passwordRepeat]);

    const renderModal = () => {
        const isRegister = modalMode === 'register';
        return (
            <div onClick={() => { setModalMode(null); resetForm(); }} className="z-[1000] absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
                <div className="w-[300px] bg-white rounded-[10px] flex flex-col p-5 shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                    <X className="absolute top-4 right-4 cursor-pointer" onClick={() => { setModalMode(null); resetForm(); }} />
                    <h2 className="text-2xl font-bold text-center mb-5">{isRegister ? "Регистрация" : "Войти"}</h2>
                    <div className="flex flex-col gap-5 mb-5">
                        <div>
                            <p>Email</p>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                status={emailError ? "error" : ""}
                            />
                            {emailError && <p className="text-red-500">{emailError}</p>}
                        </div>
                        <div>
                            <p>Пароль</p>
                            <Input.Password
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                status={passwordError ? "error" : ""}
                            />
                            {passwordError && <p className="text-red-500">{passwordError}</p>}
                        </div>
                        {isRegister && (
                            <div>
                                <p>Повторите пароль</p>
                                <Input.Password
                                    placeholder="Пароль ещё раз"
                                    value={passwordRepeat}
                                    onChange={(e) => setPasswordRepeat(e.target.value)}
                                    status={repeatPasswordError ? "error" : ""}
                                />
                                {repeatPasswordError && <p className="text-red-500">{repeatPasswordError}</p>}
                            </div>
                        )}
                    </div>
                    <Button
                        text={isRegister ? "Зарегистрироваться" : "Войти"}
                        onClick={isRegister ? handleRegister : handleLogin}
                        type="colored"
                        className="text-center"
                    />
                    <p className="text-center mt-5">
                        {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
                        <span
                            onClick={() => {
                                setModalMode(isRegister ? 'login' : 'register');
                                resetForm();
                            }}
                            className="text-[#00B793] cursor-pointer"
                        >
                            {isRegister ? "Войти" : "Зарегистрироваться"}
                        </span>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            {contextHolder}
            {isAuth ? (
                <Button text="Выйти" onClick={() => handleLogout()} type="colored" />
            ) : (
                <Button text="Войти" onClick={() => setModalMode('login')} type="colored" />
            )}
            {modalMode && renderModal()}
        </>
    );
};
