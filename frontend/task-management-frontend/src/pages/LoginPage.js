import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isRegisterMode
                ? 'http://localhost:8080/api/auth/register'
                : 'http://localhost:8080/api/auth/login';

            const payload = isRegisterMode
                ? { username: formData.username, email: formData.email, password: formData.password }
                : { username: formData.username, password: formData.password };

            const response = await axios.post(url, payload);

            // Сохраняем JWT-токен в localStorage
            localStorage.setItem('token', response.data.token);

            // Сохраняем информацию о пользователе
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                userId: response.data.userId
            }));

            // Перенаправляем на dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error('Auth error:', error);
            setError(
                isRegisterMode
                    ? 'Ошибка регистрации. Возможно, пользователь уже существует.'
                    : 'Неверное имя пользователя или пароль'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setError('');
        setFormData({ username: '', email: '', password: '' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <h2 className={styles.title}>
                    {isRegisterMode ? 'Регистрация в Task Manager' : 'Вход в Task Manager'}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Имя пользователя:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                            placeholder="Введите имя пользователя"
                        />
                    </div>

                    {isRegisterMode && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={styles.input}
                                required
                                placeholder="Введите email"
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Пароль:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                            placeholder="Введите пароль"
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading
                            ? (isRegisterMode ? 'Регистрируемся...' : 'Входим...')
                            : (isRegisterMode ? 'Зарегистрироваться' : 'Войти')
                        }
                    </button>
                </form>

                <div className={styles.toggleMode}>
                    <p>
                        {isRegisterMode ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
                        <button onClick={toggleMode} className={styles.toggleButton}>
                            {isRegisterMode ? 'Войти' : 'Зарегистрироваться'}
                        </button>
                    </p>
                </div>

                {!isRegisterMode && (
                    <div className={styles.testCredentials}>
                        <p>Тестовые данные для входа:</p>
                        <p><strong>Пользователь:</strong> john_doe</p>
                        <p><strong>Пароль:</strong> password123</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;