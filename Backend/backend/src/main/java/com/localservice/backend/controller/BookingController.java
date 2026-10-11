package com.localservice.backend.controller;

import com.localservice.backend.entity.Booking;
import com.localservice.backend.service.BookingService;
import com.localservice.backend.service.dto.BookingRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // =========================
    // CREATE BOOKING
    // =========================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request) {

        Booking booking = bookingService.createBooking(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    // =========================
    // GET ALL BOOKINGS
    // =========================

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // =========================
    // GET CUSTOMER BOOKINGS
    // =========================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(
            @PathVariable Integer customerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByCustomer(customerId)
        );
    }

    // =========================
    // GET PROVIDER BOOKINGS
    // =========================

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(
            @PathVariable Integer providerId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByProvider(providerId)
        );
    }

    // =========================
    // UPDATE BOOKING STATUS
    // =========================

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Integer bookingId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                bookingService.updateStatus(
                        bookingId,
                        status
                )
        );
    }
}