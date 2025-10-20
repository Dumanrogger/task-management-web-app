import React from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, isDragging, onDragStart, onDragEnd }) => {
    // Функция для определения CSS класса в зависимости от приоритета
    const getPriorityClass = (priorityLevel) => {
        switch (priorityLevel) {
            case 'HIGH':
                return styles.highPriority;
            case 'MEDIUM':
                return styles.mediumPriority;
            case 'LOW':
                return styles.lowPriority;
            default:
                return styles.defaultPriority;
        }
    };

    // Функция для получения текста приоритета на русском
    const getPriorityText = (priorityLevel) => {
        switch (priorityLevel) {
            case 'HIGH':
                return 'Высокий';
            case 'MEDIUM':
                return 'Средний';
            case 'LOW':
                return 'Низкий';
            default:
                return 'Не указан';
        }
    };

    const handleDragStart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id.toString());
        onDragStart && onDragStart(task.id);
    };

    const handleDragEnd = (e) => {
        onDragEnd && onDragEnd();
    };

    return (
        <div 
            className={`${styles.taskCard} ${getPriorityClass(task.priorityLevel)} ${isDragging ? styles.dragging : ''}`}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.dragHandle}>
                <span className={styles.dragIcon}>⋮⋮</span>
            </div>
            
            <div className={styles.taskContent}>
                <div className={styles.taskHeader}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    <span className={`${styles.priorityBadge} ${getPriorityClass(task.priorityLevel)}`}>
                        {getPriorityText(task.priorityLevel)}
                    </span>
                </div>

                <div className={styles.taskBody}>
                    {task.description && (
                        <p className={styles.taskDescription}>
                            {task.description}
                        </p>
                    )}

                    <div className={styles.taskMeta}>
                        <small className={styles.taskId}>ID: {task.id}</small>
                        {task.assignedUsername && (
                            <small className={styles.assignedUser}>
                                Назначено: {task.assignedUsername}
                            </small>
                        )}
                        {task.creationTimestamp && (
                            <small className={styles.creationDate}>
                                Создано: {new Date(task.creationTimestamp).toLocaleDateString('ru-RU')}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;