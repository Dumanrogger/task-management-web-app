package com.dumanrogger.taskapp.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String priorityLevel;
    private LocalDateTime creationTimestamp;
    private Long assignedUserId;
    private String assignedUsername;
}