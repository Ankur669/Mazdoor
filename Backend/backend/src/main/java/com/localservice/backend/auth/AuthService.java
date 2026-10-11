
package com.localservice.backend.auth;

import com.localservice.backend.auth.dto.LoginRequest;
import com.localservice.backend.auth.dto.RegisterRequest;
import com.localservice.backend.entity.User;
import com.localservice.backend.entity.UserRole;
import com.localservice.backend.entity.UserStatus;
import com.localservice.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================
    public User register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Create new user
        User user = new User();

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());

        // Temporary password storage
        // We will replace this with password hashing later.
        user.setPasswordHash(request.getPassword());

        // Convert role string to UserRole enum
        user.setRole(
                UserRole.valueOf(request.getRole().toUpperCase())
        );

        user.setLocation(request.getLocation());

        // Default status
        user.setStatus(UserStatus.ACTIVE);

        // Set creation time
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        // Check password
        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check account status
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User account is not active");
        }

        return user;
    }
}

