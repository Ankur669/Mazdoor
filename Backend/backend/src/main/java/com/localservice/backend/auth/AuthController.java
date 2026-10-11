
package com.localservice.backend.auth;

import com.localservice.backend.auth.dto.LoginRequest;
import com.localservice.backend.auth.dto.RegisterRequest;
import com.localservice.backend.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<User> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<User> login(
            @Valid @RequestBody LoginRequest request) {

        User user = authService.login(request);

        return ResponseEntity.ok(user);
    }
}
