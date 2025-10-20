package com.dumanrogger.taskapp.service;

import java.util.List;

import com.dumanrogger.taskapp.dto.UserDto;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
}