package com.localservice.backend.service;

import com.localservice.backend.entity.User;
import com.localservice.backend.entity.UserRole;
import com.localservice.backend.repository.ServiceRepository;
import com.localservice.backend.repository.UserRepository;
import com.localservice.backend.service.dto.ServiceRequest;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ServiceService(
            ServiceRepository serviceRepository,
            UserRepository userRepository) {

        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public com.localservice.backend.entity.Service createService(
            Integer providerId,
            ServiceRequest request) {

        User provider = userRepository.findById(providerId)
                .orElseThrow(() ->
                        new RuntimeException("Provider not found"));

        if (provider.getRole() != UserRole.PROVIDER) {
            throw new RuntimeException(
                    "Only providers can create services");
        }

        com.localservice.backend.entity.Service service =
                new com.localservice.backend.entity.Service();

        service.setProvider(provider);
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(BigDecimal.valueOf(request.getPrice()));
        service.setLocation(request.getLocation());
        service.setActive(true);
        service.setCreatedAt(LocalDateTime.now());

        return serviceRepository.save(service);
    }

    public List<com.localservice.backend.entity.Service>
    getAllActiveServices() {

        return serviceRepository.findByActiveTrue();
    }

    public List<com.localservice.backend.entity.Service>
    getServicesByProvider(Integer providerId) {

        return serviceRepository.findByProviderUserId(providerId);
    }

    public List<com.localservice.backend.entity.Service>
    getServicesByCategory(String category) {

        return serviceRepository
                .findByCategoryIgnoreCaseAndActiveTrue(category);
    }

    public List<com.localservice.backend.entity.Service>
    searchServices(String name) {

        return serviceRepository
                .findByServiceNameContainingIgnoreCase(name);
    }
}