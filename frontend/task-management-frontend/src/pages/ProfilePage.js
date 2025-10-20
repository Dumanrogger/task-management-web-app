import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [userStats, setUserStats] = useState({
        totalTasks: 0,
        highPriorityTasks: 0,
        completedTasks: 0,
        assignedTasks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError('');

                // Получаем данные пользователя из localStorage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                setUser(userData);

                // Получаем статистику задач
                const tasksResponse = await api.get('/api/tasks');
                const tasks = tasksResponse.data;

                const stats = {
                    totalTasks: tasks.length,
                    highPriorityTasks: tasks.filter(task => task.priorityLevel === 'HIGH').length,
                    assignedTasks: tasks.filter(task => task.assignedUsername === userData.username).length,
                    completedTasks: tasks.filter(task => task.status === 'COMPLETED').length || 0
                };

                setUserStats(stats);

            } catch (error) {
                console.error('Ошибка при загрузке данных профиля:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Ошибка при загрузке данных профиля');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка профиля...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Заголовок страницы */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>Профиль пользователя</h1>
                        <p className={styles.subtitle}>
                            Управление профилем и просмотр статистики
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={styles.backButton}
                            title="Вернуться к задачам"
                        >
                            ← Назад к задачам
                        </button>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className={styles.retryButton}>
                            Попробовать еще раз
                        </button>
                    </div>
                )}

                <div className={styles.profileGrid}>
                    {/* Информация о пользователе */}
                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>
                                <span className={styles.avatarText}>
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <div className={styles.userInfo}>
                                <h2 className={styles.userName}>{user.username || 'Пользователь'}</h2>
                                <p className={styles.userEmail}>{user.email || 'email@example.com'}</p>
                                <div className={styles.userBadge}>
                                    <span className={styles.statusIndicator}></span>
                                    Активен
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileActions}>
                            <button className={styles.editButton}>
                                ✏️ Редактировать профиль
                            </button>
                            <button className={styles.settingsButton}>
                                ⚙️ Настройки
                            </button>
                        </div>
                    </div>

                    {/* Статистика пользователя */}
                    <div className={styles.statsCard}>
                        <h3 className={styles.statsTitle}>Статистика задач</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>📊</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>{userStats.totalTasks}</span>
                                    <span className={styles.statLabel}>Всего задач</span>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>🔥</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>{userStats.highPriorityTasks}</span>
                                    <span className={styles.statLabel}>Высокий приоритет</span>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>👤</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>{userStats.assignedTasks}</span>
                                    <span className={styles.statLabel}>Назначено мне</span>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>✅</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>{userStats.completedTasks}</span>
                                    <span className={styles.statLabel}>Завершено</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Последняя активность */}
                    <div className={styles.activityCard}>
                        <h3 className={styles.activityTitle}>Последняя активность</h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>🆕</div>
                                <div className={styles.activityContent}>
                                    <p className={styles.activityDescription}>Вход в систему</p>
                                    <span className={styles.activityTime}>Сегодня</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>📝</div>
                                <div className={styles.activityContent}>
                                    <p className={styles.activityDescription}>Просмотр задач</p>
                                    <span className={styles.activityTime}>Сегодня</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>🔄</div>
                                <div className={styles.activityContent}>
                                    <p className={styles.activityDescription}>Обновление списка задач</p>
                                    <span className={styles.activityTime}>Сегодня</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Настройки уведомлений */}
                    <div className={styles.settingsCard}>
                        <h3 className={styles.settingsTitle}>Настройки</h3>
                        <div className={styles.settingsList}>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>Email уведомления</span>
                                    <span className={styles.settingDescription}>Получать уведомления о новых задачах</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>Push уведомления</span>
                                    <span className={styles.settingDescription}>Мгновенные уведомления в браузере</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>Темная тема</span>
                                    <span className={styles.settingDescription}>Переключить на темную тему</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;