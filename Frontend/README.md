# LocalServe - Frontend

LocalServe is a local service marketplace web application that connects customers with service providers for different everyday services.

## About the Project

The frontend provides a simple and user-friendly interface where customers can:

- Register and log in
- Browse available services
- Search for services
- View service details
- Book services
- View their bookings
- Track booking status

Service providers can:

- Log in to their account
- Add services
- View booking requests
- Accept or update booking requests
- Manage their services

## Frontend Technologies

- HTML5
- CSS3
- JavaScript
- REST API integration
- Browser LocalStorage

## Main Pages

- `login.html` - User login
- `register.html` - New user registration
- `customer-dashboard.html` - Customer dashboard
- `provider-dashboard.html` - Provider dashboard
- `style.css` - Website styling
- `script.js` - Frontend functionality and API integration

## Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.

The backend handles:

- User authentication
- User roles
- Service management
- Service providers
- Bookings
- Booking status updates

## User Roles

The application supports three roles:

- Customer
- Provider
- Admin

## Project Structure

```text
Frontend/
│
├── login.html
├── register.html
├── customer-dashboard.html
├── provider-dashboard.html
├── style.css
├── script.js
└── README.md


Local Storage

Browser LocalStorage is used to maintain login-related information on the frontend.

The frontend uses the loggedInUser key to maintain the current user's session information.

Running the Frontend
Start the Spring Boot backend.
Make sure the backend is running on the configured port.
Open the frontend login.html file in a browser.
Register or log in to access the appropriate dashboard.
Project Goal

The goal of LocalServe is to provide a convenient platform for customers to discover and book local services while allowing service providers to manage their services and booking requests.