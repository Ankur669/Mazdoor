package com.localservice.backend.service;

import com.localservice.backend.entity.User;
import com.localservice.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}