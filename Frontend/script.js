
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

let loggedInUser = null;

try {

    loggedInUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

} catch (error) {

    console.error(
        "Unable to read logged-in user:",
        error
    );

    loggedInUser = null;
}


// ============================================================
// LOGOUT
// ============================================================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}


// ============================================================
// REGISTRATION
// ============================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("registerName")?.value.trim();

            const phone =
                document.getElementById("registerPhone")?.value.trim();

            const email =
                document.getElementById("registerEmail")?.value.trim();

            const password =
                document.getElementById("registerPassword")?.value;

            const location =
                document.getElementById("registerLocation")?.value.trim();

            const roleElement =
                document.getElementById("registerRole");

            const role =
                roleElement
                    ? roleElement.value
                    : "CUSTOMER";


            if (
                !name ||
                !phone ||
                !email ||
                !password ||
                !location
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
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


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Registration failed."
                    );

                }


                alert(
                    "Registration successful! Please login."
                );


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                alert(
                    error.message ||
                    "Registration failed. Please try again."
                );

            }

        }
    );

}


// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail")?.value.trim();

            const password =
                document.getElementById("loginPassword")?.value;


            if (!email || !password) {

                alert(
                    "Please enter your email and password."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,
                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Invalid email or password."
                    );

                }


                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data)
                );


                if (data.role === "CUSTOMER") {

                    window.location.href =
                        "customer-dashboard.html";

                }

                else if (data.role === "PROVIDER") {

                    window.location.href =
                        "provider-dashboard.html";

                }

                else {

                    window.location.href =
                        "index.html";

                }

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                alert(
                    error.message ||
                    "Login failed. Please try again."
                );

            }

        }
    );

}


// ============================================================
// CUSTOMER DASHBOARD - USER INFORMATION
// ============================================================

function populateCustomerAccount() {

    if (!loggedInUser) {
        return;
    }


    const userName =
        document.getElementById("userName");

    const welcomeName =
        document.getElementById("welcomeName");

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const accountPhone =
        document.getElementById("accountPhone");

    const accountLocation =
        document.getElementById("accountLocation");

    const accountRole =
        document.getElementById("accountRole");


    if (userName) {
        userName.textContent =
            loggedInUser.name || "Customer";
    }


    if (welcomeName) {
        welcomeName.textContent =
            loggedInUser.name || "Customer";
    }


    if (accountName) {
        accountName.textContent =
            loggedInUser.name || "-";
    }


    if (accountEmail) {
        accountEmail.textContent =
            loggedInUser.email || "-";
    }


    if (accountPhone) {
        accountPhone.textContent =
            loggedInUser.phone || "-";
    }


    if (accountLocation) {
        accountLocation.textContent =
            loggedInUser.location || "-";
    }


    if (accountRole) {
        accountRole.textContent =
            loggedInUser.role || "-";
    }

}


// ============================================================
// CUSTOMER SERVICE CATEGORIES
// ============================================================

const customerServiceCategories = {

    "Home & Property": {

        icon: "🏠",

        description:
            "Services to maintain, clean and improve your home and property.",

        keywords: [

            "plumbing",
            "plumber",

            "electrical",
            "electrician",

            "cleaning",
            "cleaner",
            "house cleaning",

            "gardening",
            "gardener",
            "garden",

            "plant",
            "plant care",

            "landscape",
            "landscaping",

            "carpentry",
            "carpenter",

            "pest",
            "pest control",

            "home"

        ]

    },


    "Beauty & Personal Care": {

        icon: "💄",

        description:
            "Beauty, grooming and personal care services from professionals.",

        keywords: [

            "beautician",
            "beauty",

            "makeup",
            "makeup artist",

            "hair",
            "hair stylist",
            "hairstylist",

            "salon",

            "spa",

            "personal care",

            "mehndi",
            "mehndi artist",

            "nail",
            "nail artist"

        ]

    },


    "Automotive & Transport": {

        icon: "🚗",

        description:
            "Reliable transportation, vehicle care and automotive services.",

        keywords: [

            "driver",
            "driving",

            "car wash",
            "bike wash",
            "vehicle wash",

            "vehicle",
            "automotive",
            "automobile",

            "car repair",
            "bike repair",
            "vehicle repair",

            "mechanic",

            "transport"

        ]

    },


    "Repairs & Maintenance": {

        icon: "🔧",

        description:
            "Professional repair and maintenance services for everyday needs.",

        keywords: [

            "repair",
            "maintenance",

            "ac repair",
            "ac service",
            "air conditioner",

            "refrigerator",
            "fridge",

            "washing machine",

            "appliance",

            "computer repair",
            "laptop repair",

            "mobile repair",
            "phone repair",

            "electronics repair",
            "electronics"

        ]

    },


    "Education & Learning": {

        icon: "📚",

        description:
            "Find teachers and tutors for academic and personal learning.",

        keywords: [

            "tutor",
            "tuition",
            "teacher",

            "home tutor",

            "math tutor",
            "mathematics",

            "english tutor",
            "english teacher",

            "computer tutor",
            "programming tutor",

            "music teacher",

            "language tutor",

            "spoken english",

            "coaching"

        ]

    },


    "Pets & Animal Care": {

        icon: "🐾",

        description:
            "Professional care and support for your beloved pets.",

        keywords: [

            "pet grooming",
            "pet groomer",

            "pet sitting",
            "pet sitter",

            "dog walking",
            "dog walker",

            "pet training",
            "dog training",

            "pet care",

            "animal care",

            "veterinary",
            "vet"

        ]

    },


    "Events & Occasions": {

        icon: "🎉",

        description:
            "Professionals to make your events and special occasions memorable.",

        keywords: [

            "event planner",
            "event planning",

            "photographer",
            "photography",

            "decorator",
            "decoration",

            "caterer",
            "catering",

            "dj",

            "wedding",
            "wedding planner",
            "wedding makeup",

            "party",

            "event"

        ]

    },


    "Moving & Delivery": {

        icon: "📦",

        description:
            "Moving, transportation and delivery services for your needs.",

        keywords: [

            "packer",
            "packers",

            "packers and movers",

            "mover",
            "moving",

            "house shifting",

            "local delivery",
            "delivery",

            "courier",
            "courier service",

            "furniture moving",

            "transport service"

        ]

    },


    "Technology & Digital": {

        icon: "💻",

        description:
            "Technology, computer and digital services from skilled professionals.",

        keywords: [

            "web developer",
            "website developer",
            "developer",

            "graphic designer",
            "graphic design",

            "video editor",
            "video editing",

            "computer setup",

            "computer service",

            "it support",
            "technical support",

            "software",

            "digital",

            "data entry"

        ]

    },


    "Other Services": {

        icon: "🛠️",

        description:
            "Other useful local services available from trusted professionals.",

        keywords: []

    }

};


window.localServeCustomerServices = {};


// ============================================================
// LOAD SERVICES
// ============================================================

async function loadServices() {

    const customerCategories =
        document.getElementById("customerCategories");


    const customerServices =
        document.getElementById("customerServices");


    if (customerCategories) {

        customerCategories.innerHTML = `

            <div class="services-loading">

                Loading service categories...

            </div>

        `;


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/services"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load services."
                );

            }


            const services =
                await response.json();


            window.localServeCustomerServices = {};


            Object.keys(
                customerServiceCategories
            ).forEach(category => {

                window.localServeCustomerServices[
                    category
                ] = [];

            });


            services.forEach(service => {

                const serviceName =
                    (
                        service.serviceName || ""
                    ).toLowerCase();


                const backendCategory =
                    (
                        service.category || ""
                    ).toLowerCase();


                const combinedText =
                    serviceName +
                    " " +
                    backendCategory;


                let matchedCategory =
                    "Other Services";


                for (
                    const [
                        categoryName,
                        categoryData
                    ]
                    of Object.entries(
                        customerServiceCategories
                    )
                ) {

                    if (
                        categoryName ===
                        "Other Services"
                    ) {

                        continue;
                    }


                    const matched =
                        categoryData.keywords.some(
                            keyword =>
                                combinedText.includes(
                                    keyword.toLowerCase()
                                )
                        );


                    if (matched) {

                        matchedCategory =
                            categoryName;

                        break;
                    }

                }


                window.localServeCustomerServices[
                    matchedCategory
                ].push(service);

            });


            renderCustomerCategories();

        }


        catch (error) {

            console.error(
                "Service loading error:",
                error
            );


            customerCategories.innerHTML = `

                <div class="services-error">

                    <h3>
                        Unable to load services
                    </h3>

                    <p>
                        Please make sure the
                        Spring Boot server is running.
                    </p>

                    <button
                        class="dashboard-action"
                        onclick="loadServices()">

                        Try Again

                    </button>

                </div>

            `;

        }


        return;
    }


    const serviceGrid =
        document.getElementById("serviceGrid");


    if (serviceGrid) {

        serviceGrid.innerHTML = `

            <p class="services-loading">

                Loading services...

            </p>

        `;


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/services"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load services."
                );

            }


            const services =
                await response.json();


            if (!services.length) {

                serviceGrid.innerHTML = `

                    <p class="services-loading">

                        No services available yet.

                    </p>

                `;

                return;
            }


            serviceGrid.innerHTML =
                services.map(service => `

                    <div class="dashboard-service-card">

                        <div class="service-small-icon">
                            🛠️
                        </div>

                        <h3>
                            ${service.serviceName || "Service"}
                        </h3>

                        <p>
                            ${
                                service.description ||
                                "Professional local service."
                            }
                        </p>

                        <strong>
                            ${
                                service.price
                                    ? "₹" + service.price
                                    : "Contact provider"
                            }
                        </strong>

                        <button
                            class="dashboard-action"
                            onclick="selectService(${service.serviceId})">

                            Select Service →

                        </button>

                    </div>

                `).join("");

        }


        catch (error) {

            console.error(error);

            serviceGrid.innerHTML = `

                <p class="services-error">

                    Unable to load services.

                </p>

            `;

        }

    }

}


// ============================================================
// RENDER CUSTOMER CATEGORIES
// ============================================================

function renderCustomerCategories() {

    const container =
        document.getElementById(
            "customerCategories"
        );


    const servicesContainer =
        document.getElementById(
            "customerServices"
        );


    if (!container) {
        return;
    }


    if (servicesContainer) {

        servicesContainer.style.display =
            "none";

    }


    container.style.display =
        "grid";


    const categoryCards =
        Object.entries(
            customerServiceCategories
        )
        .map(
            ([categoryName, categoryData]) => {

                const services =
                    window.localServeCustomerServices[
                        categoryName
                    ] || [];


                return `

                    <div
                        class="customer-category-card">

                        <div
                            class="customer-category-icon">

                            ${categoryData.icon}

                        </div>

                        <div
                            class="customer-category-content">

                            <h3>
                                ${categoryName}
                            </h3>

                            <p>
                                ${categoryData.description}
                            </p>

                            <div
                                class="customer-category-footer">

                                <span>

                                    ${services.length}

                                    ${
                                        services.length === 1
                                            ? "service"
                                            : "services"
                                    }

                                </span>

                                <button
                                    class="customer-category-btn"
                                    onclick="openCustomerCategory('${categoryName}')">

                                    Explore →

                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");


    container.innerHTML =
        categoryCards;

}


// ============================================================
// OPEN CUSTOMER CATEGORY
// ============================================================

function openCustomerCategory(categoryName) {

    const categories =
        document.getElementById(
            "customerCategories"
        );


    const servicesContainer =
        document.getElementById(
            "customerServices"
        );


    const heading =
        document.getElementById(
            "servicesHeading"
        );


    const subheading =
        document.getElementById(
            "servicesSubheading"
        );


    if (
        !categories ||
        !servicesContainer
    ) {

        return;
    }


    const services =
        window.localServeCustomerServices[
            categoryName
        ] || [];


    const category =
        customerServiceCategories[
            categoryName
        ];


    categories.style.display =
        "none";


    servicesContainer.style.display =
        "block";


    if (heading) {

        heading.textContent =
            categoryName;

    }


    if (subheading) {

        subheading.textContent =
            category
                ? category.description
                : "Available services";

    }


    if (!services.length) {

        servicesContainer.innerHTML = `

            <div class="category-empty">

                <div class="category-empty-icon">
                    ${category ? category.icon : "🛠️"}
                </div>

                <h3>
                    No services available yet
                </h3>

                <p>
                    Providers haven't added services
                    in this category yet.
                </p>

                <button
                    class="back-category-btn"
                    onclick="backToCustomerCategories()">

                    ← Back to Categories

                </button>

            </div>

        `;

        return;

    }


    servicesContainer.innerHTML = `

        <div class="category-detail-top">

            <button
                class="back-category-btn"
                onclick="backToCustomerCategories()">

                ← Back to Categories

            </button>

            <span
                class="category-detail-label">

                ${services.length}

                ${
                    services.length === 1
                        ? "service available"
                        : "services available"
                }

            </span>

        </div>


        <div class="customer-service-grid">

            ${
                services.map(service => `

                    <div
                        class="customer-service-card">

                        <div
                            class="customer-service-icon">

                            ${
                                category
                                    ? category.icon
                                    : "🛠️"
                            }

                        </div>


                        <div
                            class="customer-service-content">

                            <h3>
                                ${
                                    service.serviceName ||
                                    "Service"
                                }
                            </h3>


                            <p>
                                ${
                                    service.description ||
                                    "Professional service from a trusted local provider."
                                }
                            </p>


                            <div
                                class="customer-service-provider">

                                <span>
                                    👤
                                </span>

                                <span>

                                    ${
                                        service.providerName ||
                                        service.provider?.name ||
                                        "Local Professional"
                                    }

                                </span>

                            </div>


                            <div
                                class="customer-service-bottom">

                                <strong
                                    class="customer-service-price">

                                    ${
                                        service.price
                                            ? "₹" + service.price
                                            : "Contact"
                                    }

                                </strong>


                                <button
                                    class="customer-service-btn"
                                    onclick="selectService(${service.serviceId})">

                                    View Service →

                                </button>

                            </div>

                        </div>

                    </div>

                `).join("")
            }

        </div>

    `;


    const section =
        document.getElementById(
            "servicesSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ============================================================
// BACK TO CATEGORIES
// ============================================================

function backToCustomerCategories() {

    const categories =
        document.getElementById(
            "customerCategories"
        );


    const servicesContainer =
        document.getElementById(
            "customerServices"
        );


    const heading =
        document.getElementById(
            "servicesHeading"
        );


    const subheading =
        document.getElementById(
            "servicesSubheading"
        );


    if (servicesContainer) {

        servicesContainer.style.display =
            "none";

    }


    if (categories) {

        categories.style.display =
            "grid";

    }


    if (heading) {

        heading.textContent =
            "Choose a Service Category";

    }


    if (subheading) {

        subheading.textContent =
            "Select a category to see the services available.";

    }


    const section =
        document.getElementById(
            "servicesSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ============================================================
// FIND SERVICES QUICK ACTION
// ============================================================

function findServices() {

    const section =
        document.getElementById(
            "servicesSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ============================================================
// CUSTOMER - MY BOOKINGS
// ============================================================

async function viewBookings() {

    const bookingsSection =
        document.getElementById(
            "bookingsSection"
        );


    const bookingsContainer =
        document.getElementById(
            "customerBookings"
        );


    if (
        !bookingsSection ||
        !bookingsContainer
    ) {

        return;

    }


    bookingsSection.style.display =
        "block";


    bookingsSection.scrollIntoView({
        behavior: "smooth"
    });


    if (
        !loggedInUser ||
        !loggedInUser.userId
    ) {

        bookingsContainer.innerHTML = `

            <p>
                Please login again to view your bookings.
            </p>

        `;

        return;

    }


    try {

        bookingsContainer.innerHTML = `

            <p class="services-loading">

                Loading your bookings...

            </p>

        `;


        const response =
            await fetch(
                `http://localhost:8080/api/bookings/customer/${loggedInUser.userId}`
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Load bookings error:",
                response.status,
                errorText
            );

            throw new Error(
                "Unable to load bookings."
            );

        }


        const bookings =
            await response.json();


        if (
            !bookings ||
            bookings.length === 0
        ) {

            bookingsContainer.innerHTML = `

                <div class="dashboard-card">

                    <div class="dashboard-card-icon">
                        📅
                    </div>

                    <h3>
                        No Bookings Yet
                    </h3>

                    <p>
                        You haven't booked any services yet.
                    </p>

                    <button
                        class="dashboard-action"
                        onclick="findServices()">

                        Find a Service →

                    </button>

                </div>

            `;

            return;

        }


        bookingsContainer.innerHTML =
            bookings.map(
                booking => {

                    const serviceName =
                        booking.service?.serviceName ||
                        "Service";


                    const providerName =
                        booking.service?.provider?.name ||
                        booking.service?.providerName ||
                        "Professional";


                    const bookingDate =
                        booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                            ).toLocaleString()
                            : "Not specified";


                    const price =
                        booking.totalPrice != null
                            ? `₹${booking.totalPrice}`
                            : "Price unavailable";


                    const status =
                        booking.status ||
                        "PENDING";


                    return `

                        <div class="dashboard-card">

                            <div class="dashboard-card-icon">
                                📅
                            </div>

                            <h3>
                                ${serviceName}
                            </h3>

                            <p>
                                <strong>
                                    Professional:
                                </strong>

                                ${providerName}
                            </p>

                            <p>
                                <strong>
                                    Date:
                                </strong>

                                ${bookingDate}
                            </p>

                            <p>
                                <strong>
                                    Address:
                                </strong>

                                ${booking.address || "Not provided"}
                            </p>

                            <p>
                                <strong>
                                    Price:
                                </strong>

                                ${price}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>

                                ${status}
                            </p>

                        </div>

                    `;

                }
            ).join("");

    }


    catch (error) {

        console.error(
            "Error loading bookings:",
            error
        );


        bookingsContainer.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    Unable to Load Bookings
                </h3>

                <p>
                    Something went wrong while loading your bookings.
                </p>

                <button
                    class="dashboard-action"
                    onclick="viewBookings()">

                    Try Again →

                </button>

            </div>

        `;

    }

}


// ============================================================
// PROVIDER - LOAD BOOKINGS
// ============================================================

async function loadProviderBookings() {

    const providerBookingGrid =
        document.getElementById(
            "providerBookingGrid"
        );


    if (!providerBookingGrid) {
        return;
    }


    if (
        !loggedInUser ||
        !loggedInUser.userId
    ) {

        providerBookingGrid.innerHTML = `

            <p class="services-error">

                Please login again to view your bookings.

            </p>

        `;

        return;

    }


    if (
        loggedInUser.role !== "PROVIDER"
    ) {

        providerBookingGrid.innerHTML = `

            <p class="services-error">

                Only providers can view booking requests.

            </p>

        `;

        return;

    }


    providerBookingGrid.innerHTML = `

        <p class="services-loading">

            Loading booking requests...

        </p>

    `;


    try {

        // ====================================================
        // GET BOOKINGS FOR THIS PROVIDER
        // ====================================================

        const response =
            await fetch(

                "http://localhost:8080/api/bookings/provider/" +
                loggedInUser.userId

            );


        const responseText =
            await response.text();


        console.log(
            "Provider bookings response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Unable to load provider bookings."
            );

        }


        let bookings = [];


        try {

            bookings =
                JSON.parse(
                    responseText
                );

        }

        catch (parseError) {

            throw new Error(
                "Invalid booking response from server."
            );

        }


        if (
            !bookings ||
            bookings.length === 0
        ) {

            providerBookingGrid.innerHTML = `

                <div class="dashboard-card">

                    <div class="dashboard-card-icon">
                        📅
                    </div>

                    <h3>
                        No Booking Requests
                    </h3>

                    <p>
                        You don't have any customer booking requests yet.
                    </p>

                </div>

            `;

            return;

        }


        // ====================================================
        // RENDER BOOKINGS
        // ====================================================

        providerBookingGrid.innerHTML =
            bookings.map(
                booking => {

                    const customerName =
                        booking.customer?.name ||
                        booking.customerName ||
                        "Customer";


                    const customerPhone =
                        booking.customer?.phone ||
                        booking.customerPhone ||
                        "Not provided";


                    const customerEmail =
                        booking.customer?.email ||
                        booking.customerEmail ||
                        "Not provided";


                    const serviceName =
                        booking.service?.serviceName ||
                        booking.serviceName ||
                        "Service";


                    const bookingDate =
                        booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )
                            : "Not specified";


                    const bookingTime =
                        booking.bookingTime ||
                        "Not specified";


                    const address =
                        booking.address ||
                        "Not provided";


                    const problem =
                        booking.problemDescription ||
                        booking.problem ||
                        "No problem description";


                    const status =
                        booking.status ||
                        "PENDING";


                    const price =
                        booking.totalPrice != null
                            ? `₹${booking.totalPrice}`
                            : booking.totalAmount != null
                                ? `₹${booking.totalAmount}`
                                : "Price unavailable";


                    return `

                        <div class="dashboard-service-card">

                            <div class="service-small-icon">
                                📅
                            </div>


                            <h3>
                                ${serviceName}
                            </h3>


                            <p>
                                <strong>
                                    Customer:
                                </strong>

                                ${customerName}
                            </p>


                            <p>
                                <strong>
                                    Phone:
                                </strong>

                                ${customerPhone}
                            </p>


                            <p>
                                <strong>
                                    Email:
                                </strong>

                                ${customerEmail}
                            </p>


                            <p>
                                <strong>
                                    Date:
                                </strong>

                                ${bookingDate}
                            </p>


                            <p>
                                <strong>
                                    Time:
                                </strong>

                                ${bookingTime}
                            </p>


                            <p>
                                <strong>
                                    Address:
                                </strong>

                                ${address}
                            </p>


                            <p>
                                <strong>
                                    Problem:
                                </strong>

                                ${problem}
                            </p>


                            <p>
                                <strong>
                                    Price:
                                </strong>

                                ${price}
                            </p>


                            <p>
                                <strong>
                                    Status:
                                </strong>

                                ${status}
                            </p>

                        </div>

                    `;

                }
            ).join("");

    }


    catch (error) {

        console.error(
            "Provider booking loading error:",
            error
        );


        providerBookingGrid.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    Unable to Load Booking Requests
                </h3>


                <p>
                    ${error.message || "Something went wrong."}
                </p>


                <button
                    class="dashboard-action"
                    onclick="loadProviderBookings()">

                    Try Again →

                </button>

            </div>

        `;

    }

}


// ============================================================
// MY REVIEWS
// ============================================================

function viewReviews() {

    alert(
        "My Reviews will be connected next."
    );

}


// ============================================================
// SELECT SERVICE
// ============================================================

function selectService(serviceId) {

    const service =
        findCustomerServiceById(
            serviceId
        );


    if (!service) {

        alert(
            "Unable to find this service."
        );

        return;

    }


    if (
        !loggedInUser ||
        !loggedInUser.userId
    ) {

        alert(
            "Please login again."
        );

        return;

    }


    const serviceName =
        service.serviceName ||
        "Service";


    const servicePrice =
        service.price != null
            ? `₹${service.price}`
            : "Price unavailable";


    let bookingDate =
        prompt(

            `Book: ${serviceName}\n\n` +

            `Price: ${servicePrice}\n\n` +

            `Enter booking date and time.\n` +

            `Format: YYYY-MM-DDTHH:MM\n\n` +

            `Example: 2026-09-15T14:30`

        );


    if (!bookingDate) {
        return;
    }


    bookingDate =
        bookingDate.trim();


    bookingDate =
        bookingDate.replace(
            " ",
            "T"
        );


    const datePattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;


    if (
        !datePattern.test(
            bookingDate
        )
    ) {

        alert(

            "Invalid date format.\n\n" +

            "Please enter the date like this:\n\n" +

            "2026-09-15T14:30"

        );

        return;

    }


    const selectedDate =
        new Date(
            bookingDate
        );


    if (
        Number.isNaN(
            selectedDate.getTime()
        )
    ) {

        alert(
            "The booking date is not valid."
        );

        return;

    }


    const now =
        new Date();


    if (
        selectedDate <= now
    ) {

        alert(

            "Booking date must be in the future.\n\n" +

            "Please choose a future date and time."

        );

        return;

    }


    const address =
        prompt(
            "Enter the service address:"
        );


    if (!address) {
        return;
    }


    const notes =
        prompt(
            "Any additional notes? (Optional)"
        );


    createBooking(
        serviceId,
        bookingDate,
        address.trim(),
        notes
            ? notes.trim()
            : ""
    );

}


// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking(
    serviceId,
    bookingDate,
    address,
    notes
) {

    if (
        !loggedInUser ||
        !loggedInUser.userId
    ) {

        alert(
            "Please login again."
        );

        return;

    }


    const bookingData = {

        customerId:
            Number(
                loggedInUser.userId
            ),

        serviceId:
            Number(
                serviceId
            ),

        bookingDate:
            bookingDate,

        address:
            address,

        notes:
            notes

    };


    console.log(
        "Creating booking:",
        bookingData
    );


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/bookings",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )

                }
            );


        const responseText =
            await response.text();


        console.log(
            "Booking server response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            let errorMessage =
                responseText;


            try {

                const errorData =
                    JSON.parse(
                        responseText
                    );


                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorData.errors ||
                    responseText;

            }

            catch (parseError) {

                errorMessage =
                    responseText ||
                    "Unknown server error.";

            }


            alert(

                "Booking could not be created.\n\n" +

                "Server response:\n" +

                errorMessage

            );


            return;

        }


        let booking = null;


        try {

            booking =
                JSON.parse(
                    responseText
                );

        }

        catch (parseError) {

            console.error(
                "Unable to parse booking response:",
                parseError
            );

        }


        alert(

            "Booking created successfully! 🎉\n\n" +

            "Booking ID: " +

            (
                booking?.bookingId ||
                "Created"
            )

        );


        await viewBookings();

    }


    catch (error) {

        console.error(
            "Booking request error:",
            error
        );


        alert(

            "Unable to connect to the booking server.\n\n" +

            "Please make sure Spring Boot is running."

        );

    }

}


// ============================================================
// FIND CUSTOMER SERVICE BY ID
// ============================================================

function findCustomerServiceById(
    serviceId
) {

    const categories =
        window.localServeCustomerServices ||
        {};


    for (
        const services
        of Object.values(categories)
    ) {

        const service =
            services.find(
                item =>
                    Number(item.serviceId) ===
                    Number(serviceId)
            );


        if (service) {
            return service;
        }

    }


    return null;

}


// ============================================================
// HOMEPAGE SERVICE SEARCH
// ============================================================

function searchHomeServices() {

    const searchInput =
        document.getElementById(
            "homeServiceSearch"
        );


    const locationInput =
        document.getElementById(
            "homeLocationSearch"
        );


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const locationTerm =
        locationInput
            ? locationInput.value
                .trim()
                .toLowerCase()
            : "";


    const cards =
        document.querySelectorAll(
            ".homepage-service-card"
        );


    const categorySections =
        document.querySelectorAll(
            ".category-section"
        );


    if (!cards.length) {
        return;
    }


    cards.forEach(card => {

        const text =
            card.textContent
                .toLowerCase();


        const matchesService =
            !searchTerm ||
            text.includes(searchTerm);


        const matchesLocation =
            !locationTerm ||
            text.includes(locationTerm);


        card.style.display =
            matchesService &&
            matchesLocation
                ? ""
                : "none";

    });


    categorySections.forEach(section => {

        const visibleCards =
            section.querySelectorAll(
                ".homepage-service-card"
            );


        let hasVisible =
            false;


        visibleCards.forEach(card => {

            if (
                card.style.display !==
                "none"
            ) {

                hasVisible = true;

            }

        });


        section.style.display =
            hasVisible
                ? ""
                : "none";

    });

}


// ============================================================
// HOMEPAGE SEARCH EVENTS
// ============================================================

const homeServiceSearch =
    document.getElementById(
        "homeServiceSearch"
    );


const homeLocationSearch =
    document.getElementById(
        "homeLocationSearch"
    );


if (homeServiceSearch) {

    homeServiceSearch.addEventListener(
        "input",
        searchHomeServices
    );


    homeServiceSearch.addEventListener(
        "keypress",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchHomeServices();

            }

        }
    );

}


if (homeLocationSearch) {

    homeLocationSearch.addEventListener(
        "input",
        searchHomeServices
    );


    homeLocationSearch.addEventListener(
        "keypress",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                searchHomeServices();

            }

        }
    );

}


// ============================================================
// PROVIDER DASHBOARD - ADD SERVICE
// ============================================================

const serviceForm =
    document.getElementById(
        "serviceForm"
    );


if (serviceForm) {

    serviceForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!loggedInUser) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            if (
                loggedInUser.role !==
                "PROVIDER"
            ) {

                alert(
                    "Only providers can add services."
                );

                return;

            }


            // IMPORTANT:
            // These IDs match provider-dashboard.html

            const serviceName =
                document.getElementById(
                    "serviceName"
                )?.value.trim();


            const category =
                document.getElementById(
                    "category"
                )?.value.trim();


            const price =
                document.getElementById(
                    "price"
                )?.value;


            const serviceLocation =
                document.getElementById(
                    "serviceLocation"
                )?.value.trim();


            const description =
                document.getElementById(
                    "description"
                )?.value.trim();


            if (
                !serviceName ||
                !category ||
                !price ||
                !serviceLocation ||
                !description
            ) {

                alert(
                    "Please fill in all service fields."
                );

                return;

            }


            try {

                const response =
                    await fetch(

                        "http://localhost:8080/api/services/provider/" +
                        loggedInUser.userId,

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },


                            body: JSON.stringify({

                                serviceName:
                                    serviceName,

                                category:
                                    category,

                                price:
                                    Number(price),

                               location:
    serviceLocation,

                                description:
                                    description

                            })

                        }

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        data.error ||
                        "Unable to add service."

                    );

                }


                alert(
                    "Service added successfully!"
                );


                serviceForm.reset();


                loadProviderServices();

            }


            catch (error) {

                console.error(
                    "Provider service error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to add service."
                );

            }

        }
    );

}


// ============================================================
// LOAD PROVIDER SERVICES
// ============================================================

async function loadProviderServices() {

    const providerServiceGrid =
        document.getElementById(
            "providerServiceGrid"
        );


    if (!providerServiceGrid) {
        return;
    }


    if (!loggedInUser) {
        return;
    }


    providerServiceGrid.innerHTML = `

        <p class="services-loading">

            Loading your services...

        </p>

    `;


    try {

        const response =
            await fetch(

                "http://localhost:8080/api/services/provider/" +
                loggedInUser.userId

            );


        if (!response.ok) {

            throw new Error(
                "Unable to load provider services."
            );

        }


        const services =
            await response.json();


        if (!services.length) {

            providerServiceGrid.innerHTML = `

                <p class="services-loading">

                    You have not added any services yet.

                </p>

            `;

            return;

        }


        providerServiceGrid.innerHTML =
            services.map(service => `

                <div class="dashboard-service-card">

                    <div class="service-small-icon">
                        🛠️
                    </div>


                    <h3>
                        ${service.serviceName || "Service"}
                    </h3>


                    <p>
                        ${
                            service.description ||
                            "No description available."
                        }
                    </p>


                    <p>
                        <strong>
                            Category:
                        </strong>

                        ${
                            service.category ||
                            "-"
                        }
                    </p>


                    <p>
                        <strong>
                            Location:
                        </strong>

                        ${
                            service.location ||
                            "-"
                        }
                    </p>


                    <strong>
                        ${
                            service.price
                                ? "₹" + service.price
                                : "Contact"
                        }
                    </strong>

                </div>

            `).join("");

    }


    catch (error) {

        console.error(
            "Provider service loading error:",
            error
        );


        providerServiceGrid.innerHTML = `

            <p class="services-error">

                Unable to load your services.

            </p>

        `;

    }

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Customer account

        populateCustomerAccount();


        // Customer categories

        if (
            document.getElementById(
                "customerCategories"
            )
        ) {

            loadServices();

        }


        // Existing service grid

        else if (
            document.getElementById(
                "serviceGrid"
            )
        ) {

            loadServices();

        }


        // Provider services

        if (
            document.getElementById(
                "providerServiceGrid"
            )
        ) {

            loadProviderServices();

        }


        // Provider bookings

        if (
            document.getElementById(
                "providerBookingGrid"
            )
        ) {

            loadProviderBookings();

        }

    }
);
