package com.dumanrogger.taskapp.config; 

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.dumanrogger.taskapp.entity.Task;
import com.dumanrogger.taskapp.entity.User;
import com.dumanrogger.taskapp.repository.TaskRepository;
import com.dumanrogger.taskapp.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    // Создаем экземпляр напрямую, чтобы избежать циклической зависимости
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("!!! База данных пуста. Заполняю начальными данными...");
            createInitialData();
            System.out.println("!!! Начальные данные успешно загружены.");
        } else {
            System.out.println("!!! В базе данных уже есть данные. Инициализация не требуется.");
        }
    }

    private void createInitialData() {
        User user1 = new User();
        user1.setUsername("john_doe");
        user1.setEmail("john.doe@example.com");
        user1.setHashedPassword(passwordEncoder.encode("password123"));
        user1.setAvailabilityStatus("AVAILABLE");

        User user2 = new User();
        user2.setUsername("jane_smith");
        user2.setEmail("jane.smith@example.com");
        user2.setHashedPassword(passwordEncoder.encode("password456"));
        user2.setAvailabilityStatus("BUSY");

        User user3 = new User();
        user3.setUsername("admin_user");
        user3.setEmail("admin@example.com");
        user3.setHashedPassword(passwordEncoder.encode("adminpass"));
        user3.setAvailabilityStatus("AVAILABLE");

        List<User> users = userRepository.saveAll(List.of(user1, user2, user3));
        User savedUser1 = users.get(0);
        User savedUser2 = users.get(1);
        User savedUser3 = users.get(2);

        Task task1 = new Task();
        task1.setTitle("Подготовить отчет по продажам");
        task1.setPriorityLevel("HIGH");
        task1.setAssignedUser(savedUser1);

        Task task2 = new Task();
        task2.setTitle("Обновить документацию API");
        task2.setPriorityLevel("MEDIUM");
        task2.setAssignedUser(savedUser1);

        Task task3 = new Task();
        task3.setTitle("Исправить баг в модуле авторизации");
        task3.setPriorityLevel("HIGH");
        task3.setAssignedUser(savedUser2);

        Task task4 = new Task();
        task4.setTitle("Запланировать встречу с командой");
        task4.setPriorityLevel("LOW");
        task4.setAssignedUser(savedUser3);

        Task task5 = new Task();
        task5.setTitle("Провести рефакторинг кода");
        task5.setPriorityLevel("MEDIUM");
        task5.setAssignedUser(null);

        taskRepository.saveAll(List.of(task1, task2, task3, task4, task5));
    }
}