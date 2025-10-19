
package com.dumanrogger.taskapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dumanrogger.taskapp.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
