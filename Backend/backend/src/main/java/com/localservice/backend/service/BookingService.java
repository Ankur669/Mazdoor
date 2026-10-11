package com.localservice.backend.service;

import com.localservice.backend.entity.Booking;
import com.localservice.backend.entity.Service;
import com.localservice.backend.entity.User;
import com.localservice.backend.repository.BookingRepository;
import com.localservice.backend.repository.ServiceRepository;
import com.localservice.backend.repository.UserRepository;
import com.localservice.backend.service.dto.BookingRequest;
import com.localservice.backend.service.dto.BookingResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    // ============================================================
    // CREATE BOOKING
    // ============================================================

    public BookingResponse createBooking(BookingRequest request) {

        // Find customer
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        // Find selected service
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() ->
                        new RuntimeException("Service not found"));

        // Check service is active
        if (!service.getActive()) {
            throw new RuntimeException("Service is not active");
        }

        // Create booking
        Booking booking = new Booking();

        booking.setCustomer(customer);

        // Provider comes from selected service
        booking.setProvider(service.getProvider());

        booking.setService(service);

        booking.setBookingDate(request.getBookingDate());

        booking.setBookingTime(request.getBookingTime());

        booking.setAddress(request.getAddress());

        booking.setNotes(request.getNotes());

        // Use service price
        booking.setTotalPrice(service.getPrice());

        // Initial status
        booking.setStatus("PENDING");

        // Creation time
        booking.setCreatedAt(LocalDateTime.now());

        // Save
        Booking savedBooking = bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }


    // ============================================================
    // GET CUSTOMER BOOKINGS
    // ============================================================

    public List<BookingResponse> getBookingsByCustomer(Integer customerId) {

        return bookingRepository
                .findByCustomerUserId(customerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET PROVIDER BOOKINGS
    // ============================================================

    public List<BookingResponse> getBookingsByProvider(Integer providerId) {

        return bookingRepository
                .findByServiceProviderUserId(providerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET ALL BOOKINGS
    // ============================================================

    public List<BookingResponse> getAllBookings() {

        return bookingRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ============================================================
    // UPDATE BOOKING STATUS
    // ============================================================

    public BookingResponse updateStatus(
            Integer bookingId,
            String status) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus(status);

        Booking updatedBooking = bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }


    // ============================================================
    // CONVERT BOOKING ENTITY → BOOKING RESPONSE
    // ============================================================

    private BookingResponse convertToResponse(Booking booking) {

        BookingResponse response = new BookingResponse();

        // Booking information
        response.setBookingId(booking.getBookingId());
        response.setBookingDate(booking.getBookingDate());
        response.setCreatedAt(booking.getCreatedAt());
        response.setAddress(booking.getAddress());
        response.setNotes(booking.getNotes());
        response.setStatus(booking.getStatus());
        response.setTotalPrice(booking.getTotalPrice());


        // Customer information
        if (booking.getCustomer() != null) {

            response.setCustomerId(
                    booking.getCustomer().getUserId()
            );

            response.setCustomerName(
                    booking.getCustomer().getName()
            );
        }


        // Service information
        if (booking.getService() != null) {

            response.setServiceId(
                    booking.getService().getServiceId()
            );

            response.setServiceName(
                    booking.getService().getServiceName()
            );

            response.setCategory(
                    booking.getService().getCategory()
            );
        }


        // Provider information
        if (booking.getProvider() != null) {

            response.setProviderId(
                    booking.getProvider().getUserId()
            );

            response.setProviderName(
                    booking.getProvider().getName()
            );
        }

        return response;
    }
}