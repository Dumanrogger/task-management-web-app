package com.dumanrogger.taskapp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dumanrogger.taskapp.dto.CreateOrUpdateTaskRequest;
import com.dumanrogger.taskapp.dto.TaskDto;
import com.dumanrogger.taskapp.entity.Task;
import com.dumanrogger.taskapp.entity.User; // <-- ШАГ 1: Импортируем User
import com.dumanrogger.taskapp.repository.TaskRepository;
import com.dumanrogger.taskapp.repository.UserRepository; // <-- ШАГ 2: Импортируем UserRepository

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository; // <-- ШАГ 3: Добавляем поле для UserRepository

    // ШАГ 4: Обновляем конструктор, чтобы Spring внедрил оба репозитория
    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id)); 
        return convertToDto(task);
    }

    // Этот метод остается без изменений
    private TaskDto convertToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setPriorityLevel(task.getPriorityLevel());
        taskDto.setCreationTimestamp(task.getCreationTimestamp());
        if (task.getAssignedUser() != null) {
            taskDto.setAssignedUserId(task.getAssignedUser().getId());
            taskDto.setAssignedUsername(task.getAssignedUser().getUsername());
        }
        return taskDto;
    }

    // --- НАЧАЛО НОВОГО КОДА ---

    @Override
    public TaskDto createTask(CreateOrUpdateTaskRequest request) {
        // 1. Создаем новый пустой объект Task
        Task task = new Task();
        
        // 2. Заполняем его данными из запроса (DTO)
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriorityLevel(request.getPriorityLevel());

        // 3. Если в запросе указан ID пользователя, находим этого пользователя и привязываем к задаче
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        }
        
        // 4. Сохраняем готовую задачу в базу данных
        Task savedTask = taskRepository.save(task);

        // 5. Конвертируем сохраненную сущность обратно в DTO и возвращаем клиенту
        return convertToDto(savedTask);
    }

    @Override
    public TaskDto updateTask(Long id, CreateOrUpdateTaskRequest request) {
        // 1. Сначала находим задачу, которую хотим обновить, в базе данных
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        // 2. Обновляем поля найденной задачи данными из запроса
        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setPriorityLevel(request.getPriorityLevel());

        // 3. Обновляем пользователя, которому назначена задача
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedUserId()));
            existingTask.setAssignedUser(assignedUser);
        } else {
            // Если ID пользователя не передан, значит, мы хотим отвязать задачу от пользователя
            existingTask.setAssignedUser(null);
        }

        // 4. Сохраняем обновленную задачу. Метод save() понимает, что это обновление, а не создание.
        Task updatedTask = taskRepository.save(existingTask);

        // 5. Конвертируем и возвращаем результат
        return convertToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        // 1. Проверяем, существует ли задача с таким ID, чтобы не получить ошибку
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        
        // 2. Если существует, удаляем ее
        taskRepository.deleteById(id);
    }
    
    // --- КОНЕЦ НОВОГО КОДА ---
}