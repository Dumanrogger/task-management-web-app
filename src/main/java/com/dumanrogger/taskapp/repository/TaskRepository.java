package com.dumanrogger.taskapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dumanrogger.taskapp.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}