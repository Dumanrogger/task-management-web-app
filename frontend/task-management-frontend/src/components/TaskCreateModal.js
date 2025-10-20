import React, { useState } from 'react';
import styles from './TaskCreateModal.module.css';

const TaskCreateModal = ({ isOpen, onClose, onCreateTask, users = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priorityLevel: 'MEDIUM',
        assignedUserId: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название задачи обязательно';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Название должно содержать минимум 3 символа';
        }

        if (!formData.priorityLevel) {
            newErrors.priorityLevel = 'Выберите приоритет';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const taskData = {
                ...formData,
                assignedUserId: formData.assignedUserId || null
            };

            await onCreateTask(taskData);

            // Сброс формы после успешного создания
            setFormData({
                title: '',
                description: '',
                priorityLevel: 'MEDIUM',
                assignedUserId: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            setErrors({ submit: 'Ошибка при создании задачи. Попробуйте еще раз.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            priorityLevel: 'MEDIUM',
            assignedUserId: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Создать новую задачу</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title" className={styles.label}>
                            Название задачи *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                            placeholder="Введите название задачи"
                            disabled={loading}
                        />
                        {errors.title && (
                            <span className={styles.errorText}>{errors.title}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description" className={styles.label}>
                            Описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={styles.textarea}
                            placeholder="Введите описание задачи"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="priorityLevel" className={styles.label}>
                            Приоритет *
                        </label>
                        <select
                            id="priorityLevel"
                            name="priorityLevel"
                            value={formData.priorityLevel}
                            onChange={handleInputChange}
                            className={`${styles.select} ${errors.priorityLevel ? styles.inputError : ''}`}
                            disabled={loading}
                        >
                            <option value="LOW">Низкий</option>
                            <option value="MEDIUM">Средний</option>
                            <option value="HIGH">Высокий</option>
                        </select>
                        {errors.priorityLevel && (
                            <span className={styles.errorText}>{errors.priorityLevel}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="assignedUserId" className={styles.label}>
                            Назначить пользователю
                        </label>
                        <select
                            id="assignedUserId"
                            name="assignedUserId"
                            value={formData.assignedUserId}
                            onChange={handleInputChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">Не назначено</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {errors.submit && (
                        <div className={styles.submitError}>
                            {errors.submit}
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.createButton}
                            disabled={loading}
                        >
                            {loading ? 'Создание...' : 'Создать задачу'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskCreateModal;