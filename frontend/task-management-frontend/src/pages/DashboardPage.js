import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskCreateModal from '../components/TaskCreateModal';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

    // Получение данных пользователя из localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Загрузка задач и пользователей при первом рендере компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const [tasksResponse, usersResponse] = await Promise.all([
                    api.get('/api/tasks'),
                    api.get('/api/users').catch(() => ({ data: [] })) // Если эндпоинт недоступен
                ]);

                setTasks(tasksResponse.data);
                setUsers(usersResponse.data);

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);

                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Ошибка при загрузке данных. Попробуйте обновить страницу.');
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Функция создания задачи
    const handleCreateTask = async (taskData) => {
        try {
            const response = await api.post('/api/tasks', taskData);
            setTasks(prevTasks => [...prevTasks, response.data]);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            throw error;
        }
    };

    // Функция автоназначения задачи
    const handleAutoAssignTask = async (taskId) => {
        try {
            const response = await api.post(`/api/tasks/${taskId}/assign`);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? response.data : task
                )
            );
            console.log(`Задача с ID ${taskId} автоматически назначена пользователю ${response.data.assignedUsername}`);
        } catch (error) {
            console.error('Ошибка при автоназначении задачи:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Ошибка при автоназначении задачи. Нет доступных пользователей.');
            }
        }
    };

    // Функция массового автоназначения задач
    const handleBulkAutoAssign = async () => {
        const unassignedTasks = tasks.filter(task => !task.assignedUsername);

        if (unassignedTasks.length === 0) {
            setError('Нет неназначенных задач для автоназначения');
            return;
        }

        if (!window.confirm(`Автоматически назначить ${unassignedTasks.length} неназначенных задач?`)) {
            return;
        }

        try {
            const assignPromises = unassignedTasks.map(task =>
                api.post(`/api/tasks/${task.id}/assign`)
            );

            const responses = await Promise.allSettled(assignPromises);

            let successCount = 0;
            const updatedTasks = [...tasks];

            responses.forEach((response, index) => {
                if (response.status === 'fulfilled') {
                    const taskIndex = updatedTasks.findIndex(
                        task => task.id === unassignedTasks[index].id
                    );
                    if (taskIndex !== -1) {
                        updatedTasks[taskIndex] = response.value.data;
                        successCount++;
                    }
                }
            });

            setTasks(updatedTasks);

            if (successCount === unassignedTasks.length) {
                console.log(`Успешно назначено ${successCount} задач`);
            } else {
                setError(`Назначено ${successCount} из ${unassignedTasks.length} задач. Возможно, недостаточно доступных пользователей.`);
            }
        } catch (error) {
            console.error('Ошибка при массовом автоназначении:', error);
            setError('Ошибка при массовом автоназначении задач');
        }
    };

    // Функция удаления задачи
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            return;
        }

        try {
            await api.delete(`/api/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            console.log(`Задача с ID ${taskId} удалена`);
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
            setError('Ошибка при удалении задачи. Попробуйте еще раз.');
        }
    };

    // Функция выхода из системы
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Функция для обновления списка задач
    const refreshTasks = async () => {
        try {
            setError('');
            const response = await api.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Ошибка при обновлении задач:', error);
            setError('Ошибка при обновлении задач.');
        }
    };

    // Drag and Drop функции
    const handleDragStart = (taskId) => {
        setDraggedTaskId(taskId);
    };

    const handleDragEnd = () => {
        setDraggedTaskId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();

        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        const draggedIndex = tasks.findIndex(task => task.id === draggedId);

        if (draggedIndex === -1 || draggedIndex === targetIndex) {
            return;
        }

        const newTasks = [...tasks];
        const draggedTask = newTasks.splice(draggedIndex, 1)[0];
        newTasks.splice(targetIndex, 0, draggedTask);

        setTasks(newTasks);
    };

    // Функции для перемещения задач кнопками (fallback)
    const moveTaskUp = (index) => {
        if (index > 0) {
            const newTasks = [...tasks];
            [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
            setTasks(newTasks);
        }
    };

    const moveTaskDown = (index) => {
        if (index < tasks.length - 1) {
            const newTasks = [...tasks];
            [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
            setTasks(newTasks);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка данных...</p>
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
                        <h1 className={styles.title}>Панель управления задачами</h1>
                        <p className={styles.subtitle}>
                            Добро пожаловать, {user.username || 'Пользователь'}! Перетаскивайте задачи для изменения порядка.
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            onClick={() => navigate('/profile')}
                            className={styles.profileButton}
                            title="Профиль пользователя"
                        >
                            👤 Профиль
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className={styles.createButton}
                            title="Создать новую задачу"
                        >
                            ➕ Создать задачу
                        </button>
                        <button
                            onClick={refreshTasks}
                            className={styles.refreshButton}
                            title="Обновить список задач"
                        >
                            🔄 Обновить
                        </button>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Выйти
                        </button>
                        <button
                            onClick={handleBulkAutoAssign}
                            className={styles.bulkAssignButton}
                            title="Автоназначить все неназначенные задачи"
                            disabled={tasks.filter(task => !task.assignedUsername).length === 0}
                        >
                            🎯 Автоназначить все
                        </button>
                    </div>
                </div>
            </header>

            {/* Основной контент */}
            <main className={styles.main}>
                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={refreshTasks} className={styles.retryButton}>
                            Попробовать еще раз
                        </button>
                    </div>
                )}

                {/* Статистика */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <h3>Всего задач</h3>
                        <p className={styles.statNumber}>{tasks.length}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Высокий приоритет</h3>
                        <p className={styles.statNumber}>
                            {tasks.filter(task => task.priorityLevel === 'HIGH').length}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Назначенные мне</h3>
                        <p className={styles.statNumber}>
                            {tasks.filter(task => task.assignedUsername === user.username).length}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Неназначенные</h3>
                        <p className={styles.statNumber}>
                            {tasks.filter(task => !task.assignedUsername).length}
                        </p>
                    </div>
                </div>

                {/* Список задач с drag-and-drop */}
                <section className={styles.tasksSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Все задачи</h2>
                        <p className={styles.dragHint}>
                            💡 Подсказка: Перетаскивайте задачи за ручку для изменения порядка
                        </p>
                    </div>

                    {tasks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📝</div>
                            <h3>Задач пока нет</h3>
                            <p>Список задач пуст. Создайте первую задачу!</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className={styles.createFirstTaskButton}
                            >
                                Создать первую задачу
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tasksList}>
                            {tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={styles.taskItem}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <div className={styles.taskWrapper}>
                                        <TaskCard
                                            task={task}
                                            isDragging={draggedTaskId === task.id}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                        />
                                    </div>

                                    {/* Кнопки управления задачей */}
                                    <div className={styles.taskControls}>
                                        <div className={styles.moveControls}>
                                            <button
                                                onClick={() => moveTaskUp(index)}
                                                disabled={index === 0}
                                                className={styles.moveButton}
                                                title="Переместить вверх"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveTaskDown(index)}
                                                disabled={index === tasks.length - 1}
                                                className={styles.moveButton}
                                                title="Переместить вниз"
                                            >
                                                ↓
                                            </button>
                                        </div>

                                        {/* Кнопка автоназначения (только для неназначенных задач) */}
                                        {!task.assignedUsername && (
                                            <button
                                                onClick={() => handleAutoAssignTask(task.id)}
                                                className={styles.assignButton}
                                                title="Автоматически назначить доступному пользователю"
                                            >
                                                👤
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className={styles.deleteButton}
                                            title="Удалить задачу"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Модальное окно создания задачи */}
            <TaskCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateTask={handleCreateTask}
                users={users}
            />
        </div>
    );
};

export default DashboardPage;