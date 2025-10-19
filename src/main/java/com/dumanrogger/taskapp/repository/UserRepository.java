
package com.dumanrogger.taskapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dumanrogger.taskapp.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.availabilityStatus = 'AVAILABLE'")
        List<User> findAvailableUsers();
        // --- КОНЕЦ НОВОГО КОДА ---

        // Эти методы нужны для Spring Security, который мы будем делать дальше
        Optional<User> findByUsername(String username);

        // Этот метод пригодится для проверки уникальности email при регистрации
        Optional<User> findByEmail(String email);
}
