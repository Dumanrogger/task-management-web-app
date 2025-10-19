package com.dumanrogger.taskapp.service;

import com.dumanrogger.taskapp.dto.AuthResponse;
import com.dumanrogger.taskapp.dto.LoginRequest;
import com.dumanrogger.taskapp.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(LoginRequest request);
}