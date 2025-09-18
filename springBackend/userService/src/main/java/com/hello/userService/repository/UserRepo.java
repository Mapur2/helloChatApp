package com.fitness.userservice.repository;

import com.fitness.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,String> {
    boolean existsByEmail(String email);

    User findByEmail(String userId);
}
