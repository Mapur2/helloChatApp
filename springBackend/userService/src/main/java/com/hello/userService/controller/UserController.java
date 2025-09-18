package com.fitness.userservice.controller;

import com.fitness.userservice.dto.LoginDTO;
import com.fitness.userservice.dto.LoginResponse;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.entity.User;
import com.fitness.userservice.service.AuthService;
import com.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder encoder;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserResponse r=userService.mapToUserResponse(userService.getUserByEmailId(email));
        return ResponseEntity.ok(r);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        request.setPassword(encoder.encode(request.getPassword()));
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.exitsByUserId(userId));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> signin(@RequestBody LoginDTO loginDTO){
        LoginResponse login = authService.login(loginDTO);
        return new ResponseEntity<>(login, HttpStatus.OK);
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token){
        return ResponseEntity.ok(authService.validateToken(token));
    }
}
