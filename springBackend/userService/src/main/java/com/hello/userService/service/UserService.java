package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.entity.User;
import com.fitness.userservice.repository.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepo userRepo;

    public UserResponse getUserProfile(String userId) {
        User user = userRepo.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        UserResponse res = new UserResponse();
        res.setEmail(user.getEmail());
        res.setId(user.getId());
        res.setPassword(user.getPassword());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        return  res;
    }

    public  User getUserByEmailId(String userId){
        return userRepo.findByEmail(userId);
    }

    public UserResponse register(RegisterRequest request) {
        if(userRepo.existsByEmail(request.getEmail()))
            throw  new RuntimeException("Email already exists");
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepo.save(user);

        UserResponse res = new UserResponse();
        res.setEmail(user.getEmail());
        res.setId(user.getId());
        res.setPassword(user.getPassword());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        return res;
    }

    public UserResponse mapToUserResponse(User user){
        UserResponse res = new UserResponse();
        res.setEmail(user.getEmail());
        res.setId(user.getId());
        res.setPassword(user.getPassword());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());
        return res;
    }

    public Boolean exitsByUserId(String userId) {

        return  userRepo.existsById(userId);
    }
}
