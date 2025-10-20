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


    @Override
    public TaskDto createTask(CreateOrUpdateTaskRequest request) {
        Task task = new Task();
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriorityLevel(request.getPriorityLevel());

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        }
        
        Task savedTask = taskRepository.save(task);

        return convertToDto(savedTask);
    }

    @Override
    public TaskDto updateTask(Long id, CreateOrUpdateTaskRequest request) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setPriorityLevel(request.getPriorityLevel());

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedUserId()));
            existingTask.setAssignedUser(assignedUser);
        } else {
            existingTask.setAssignedUser(null);
        }

        Task updatedTask = taskRepository.save(existingTask);

        return convertToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        
        taskRepository.deleteById(id);
    }

    @Override
    public TaskDto assignTaskToAvailableUser(Long taskId) {
    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

    List<User> availableUsers = userRepository.findAvailableUsers();

    if (availableUsers.isEmpty()) {
        throw new RuntimeException("No available users to assign the task.");
    }

    User userToAssign = availableUsers.get(0);

    task.setAssignedUser(userToAssign);
    Task savedTask = taskRepository.save(task);

    return convertToDto(savedTask);
    }
    
}