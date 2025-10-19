package com.dumanrogger.taskapp.service;

import  java.util.List;

import com.dumanrogger.taskapp.dto.CreateOrUpdateTaskRequest;
import com.dumanrogger.taskapp.dto.TaskDto;

public interface TaskService {
    List<TaskDto> getAllTasks();
    TaskDto getTaskById(Long id);
    TaskDto createTask(CreateOrUpdateTaskRequest request);
    TaskDto updateTask(Long id, CreateOrUpdateTaskRequest request);
    void deleteTask(Long id);
    TaskDto assignTaskToAvailableUser(Long taskId);
}