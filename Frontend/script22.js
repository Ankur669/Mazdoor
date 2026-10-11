// ============================================================
// LOCAL SERVE - MAIN SCRIPT
// ============================================================


// ============================================================
// NAVIGATION
// ============================================================

function goToLogin() {
    window.location.href = "login.html";
}

function goToRegister() {
    window.location.href = "register.html";
}

function scrollToServices() {
    const services = document.getElementById("services");

    if (services) {
        services.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ============================================================
// LOGGED-IN USER
// ============================================================

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);


// ============================================================
// LOGOUT
// ============================================================

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}


// ============================================================
// REGISTRATION
// ============================================================

async function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const location = document.getElementById("location")?.value.trim();
    const role = document.getElementById("role")?.value;

    if (!name || !phone || !email || !password || !location || !role) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    password: password,
                    location: location,
                    role: role
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Registration failed."
            );
        }

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    } catch (error) {

        console.error("Registration error:", error);

        alert(
            error.message ||
            "Registration failed. Please try again."
        );
    }
}


// ============================================================
// LOGIN
// ============================================================

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Invalid email or password."
            );
        }

        // Save logged-in user
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data)
        );

        // Redirect according to role
        if (data.role === "PROVIDER") {

            window.location.href = "provider-dashboard.html";

        } else {

            window.location.href = "customer-dashboard.html";
        }

    } catch (error) {

        console.error("Login error:", error);

        alert(
            error.message ||
            "Login failed. Please try again."
        );
    }
}


// ============================================================
// CUSTOMER ACCOUNT
// ============================================================

function populateCustomerAccount() {

    if (!loggedInUser) {
        return;
    }

    const userName = document.getElementById("userName");
    const welcomeName = document.getElementById("welcomeName");

    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");
    const accountPhone = document.getElementById("accountPhone");
    const accountLocation = document.getElementById("accountLocation");

    if (userName) {
        userName.textContent = loggedInUser.name || "Customer";
    }

    if (welcomeName) {
        welcomeName.textContent = loggedInUser.name || "Customer";
    }

    if (accountName) {
        accountName.textContent = loggedInUser.name || "-";
    }

    if (accountEmail) {
        accountEmail.textContent = loggedInUser.email || "-";
    }

    if (accountPhone) {
        accountPhone.textContent = loggedInUser.phone || "-";
    }

    if (accountLocation) {
        accountLocation.textContent = loggedInUser.location || "-";
    }
}


// ============================================================
// PROVIDER ACCOUNT
// ============================================================

function populateProviderAccount() {

    if (!loggedInUser) {
        return;
    }

    const providerName =
        document.getElementById("providerName");

    const providerWelcomeName =
        document.getElementById("providerWelcomeName");

    const providerAccountName =
        document.getElementById("providerAccountName");

    const providerAccountEmail =
        document.getElementById("providerAccountEmail");

    const providerAccountPhone =
        document.getElementById("providerAccountPhone");

    const providerAccountLocation =
        document.getElementById("providerAccountLocation");


    if (providerName) {
        providerName.textContent =
            loggedInUser.name || "Provider";
    }

    if (providerWelcomeName) {
        providerWelcomeName.textContent =
            loggedInUser.name || "Provider";
    }

    if (providerAccountName) {
        providerAccountName.textContent =
            loggedInUser.name || "-";
    }

    if (providerAccountEmail) {
        providerAccountEmail.textContent =
            loggedInUser.email || "-";
    }

    if (providerAccountPhone) {
        providerAccountPhone.textContent =
            loggedInUser.phone || "-";
    }

    if (providerAccountLocation) {
        providerAccountLocation.textContent =
            loggedInUser.location || "-";
    }
}


// ============================================================
// CUSTOMER SERVICE CATEGORIES
// ============================================================

const customerServiceCategories = [

    {
        name: "Home & Property",
        icon: "🏠",
        description: "Services for your home and property"
    },

    {
        name: "Beauty & Personal Care",
        icon: "💄",
        description: "Beauty, grooming and personal care"
    },

    {
        name: "Automotive & Transport",
        icon: "🚗",
        description: "Vehicle and transportation services"
    },

    {
        name: "Repairs & Maintenance",
        icon: "🔧",
        description: "Repair and maintenance services"
    },

    {
        name: "Education & Learning",
        icon: "📚",
        description: "Tutors and educational services"
    },

    {
        name: "Pets & Animal Care",
        icon: "🐾",
        description: "Pet care and animal services"
    },

    {
        name: "Events & Occasions",
        icon: "🎉",
        description: "Event and celebration services"
    },

    {
        name: "Moving & Delivery",
        icon: "📦",
        description: "Moving, delivery and transport"
    },

    {
        name: "Technology & Digital",
        icon: "💻",
        description: "Technology and digital services"
    },

    {
        name: "Other Services",
        icon: "✨",
        description: "Other local professional services"
    }

];


// ============================================================
// LOAD ALL SERVICES
// ============================================================

async function loadServices() {

    const categoryGrid =
        document.getElementById("customerCategoryGrid");

    if (!categoryGrid) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/services"
        );

        if (!response.ok) {
            throw new Error("Failed to load services.");
        }

        const services = await response.json();

        console.log("All services:", services);

        renderCustomerCategories(services);

    } catch (error) {

        console.error("Service loading error:", error);

        categoryGrid.innerHTML = `
            <p>Unable to load services.</p>
        `;
    }
}


// ============================================================
// RENDER CUSTOMER CATEGORIES
// ============================================================

function renderCustomerCategories(services) {

    const categoryGrid =
        document.getElementById("customerCategoryGrid");

    if (!categoryGrid) {
        return;
    }

    categoryGrid.innerHTML = "";

    customerServiceCategories.forEach(category => {

        const categoryServices =
            services.filter(service =>
                service.category &&
                service.category.toLowerCase() ===
                category.name.toLowerCase()
            );

        const card = document.createElement("div");

        card.className = "category-card";

        card.innerHTML = `
            <div class="category-icon">
                ${category.icon}
            </div>

            <h3>${category.name}</h3>

            <p>${category.description}</p>

            <span>
                ${categoryServices.length}
                service${categoryServices.length === 1 ? "" : "s"}
            </span>
        `;

        card.addEventListener("click", () => {

            openCustomerCategory(
                category.name,
                services
            );

        });

        categoryGrid.appendChild(card);
    });
}


// ============================================================
// OPEN CUSTOMER CATEGORY
// ============================================================

function openCustomerCategory(
    categoryName,
    services = null
) {

    const categorySection =
        document.getElementById("customerCategorySection");

    const serviceSection =
        document.getElementById("customerServiceSection");

    const serviceGrid =
        document.getElementById("customerServiceGrid");

    const selectedCategory =
        document.getElementById("selectedCategory");

    if (!categorySection ||
        !serviceSection ||
        !serviceGrid) {
        return;
    }

    if (services === null) {

        fetch("http://localhost:8080/api/services")
            .then(response => response.json())
            .then(data => {

                openCustomerCategory(
                    categoryName,
                    data
                );

            })
            .catch(error => {

                console.error(error);

            });

        return;
    }

    const filteredServices =
        services.filter(service =>
            service.category &&
            service.category.toLowerCase() ===
            categoryName.toLowerCase()
        );

    if (selectedCategory) {
        selectedCategory.textContent =
            categoryName;
    }

    categorySection.style.display = "none";
    serviceSection.style.display = "block";

    serviceGrid.innerHTML = "";

    if (filteredServices.length === 0) {

        serviceGrid.innerHTML = `
            <div class="empty-state">
                <h3>No services available</h3>
                <p>
                    There are currently no services
                    in this category.
                </p>
            </div>
        `;

        return;
    }

    filteredServices.forEach(service => {

        const card =
            createCustomerServiceCard(service);

        serviceGrid.appendChild(card);
    });
}


// ============================================================
// CUSTOMER SERVICE CARD
// ============================================================

function createCustomerServiceCard(service) {

    const card = document.createElement("div");

    card.className = "service-card";

    const price =
        service.price !== undefined &&
        service.price !== null
            ? `₹${service.price}`
            : "Price not available";

    const location =
        service.location ||
        "Location not specified";

    const description =
        service.description ||
        "Professional local service.";

    const providerName =
        service.provider?.name ||
        "Local Provider";

    card.innerHTML = `
        <div class="service-card-content">

            <p class="service-category">
                ${service.category || "Service"}
            </p>

            <h3>
                ${service.serviceName || "Unnamed Service"}
            </h3>

            <p>
                ${description}
            </p>

            <div class="service-info">
                <span>📍 ${location}</span>
                <span>💰 ${price}</span>
            </div>

            <p class="service-provider">
                Provider: ${providerName}
            </p>

            <button
                class="dashboard-submit-btn"
                onclick="selectService(${service.serviceId})"
            >
                Book Service
            </button>

        </div>
    `;

    return card;
}


// ============================================================
// BACK TO CUSTOMER CATEGORIES
// ============================================================

function backToCustomerCategories() {

    const categorySection =
        document.getElementById("customerCategorySection");

    const serviceSection =
        document.getElementById("customerServiceSection");

    if (categorySection) {
        categorySection.style.display = "block";
    }

    if (serviceSection) {
        serviceSection.style.display = "none";
    }
}


// ============================================================
// FIND SERVICES
// ============================================================

async function findServices() {

    const searchInput =
        document.getElementById("serviceSearch");

    const locationInput =
        document.getElementById("locationSearch");

    const search =
        searchInput?.value.trim().toLowerCase() || "";

    const location =
        locationInput?.value.trim().toLowerCase() || "";

    try {

        const response = await fetch(
            "http://localhost:8080/api/services"
        );

        const services = await response.json();

        const results = services.filter(service => {

            const serviceName =
                service.serviceName?.toLowerCase() || "";

            const category =
                service.category?.toLowerCase() || "";

            const serviceLocation =
                service.location?.toLowerCase() || "";

            const matchesSearch =
                !search ||
                serviceName.includes(search) ||
                category.includes(search);

            const matchesLocation =
                !location ||
                serviceLocation.includes(location);

            return matchesSearch && matchesLocation;
        });

        displayServiceSearchResults(results);

    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        alert("Unable to search services.");
    }
}


// ============================================================
// DISPLAY SEARCH RESULTS
// ============================================================

function displayServiceSearchResults(services) {

    const serviceGrid =
        document.getElementById("customerServiceGrid");

    const categorySection =
        document.getElementById("customerCategorySection");

    const serviceSection =
        document.getElementById("customerServiceSection");

    if (!serviceGrid) {
        return;
    }

    if (categorySection) {
        categorySection.style.display = "none";
    }

    if (serviceSection) {
        serviceSection.style.display = "block";
    }

    serviceGrid.innerHTML = "";

    if (services.length === 0) {

        serviceGrid.innerHTML = `
            <div class="empty-state">
                <h3>No services found</h3>
                <p>
                    Try another service or location.
                </p>
            </div>
        `;

        return;
    }

    services.forEach(service => {

        serviceGrid.appendChild(
            createCustomerServiceCard(service)
        );
    });
}


// ============================================================
// CUSTOMER BOOKINGS
// ============================================================

async function viewBookings() {

    if (!loggedInUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    const bookingGrid =
        document.getElementById("bookingGrid");

    if (!bookingGrid) {
        return;
    }

    bookingGrid.innerHTML =
        "<p>Loading your bookings...</p>";

    try {

        const response = await fetch(
            `http://localhost:8080/api/bookings/customer/${loggedInUser.userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load bookings."
            );
        }

        const bookings = await response.json();

        console.log(
            "Customer bookings:",
            bookings
        );

        bookingGrid.innerHTML = "";

        if (!bookings || bookings.length === 0) {

            bookingGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No bookings yet</h3>
                    <p>
                        Your service bookings will
                        appear here.
                    </p>
                </div>
            `;

            return;
        }

        bookings.forEach(booking => {

            const card =
                document.createElement("div");

            card.className = "service-card";

            const serviceName =
                booking.service?.serviceName ||
                "Service";

            const providerName =
                booking.service?.provider?.name ||
                booking.provider?.name ||
                "Provider";

            const price =
                booking.totalPrice ??
                booking.totalAmount ??
                booking.service?.price ??
                0;

            card.innerHTML = `
                <div class="service-card-content">

                    <p class="service-category">
                        ${booking.service?.category || "Service"}
                    </p>

                    <h3>
                        ${serviceName}
                    </h3>

                    <p>
                        Provider:
                        ${providerName}
                    </p>

                    <p>
                        📅
                        ${booking.bookingDate || "-"}
                    </p>

                    <p>
                        🕐
                        ${booking.bookingTime || "-"}
                    </p>

                    <p>
                        📍
                        ${booking.address || "-"}
                    </p>

                    <p>
                        💰
                        ₹${price}
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${booking.status || "PENDING"}
                        </strong>
                    </p>

                    ${
                        booking.problemDescription
                            ? `
                            <p>
                                Problem:
                                ${booking.problemDescription}
                            </p>
                            `
                            : ""
                    }

                </div>
            `;

            bookingGrid.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Booking loading error:",
            error
        );

        bookingGrid.innerHTML = `
            <p>
                Unable to load your bookings.
            </p>
        `;
    }
}


// ============================================================
// PROVIDER BOOKINGS
// ============================================================

async function loadProviderBookings() {

    if (!loggedInUser) {
        return;
    }

    const bookingGrid =
        document.getElementById("providerBookingGrid");

    if (!bookingGrid) {
        return;
    }

    bookingGrid.innerHTML =
        "<p>Loading booking requests...</p>";

    try {

        const response = await fetch(
            `http://localhost:8080/api/bookings/provider/${loggedInUser.userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to load booking requests."
            );
        }

        const bookings = await response.json();

        console.log(
            "Provider bookings:",
            bookings
        );

        bookingGrid.innerHTML = "";

        if (!bookings || bookings.length === 0) {

            bookingGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No booking requests</h3>
                    <p>
                        Customer requests will
                        appear here.
                    </p>
                </div>
            `;

            return;
        }

        bookings.forEach(booking => {

            const card =
                document.createElement("div");

            card.className = "service-card";

            const customer =
                booking.customer || {};

            const service =
                booking.service || {};

            const price =
                booking.totalPrice ??
                booking.totalAmount ??
                service.price ??
                0;

            card.innerHTML = `
                <div class="service-card-content">

                    <p class="service-category">
                        BOOKING REQUEST
                    </p>

                    <h3>
                        ${service.serviceName || "Service"}
                    </h3>

                    <p>
                        <strong>Customer:</strong>
                        ${customer.name || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${customer.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${customer.phone || "-"}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${booking.bookingDate || "-"}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${booking.bookingTime || "-"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${booking.address || "-"}
                    </p>

                    ${
                        booking.problemDescription
                            ? `
                            <p>
                                <strong>Problem:</strong>
                                ${booking.problemDescription}
                            </p>
                            `
                            : ""
                    }

                    ${
                        booking.notes
                            ? `
                            <p>
                                <strong>Notes:</strong>
                                ${booking.notes}
                            </p>
                            `
                            : ""
                    }

                    <p>
                        <strong>Price:</strong>
                        ₹${price}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${booking.status || "PENDING"}
                    </p>

                </div>
            `;

            bookingGrid.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Provider booking error:",
            error
        );

        bookingGrid.innerHTML = `
            <p>
                Unable to load booking requests.
            </p>
        `;
    }
}


// ============================================================
// REVIEWS
// ============================================================

function viewReviews() {

    alert(
        "Reviews feature will be available soon."
    );
}


// ============================================================
// SELECT SERVICE
// ============================================================

function selectService(serviceId) {

    if (!loggedInUser) {

        alert("Please login to book a service.");

        window.location.href = "login.html";

        return;
    }

    if (loggedInUser.role !== "CUSTOMER") {

        alert(
            "Only customers can book services."
        );

        return;
    }

    const bookingDate =
        prompt(
            "Enter booking date (YYYY-MM-DD):"
        );

    if (!bookingDate) {
        return;
    }

    const bookingTime =
        prompt(
            "Enter booking time (e.g. 10:00):"
        );

    if (!bookingTime) {
        return;
    }

    const address =
        prompt(
            "Enter service address:"
        );

    if (!address) {
        return;
    }

    const notes =
        prompt(
            "Enter any additional notes:"
        ) || "";

    createBooking(
        serviceId,
        bookingDate,
        bookingTime,
        address,
        notes
    );
}


// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking(
    serviceId,
    bookingDate,
    bookingTime,
    address,
    notes
) {

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/bookings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    customerId:
                        Number(loggedInUser.userId),

                    serviceId:
                        Number(serviceId),

                    bookingDate:
                        bookingDate,

                    bookingTime:
                        bookingTime,

                    address:
                        address,

                    notes:
                        notes
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Booking failed."
            );
        }

        alert(
            "Service booked successfully!"
        );

        console.log(
            "Created booking:",
            data
        );

    } catch (error) {

        console.error(
            "Booking error:",
            error
        );

        alert(
            error.message ||
            "Unable to create booking."
        );
    }
}


// ============================================================
// FIND CUSTOMER SERVICE BY ID
// ============================================================

async function findCustomerServiceById(serviceId) {

    try {

        const response = await fetch(
            "http://localhost:8080/api/services"
        );

        const services = await response.json();

        return services.find(
            service =>
                Number(service.serviceId) ===
                Number(serviceId)
        );

    } catch (error) {

        console.error(
            "Service lookup error:",
            error
        );

        return null;
    }
}


// ============================================================
// PROVIDER - ADD SERVICE
// ============================================================

async function addProviderService(event) {

    event.preventDefault();

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    if (loggedInUser.role !== "PROVIDER") {

        alert(
            "Only providers can add services."
        );

        return;
    }


    const serviceName =
        document.getElementById("serviceName")
            ?.value.trim();

    const category =
        document.getElementById("category")
            ?.value.trim();

    const price =
        document.getElementById("price")
            ?.value;

    const serviceLocation =
        document.getElementById("serviceLocation")
            ?.value.trim();

    const description =
        document.getElementById("description")
            ?.value.trim();

    const message =
        document.getElementById("serviceMessage");


    if (
        !serviceName ||
        !category ||
        !price ||
        !serviceLocation ||
        !description
    ) {

        if (message) {

            message.textContent =
                "Please fill in all service fields.";

        }

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:8080/api/services/provider/${loggedInUser.userId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    serviceName:
                        serviceName,

                    category:
                        category,

                    price:
                        Number(price),

                    // IMPORTANT:
                    // Backend field is "location"
                    // NOT "serviceLocation"

                    location:
                        serviceLocation,

                    description:
                        description
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to add service."
            );
        }


        if (message) {

            message.textContent =
                "Service added successfully!";

        }


        console.log(
            "Added service:",
            data
        );


        // Clear form
        const form =
            document.getElementById("serviceForm");

        if (form) {
            form.reset();
        }


        // Reload provider services
        loadProviderServices();


    } catch (error) {

        console.error(
            "Add service error:",
            error
        );

        if (message) {

            message.textContent =
                error.message ||
                "Unable to add service.";

        } else {

            alert(
                error.message ||
                "Unable to add service."
            );
        }
    }
}


// ============================================================
// PROVIDER - LOAD SERVICES
// ============================================================

async function loadProviderServices() {

    if (!loggedInUser) {
        return;
    }

    const serviceGrid =
        document.getElementById(
            "providerServiceGrid"
        );

    if (!serviceGrid) {
        return;
    }

    serviceGrid.innerHTML =
        "<p>Loading your services...</p>";


    try {

        const response = await fetch(
            `http://localhost:8080/api/services/provider/${loggedInUser.userId}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load your services."
            );
        }


        const services =
            await response.json();


        console.log(
            "Provider services:",
            services
        );


        serviceGrid.innerHTML = "";


        if (
            !services ||
            services.length === 0
        ) {

            serviceGrid.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No services yet
                    </h3>

                    <p>
                        Add your first service
                        using the form above.
                    </p>

                </div>
            `;

            return;
        }


        services.forEach(service => {

            const card =
                document.createElement("div");

            card.className =
                "service-card";


            const price =
                service.price !== undefined &&
                service.price !== null
                    ? `₹${service.price}`
                    : "-";


            // IMPORTANT:
            // Backend returns "location"
            // NOT "serviceLocation"

            const location =
                service.location ||
                "-";


            const description =
                service.description ||
                "No description provided.";


            card.innerHTML = `

                <div class="service-card-content">

                    <p class="service-category">
                        ${service.category || "Service"}
                    </p>

                    <h3>
                        ${service.serviceName || "Unnamed Service"}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <div class="service-info">

                        <span>
                            📍 ${location}
                        </span>

                        <span>
                            💰 ${price}
                        </span>

                    </div>

                    <p>
                        Status:
                        <strong>
                            ${
                                service.active
                                    ? "Active"
                                    : "Inactive"
                            }
                        </strong>
                    </p>

                </div>

            `;


            serviceGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Provider service loading error:",
            error
        );

        serviceGrid.innerHTML = `
            <p>
                Unable to load your services.
            </p>
        `;
    }
}


// ============================================================
// HOMEPAGE SEARCH
// ============================================================

function setupHomepageSearch() {

    const searchInput =
        document.getElementById("searchService");

    const locationInput =
        document.getElementById("searchLocation");

    if (!searchInput && !locationInput) {
        return;
    }

    console.log(
        "Homepage search ready."
    );
}


// ============================================================
// PROTECT DASHBOARDS
// ============================================================

function checkCustomerDashboard() {

    if (!document.getElementById("bookingGrid") &&
        !document.getElementById("customerCategoryGrid")) {
        return;
    }

    if (!loggedInUser) {

        window.location.href =
            "login.html";

        return;
    }

    if (loggedInUser.role !== "CUSTOMER") {

        window.location.href =
            "provider-dashboard.html";
    }
}


function checkProviderDashboard() {

    if (!document.getElementById("providerServiceGrid")) {
        return;
    }

    if (!loggedInUser) {

        window.location.href =
            "login.html";

        return;
    }

    if (loggedInUser.role !== "PROVIDER") {

        window.location.href =
            "customer-dashboard.html";

        return;
    }
}


// ============================================================
// DOM CONTENT LOADED
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "LocalServe script loaded."
        );


        // ----------------------------------------------------
        // Registration form
        // ----------------------------------------------------

        const registerForm =
            document.getElementById("registerForm");

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );
        }


        // ----------------------------------------------------
        // Login form
        // ----------------------------------------------------

        const loginForm =
            document.getElementById("loginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }


        // ----------------------------------------------------
        // Customer dashboard
        // ----------------------------------------------------

        if (
            document.getElementById(
                "customerCategoryGrid"
            )
        ) {

            checkCustomerDashboard();

            populateCustomerAccount();

            loadServices();
        }


        // ----------------------------------------------------
        // Customer bookings
        // ----------------------------------------------------

        if (
            document.getElementById(
                "bookingGrid"
            )
        ) {

            checkCustomerDashboard();

            populateCustomerAccount();

            viewBookings();
        }


        // ----------------------------------------------------
        // Provider dashboard
        // ----------------------------------------------------

        if (
            document.getElementById(
                "providerServiceGrid"
            )
        ) {

            checkProviderDashboard();

            populateProviderAccount();

            loadProviderServices();

            loadProviderBookings();
        }


        // ----------------------------------------------------
        // Provider service form
        // ----------------------------------------------------

        const serviceForm =
            document.getElementById("serviceForm");

        if (serviceForm) {

            serviceForm.addEventListener(
                "submit",
                addProviderService
            );
        }


        // ----------------------------------------------------
        // Homepage
        // ----------------------------------------------------

        setupHomepageSearch();

    }
);