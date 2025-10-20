import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const TaskCardContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => getPriorityColor(props.priority)};
  cursor: grab;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const TaskTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const TaskDescription = styled.p`
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
`;

const PriorityBadge = styled.span`
  background: ${props => getPriorityColor(props.priority)};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const AssignedUser = styled.span`
  color: #007bff;
  font-weight: 500;
`;

// Функция для определения цвета приоритета
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH': return '#dc3545';    // Красный
    case 'MEDIUM': return '#ffc107';  // Желтый
    case 'LOW': return '#28a745';     // Зеленый
    default: return '#6c757d';        // Серый
  }
};

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <TaskCardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          priority={task.priorityLevel}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <TaskTitle>{task.title}</TaskTitle>
          {task.description && (
            <TaskDescription>{task.description}</TaskDescription>
          )}
          <TaskMeta>
            <div>
              <PriorityBadge priority={task.priorityLevel}>
                {task.priorityLevel}
              </PriorityBadge>
            </div>
            <div>
              {task.assignedUsername ? (
                <AssignedUser>👤 {task.assignedUsername}</AssignedUser>
              ) : (
                <span>Unassigned</span>
              )}
            </div>
          </TaskMeta>
          {task.creationTimestamp && (
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem' }}>
              Created: {new Date(task.creationTimestamp).toLocaleDateString()}
            </div>
          )}
        </TaskCardContainer>
      )}
    </Draggable>
  );
};

export default TaskCard;