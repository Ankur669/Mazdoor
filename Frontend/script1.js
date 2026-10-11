
// ================= NAVIGATION =================

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


// ================= REGISTRATION =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const message = document.getElementById("registerMessage");

        const userData = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            location: document.getElementById("location").value.trim(),
            role: document.getElementById("role").value
        };

        message.textContent = "Creating your account...";
        message.style.color = "#2563eb";

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData)
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent =
                    "Account created successfully! Redirecting to login...";

                message.style.color = "green";

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);

            } else {

                message.textContent =
                    data.message || "Registration failed.";

                message.style.color = "red";
            }

        } catch (error) {

            console.error("Registration error:", error);

            message.textContent =
                "Unable to connect to the server. Make sure Spring Boot is running.";

            message.style.color = "red";
        }
    });
}


// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const message = document.getElementById("loginMessage");

        const loginData = {
            email: document.getElementById("loginEmail").value.trim(),
            password: document.getElementById("loginPassword").value
        };

        message.textContent = "Logging in...";
        message.style.color = "#2563eb";

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent = "Login successful!";
                message.style.color = "green";

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data)
                );

                setTimeout(function () {

                    if (data.role === "CUSTOMER") {

                        window.location.href =
                            "customer-dashboard.html";

                    } else if (data.role === "PROVIDER") {

                        window.location.href =
                            "provider-dashboard.html";

                    } else {

                        window.location.href =
                            "index.html";
                    }

                }, 1000);

            } else {

                message.textContent =
                    data.message || "Invalid email or password.";

                message.style.color = "red";
            }

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the server. Make sure Spring Boot is running.";

            message.style.color = "red";
        }
    });
}


// ================= LOGGED-IN USER =================

let loggedInUser = null;

try {
    loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );
} catch (error) {
    console.error("User data error:", error);
}


// ================= CUSTOMER DASHBOARD =================

if (
    loggedInUser &&
    loggedInUser.role === "CUSTOMER" &&
    document.querySelector(".dashboard")
) {

    const userName = document.getElementById("userName");
    const welcomeName = document.getElementById("welcomeName");
    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");
    const accountPhone = document.getElementById("accountPhone");
    const accountLocation = document.getElementById("accountLocation");
    const accountRole = document.getElementById("accountRole");

    if (userName) {
        userName.textContent = loggedInUser.name;
    }

    if (welcomeName) {
        welcomeName.textContent = loggedInUser.name;
    }

    if (accountName) {
        accountName.textContent = loggedInUser.name;
    }

    if (accountEmail) {
        accountEmail.textContent = loggedInUser.email;
    }

    if (accountPhone) {
        accountPhone.textContent = loggedInUser.phone;
    }

    if (accountLocation) {
        accountLocation.textContent =
            loggedInUser.location || "Not provided";
    }

    if (accountRole) {
        accountRole.textContent = loggedInUser.role;
    }
}


// ================= LOAD CUSTOMER SERVICES =================

async function loadServices() {

    const serviceGrid =
        document.getElementById("serviceGrid");

    if (!serviceGrid) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/services"
        );

        if (!response.ok) {
            throw new Error("Failed to load services");
        }

        const services = await response.json();

        serviceGrid.innerHTML = "";

        if (services.length === 0) {

            serviceGrid.innerHTML = `
                <p>
                    No services are currently available.
                </p>
            `;

            return;
        }

        services.forEach(function (service) {

            const card =
                document.createElement("div");

            card.className =
                "dashboard-service-card";

            const providerName =
                service.provider &&
                service.provider.name
                    ? service.provider.name
                    : "Not specified";

            const providerLocation =
                service.provider &&
                service.provider.location
                    ? service.provider.location
                    : "Not specified";

            card.innerHTML = `

                <div class="dashboard-service-icon">
                    🛠️
                </div>

                <h3>
                    ${service.serviceName}
                </h3>

                <p>
                    ${service.description ||
                    "Professional local service"}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${service.category}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${service.price}
                </p>

                <p>
                    <strong>Provider:</strong>
                    ${providerName}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${providerLocation}
                </p>

                <button
                    onclick="selectService(${service.serviceId})">

                    View Service →

                </button>
            `;

            serviceGrid.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Service loading error:",
            error
        );

        serviceGrid.innerHTML = `
            <p>
                Unable to load services.
                Please make sure the backend is running.
            </p>
        `;
    }
}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
}


// ================= CUSTOMER ACTIONS =================

function findServices() {

    const serviceGrid =
        document.getElementById("serviceGrid");

    if (serviceGrid) {

        serviceGrid.scrollIntoView({
            behavior: "smooth"
        });
    }
}

function viewBookings() {

    alert(
        "My Bookings will be connected next."
    );
}

function viewReviews() {

    alert(
        "Reviews will be connected next."
    );
}


// ================= SERVICE SELECTION =================

function selectService(serviceId) {

    alert(
        "Service ID " +
        serviceId +
        " selected. Booking will be connected next."
    );
}


// ================= START CUSTOMER SERVICES =================

if (
    document.getElementById("serviceGrid")
) {
    loadServices();
}


// ================= PROVIDER DASHBOARD =================

const providerDashboard =
    document.getElementById("serviceForm");

if (providerDashboard) {

    const provider =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!provider) {

        window.location.href =
            "login.html";

    } else if (provider.role !== "PROVIDER") {

        alert(
            "Access denied. Provider account required."
        );

        window.location.href =
            "index.html";

    } else {

        const providerName =
            document.getElementById("providerName");

        const providerWelcomeName =
            document.getElementById(
                "providerWelcomeName"
            );

        const providerAccountName =
            document.getElementById(
                "providerAccountName"
            );

        const providerAccountEmail =
            document.getElementById(
                "providerAccountEmail"
            );

        const providerAccountPhone =
            document.getElementById(
                "providerAccountPhone"
            );

        const providerAccountLocation =
            document.getElementById(
                "providerAccountLocation"
            );


        if (providerName) {
            providerName.textContent =
                provider.name;
        }

        if (providerWelcomeName) {
            providerWelcomeName.textContent =
                provider.name;
        }

        if (providerAccountName) {
            providerAccountName.textContent =
                provider.name;
        }

        if (providerAccountEmail) {
            providerAccountEmail.textContent =
                provider.email;
        }

        if (providerAccountPhone) {
            providerAccountPhone.textContent =
                provider.phone;
        }

        if (providerAccountLocation) {
            providerAccountLocation.textContent =
                provider.location ||
                "Not provided";
        }


        // ================= ADD SERVICE =================

        providerDashboard.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const message =
                    document.getElementById(
                        "serviceMessage"
                    );

                const serviceData = {

                    serviceName:
                        document
                            .getElementById("serviceName")
                            .value
                            .trim(),

                    category:
                        document
                            .getElementById("category")
                            .value
                            .trim(),

                    price:
                        Number(
                            document
                                .getElementById("price")
                                .value
                        ),

                    location:
                        document
                            .getElementById(
                                "serviceLocation"
                            )
                            .value
                            .trim(),

                    description:
                        document
                            .getElementById(
                                "description"
                            )
                            .value
                            .trim()
                };

                message.textContent =
                    "Adding your service...";

                message.style.color =
                    "#2563eb";


                try {

                    const response =
                        await fetch(
                            "http://localhost:8080/api/services/provider/"
                            + provider.userId,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        serviceData
                                    )
                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        message.textContent =
                            "Service added successfully!";

                        message.style.color =
                            "green";

                        providerDashboard.reset();

                        loadProviderServices();

                    } else {

                        message.textContent =
                            data.message ||
                            "Unable to add service.";

                        message.style.color =
                            "red";
                    }

                } catch (error) {

                    console.error(
                        "Add service error:",
                        error
                    );

                    message.textContent =
                        "Unable to connect to the server. Make sure Spring Boot is running.";

                    message.style.color =
                        "red";
                }
            }
        );

        loadProviderServices();
    }
}


// ================= LOAD PROVIDER SERVICES =================

async function loadProviderServices() {

    const serviceGrid =
        document.getElementById(
            "providerServiceGrid"
        );

    if (!serviceGrid) {
        return;
    }

    const provider =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    if (!provider) {
        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/services/provider/"
                + provider.userId
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load provider services"
            );
        }

        const services =
            await response.json();

        serviceGrid.innerHTML = "";

        if (services.length === 0) {

            serviceGrid.innerHTML = `
                <p>
                    You have not added any services yet.
                </p>
            `;

            return;
        }

        services.forEach(function (service) {

            const card =
                document.createElement("div");

            card.className =
                "dashboard-service-card";

            card.innerHTML = `

                <div class="dashboard-service-icon">
                    🛠️
                </div>

                <h3>
                    ${service.serviceName}
                </h3>

                <p>
                    ${service.description ||
                    "No description provided."}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${service.category}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${service.price}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${service.location ||
                    provider.location ||
                    "Not specified"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${service.active
                        ? "Active"
                        : "Inactive"}
                </p>
            `;

            serviceGrid.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Provider services error:",
            error
        );

        serviceGrid.innerHTML = `
            <p>
                Unable to load your services.
            </p>
        `;
    }
}

