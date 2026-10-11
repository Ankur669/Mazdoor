/**
 * LocalServe - AI Chatbot Assistant (ServeBot)
 * Powered by Google Gemini API with Smart Local Fallback
 */

(function () {
    // Config & Storage Keys
    const STORAGE_KEY_API_KEY = "localserve_gemini_api_key";
    const STORAGE_KEY_MODEL = "localserve_gemini_model";
    const STORAGE_KEY_HISTORY = "localserve_chat_history";
    const DEFAULT_MODEL = "gemini-1.5-flash";

    // System prompt giving the AI full context about LocalServe
    const SYSTEM_PROMPT = `
You are ServeBot, the friendly, helpful, and professional AI Assistant for "LocalServe", a local service marketplace web application.
Your goal is to assist customers and service providers navigating and using the LocalServe platform.

Key Information about LocalServe:
1. Platform Purpose: Connects customers with trusted local professionals for home and everyday services.
2. User Roles:
   - CUSTOMER: Can search/browse services, view service details, book services, track booking status, and view booking history.
   - PROVIDER: Can register, list their offered services, view incoming booking requests, accept/reject or update booking status (Pending, Confirmed, Completed, Cancelled).
   - ADMIN: Manages users and services.
3. Available Service Categories & Common Services:
   - Home & Property: Plumbing (pipe repair, leak fixing), Electrical (wiring, appliances), Cleaning (deep clean, house cleaning), Gardening/Landscaping, Carpentry, Pest Control.
   - Beauty & Personal Care: Salon at home, Hair stylists, Makeup & Mehndi artists, Spa.
   - Automotive & Transport: Drivers, Car/Bike wash, Mechanics, Roadside assistance.
   - Repairs & Maintenance: AC repair, Refrigerator service, TV repair, general appliance fixes.
4. How to Book a Service:
   - Step 1: Create an account or Log in as a Customer.
   - Step 2: Search or browse available services on the Home page or Customer Dashboard.
   - Step 3: Click "Book Now" on the service card, select date & time, specify your location and requirements.
   - Step 4: Track the booking status in the Customer Dashboard under "My Bookings".
5. Contact & Support:
   - Support is available 24/7 via this chatbot and LocalServe help center.

Guidelines for your responses:
- Be polite, concise, structured, and helpful.
- Use formatting like bullet points or bold text where helpful.
- If recommending a service, encourage them to visit the Customer Dashboard or Search bar on the homepage.
- Always provide clear step-by-step instructions when users ask how to do something on the site.
- Keep answers focused on LocalServe and everyday home/local services.
`;

    // Local Knowledge Base for Offline/No-API-Key Fallback
    const KNOWLEDGE_BASE = [
        {
            triggers: ["hi", "hello", "hey", "start", "greetings"],
            response: `👋 Hello there! Welcome to **LocalServe**! I'm **ServeBot**, your AI assistant.

I can help you:
• 🔍 Find local professionals (Plumbers, Electricians, Cleaners, etc.)
• 📅 Learn how to book a service
• 💼 Guide you on becoming a service provider
• 📋 Check booking statuses

What service are you looking for today?`,
            actions: [
                { label: "🔍 Find Services", query: "What services do you offer?" },
                { label: "📅 How to Book", query: "How do I book a service?" },
                { label: "💼 Become Provider", query: "How to register as provider?" }
            ]
        },
        {
            triggers: ["plumber", "plumbing", "pipe", "leak", "tap"],
            response: `🚰 **Plumbing Services on LocalServe**:

Our verified plumbers can assist you with:
• Pipe leak repairs & burst pipes
• Tap, shower, and faucet installation/repair
• Drain cleaning & blockage removal
• Bathroom & kitchen sanitary fittings

👉 You can search for "Plumbing" on the Home page or your Customer Dashboard to view providers and book immediately!`,
            actions: [
                { label: "Explore Home Services", link: "index.html#services" },
                { label: "Go to Dashboard", link: "customer-dashboard.html" }
            ]
        },
        {
            triggers: ["electric", "electrician", "wiring", "fan", "switch", "light"],
            response: `⚡ **Electrical Services on LocalServe**:

Certified electricians can help you with:
• Switchboard & socket repair
• Ceiling fan and light installation
• Short circuit and fuse repairs
• Home rewiring and appliance safety checks

👉 Visit your **Customer Dashboard** to book a qualified electrician near your location.`,
            actions: [
                { label: "Find Electricians", link: "customer-dashboard.html" }
            ]
        },
        {
            triggers: ["clean", "cleaning", "maid", "deep cleaning", "housekeeping", "sanitization"],
            response: `🧹 **Cleaning Services on LocalServe**:

Top-rated cleaners are available for:
• Full Home Deep Cleaning
• Kitchen & Bathroom Sanitization
• Sofa, Carpet & Mattress cleaning
• Move-in / Move-out cleaning`,
            actions: [
                { label: "Browse Cleaning", link: "index.html#services" }
            ]
        },
        {
            triggers: ["book", "booking", "how to book", "order", "schedule"],
            response: `📅 **How to Book a Service on LocalServe**:

1. **Log in**: Sign in to your Customer account at [Login](login.html).
2. **Find Service**: Search for your required service or category.
3. **Select Provider**: Compare provider ratings and prices.
4. **Schedule**: Click **Book Now**, choose your preferred date and time, and enter your address.
5. **Confirmation**: Your booking will appear in **My Bookings** on your dashboard.`,
            actions: [
                { label: "Login to Book", link: "login.html" },
                { label: "Create Account", link: "register.html" }
            ]
        },
        {
            triggers: ["provider", "become provider", "join as provider", "sell service", "earn"],
            response: `💼 **Become a Service Provider on LocalServe**:

Grow your business by offering services to nearby customers:
1. Go to [Register](register.html).
2. Choose **Service Provider** as your role.
3. Complete your profile and list your services, pricing, and coverage area.
4. Receive and manage customer bookings directly in your **Provider Dashboard**!`,
            actions: [
                { label: "Register as Provider", link: "register.html" }
            ]
        },
        {
            triggers: ["status", "my booking", "track", "check booking"],
            response: `📋 **Checking Your Booking Status**:

You can track all active, completed, or pending bookings:
1. Log in to your account.
2. Go to **Customer Dashboard**.
3. Under the **My Bookings** section, you will see real-time status updates:
   • 🟡 **Pending**: Awaiting provider confirmation
   • 🟢 **Confirmed / Accepted**: Provider is assigned
   • 🔵 **In Progress / Completed**: Service fulfilled`,
            actions: [
                { label: "My Dashboard", link: "customer-dashboard.html" }
            ]
        },
        {
            triggers: ["cancel", "reschedule", "refund"],
            response: `🔄 **Cancellations & Rescheduling**:

You can cancel or reschedule bookings directly from your **Customer Dashboard** before the service provider has arrived. Simply click on your booking details to manage or cancel it.`,
            actions: [
                { label: "Open Dashboard", link: "customer-dashboard.html" }
            ]
        },
        {
            triggers: ["services", "categories", "what services", "list"],
            response: `🛠️ **LocalServe Service Categories**:

• 🏠 **Home & Property**: Plumbing, Electrical, Cleaning, Gardening, Pest Control
• 🔧 **Repairs & Maintenance**: AC, Refrigerator, TV, Washing Machine repair
• 💄 **Beauty & Personal Care**: Salon at home, Spa, Makeup artists
• 🚗 **Automotive & Transport**: Professional Drivers, Car/Bike wash, Mechanics`,
            actions: [
                { label: "Explore All Categories", link: "index.html#services" }
            ]
        },
        {
            triggers: ["api key", "gemini", "ai setting", "configure"],
            response: `🤖 **Gemini AI Integration**:

You can connect your own free **Google Gemini API Key** for unlimited generative responses!
1. Click the **⚙️ (Settings)** icon in the top right of this chat window.
2. Paste your Google AI Studio API Key.
3. Click **Save Settings**!

Get a free key at: [Google AI Studio](https://aistudio.google.com/app/apikey)`
        }
    ];

    // Helper: Find fallback response
    function getFallbackResponse(query) {
        const lower = query.toLowerCase().trim();
        for (const item of KNOWLEDGE_BASE) {
            for (const trigger of item.triggers) {
                if (lower.includes(trigger)) {
                    return { text: item.response, actions: item.actions || [] };
                }
            }
        }

        // Generic fallback
        return {
            text: `I'm here to help with LocalServe services (Plumbing, Electrical, Cleaning, Beauty, Drivers, etc.) and bookings!

Would you like help finding a specific service, learning how to book, or setting up your free **Google Gemini API Key** for full conversational AI?`,
            actions: [
                { label: "🔍 Browse Services", link: "index.html#services" },
                { label: "📅 How to Book", query: "How do I book a service?" },
                { label: "⚙️ Setup Gemini AI", openSettings: true }
            ]
        };
    }

    // Markdown Parser (safe and lightweight)
    function formatMessageText(text) {
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Bold
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Italic
        escaped = escaped.replace(/\*(.*?)\*/g, "<em>$1</em>");
        // Markdown Links
        escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Bullet points
        const lines = escaped.split("\n");
        let formatted = "";
        let inList = false;

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                if (!inList) {
                    formatted += "<ul>";
                    inList = true;
                }
                formatted += `<li>${trimmed.substring(2)}</li>`;
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (!inList) {
                    formatted += "<ol>";
                    inList = true;
                }
                formatted += `<li>${trimmed.replace(/^\d+\.\s/, "")}</li>`;
            } else {
                if (inList) {
                    formatted += inList.includes("<ol>") ? "</ol>" : "</ul>";
                    inList = false;
                }
                if (trimmed.length > 0) {
                    formatted += `<p>${line}</p>`;
                }
            }
        }
        if (inList) {
            formatted += inList.includes("<ol>") ? "</ol>" : "</ul>";
        }
        return formatted;
    }

    // Chatbot Controller Class
    class LocalServeChatbot {
        constructor() {
            this.isOpen = false;
            this.isTyping = false;
            this.messages = [];
            this.init();
        }

        init() {
            this.renderDOM();
            this.bindEvents();
            this.loadStoredSettings();
            this.loadHistory();
            this.updateBannerStatus();
        }

        getApiKey() {
            return localStorage.getItem(STORAGE_KEY_API_KEY) || "";
        }

        getModel() {
            return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
        }

        getLoggedInUser() {
            try {
                return JSON.parse(localStorage.getItem("loggedInUser"));
            } catch (e) {
                return null;
            }
        }

        renderDOM() {
            // Widget Container
            const widget = document.createElement("div");
            widget.id = "localserve-chatbot-root";
            widget.innerHTML = `
                <!-- Launcher Button -->
                <button class="ls-chat-launcher" id="lsChatLauncher" aria-label="Open LocalServe AI Assistant">
                    <div class="ls-chat-pulse"></div>
                    <span class="ls-chat-launcher-icon" id="lsLauncherIcon">💬</span>
                    <span class="ls-chat-badge" id="lsChatBadge">1</span>
                    <div class="ls-chat-tooltip">Ask LocalServe AI</div>
                </button>

                <!-- Chat Window -->
                <div class="ls-chat-window" id="lsChatWindow">
                    <!-- Header -->
                    <div class="ls-chat-header">
                        <div class="ls-chat-header-profile">
                            <div class="ls-chat-avatar">
                                🤖
                                <span class="ls-avatar-status-dot"></span>
                            </div>
                            <div class="ls-chat-header-info">
                                <h3>ServeBot AI</h3>
                                <p><span class="ls-status-pill">LocalServe Assistant</span></p>
                            </div>
                        </div>
                        <div class="ls-chat-header-actions">
                            <button class="ls-header-btn" id="lsSettingsBtn" title="AI Settings (Gemini API Key)">⚙️</button>
                            <button class="ls-header-btn" id="lsClearBtn" title="Clear Conversation">🗑️</button>
                            <button class="ls-header-btn" id="lsCloseBtn" title="Minimize Chat">✕</button>
                        </div>
                    </div>

                    <!-- Status Banner -->
                    <div class="ls-chat-banner" id="lsChatBanner">
                        <span class="ls-banner-key-tag" id="lsBannerTag">
                            <span id="lsBannerIcon">⚡</span>
                            <span id="lsBannerText">Gemini Ready</span>
                        </span>
                        <span class="ls-banner-action-link" id="lsBannerLink">Settings</span>
                    </div>

                    <!-- Messages List -->
                    <div class="ls-chat-messages" id="lsChatMessages"></div>

                    <!-- Quick Suggestions Chips -->
                    <div class="ls-chat-suggestions" id="lsChatSuggestions">
                        <button class="ls-suggestion-chip" data-query="Find a plumber near me">🚰 Plumber</button>
                        <button class="ls-suggestion-chip" data-query="Find an electrician">⚡ Electrician</button>
                        <button class="ls-suggestion-chip" data-query="Home cleaning service">🧹 Cleaning</button>
                        <button class="ls-suggestion-chip" data-query="How do I book a service?">📅 How to Book?</button>
                        <button class="ls-suggestion-chip" data-query="How to register as service provider?">💼 Become Provider</button>
                    </div>

                    <!-- Footer Input -->
                    <div class="ls-chat-footer">
                        <div class="ls-chat-input-wrapper">
                            <textarea
                                class="ls-chat-input"
                                id="lsChatInput"
                                placeholder="Ask anything about services, bookings..."
                                rows="1"
                            ></textarea>
                            <button class="ls-send-btn" id="lsSendBtn" title="Send message">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div class="ls-chat-disclaimer">LocalServe AI Assistant • Instant home service support</div>
                    </div>

                    <!-- Settings Modal -->
                    <div class="ls-settings-modal" id="lsSettingsModal">
                        <div class="ls-settings-card">
                            <div class="ls-settings-header">
                                <h4>⚙️ AI Assistant Settings</h4>
                                <button class="ls-settings-close" id="lsSettingsClose">✕</button>
                            </div>
                            <div class="ls-settings-body">
                                <div class="ls-form-field">
                                    <label for="lsApiKeyInput">Google Gemini API Key:</label>
                                    <input type="password" id="lsApiKeyInput" placeholder="Enter AI Studio API Key (AIzaSy...)" autocomplete="off">
                                    <p class="ls-settings-hint">
                                        Get a free Gemini API key with Google AI Studio:
                                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Get Free Key ↗</a>
                                        <br><em>If left blank, the bot automatically uses our smart local knowledge engine!</em>
                                    </p>
                                </div>
                                <div class="ls-form-field">
                                    <label for="lsModelSelect">Gemini Model:</label>
                                    <select id="lsModelSelect">
                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended & Fast)</option>
                                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                    </select>
                                </div>
                                <div class="ls-settings-footer">
                                    <button class="ls-btn-secondary" id="lsClearKeyBtn">Remove Key</button>
                                    <button class="ls-btn-primary" id="lsSaveSettingsBtn">Save Settings</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(widget);

            // Save DOM references
            this.dom = {
                launcher: document.getElementById("lsChatLauncher"),
                launcherIcon: document.getElementById("lsLauncherIcon"),
                window: document.getElementById("lsChatWindow"),
                closeBtn: document.getElementById("lsCloseBtn"),
                clearBtn: document.getElementById("lsClearBtn"),
                settingsBtn: document.getElementById("lsSettingsBtn"),
                settingsModal: document.getElementById("lsSettingsModal"),
                settingsClose: document.getElementById("lsSettingsClose"),
                saveSettingsBtn: document.getElementById("lsSaveSettingsBtn"),
                clearKeyBtn: document.getElementById("lsClearKeyBtn"),
                apiKeyInput: document.getElementById("lsApiKeyInput"),
                modelSelect: document.getElementById("lsModelSelect"),
                bannerTag: document.getElementById("lsBannerTag"),
                bannerIcon: document.getElementById("lsBannerIcon"),
                bannerText: document.getElementById("lsBannerText"),
                bannerLink: document.getElementById("lsBannerLink"),
                messagesContainer: document.getElementById("lsChatMessages"),
                suggestions: document.getElementById("lsChatSuggestions"),
                input: document.getElementById("lsChatInput"),
                sendBtn: document.getElementById("lsSendBtn")
            };
        }

        bindEvents() {
            // Toggle window
            this.dom.launcher.addEventListener("click", () => this.toggleWindow());
            this.dom.closeBtn.addEventListener("click", () => this.closeWindow());

            // Clear chat
            this.dom.clearBtn.addEventListener("click", () => {
                if (confirm("Clear this conversation history?")) {
                    this.clearHistory();
                }
            });

            // Settings modal
            this.dom.settingsBtn.addEventListener("click", () => this.openSettings());
            this.dom.bannerLink.addEventListener("click", () => this.openSettings());
            this.dom.settingsClose.addEventListener("click", () => this.closeSettings());
            this.dom.saveSettingsBtn.addEventListener("click", () => this.saveSettings());
            this.dom.clearKeyBtn.addEventListener("click", () => this.clearKey());

            // Input handlers
            this.dom.sendBtn.addEventListener("click", () => this.handleSend());
            this.dom.input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });

            // Auto-resize textarea
            this.dom.input.addEventListener("input", () => {
                this.dom.input.style.height = "auto";
                this.dom.input.style.height = Math.min(this.dom.input.scrollHeight, 90) + "px";
            });

            // Suggestion chips
            this.dom.suggestions.addEventListener("click", (e) => {
                const chip = e.target.closest(".ls-suggestion-chip");
                if (chip && chip.dataset.query) {
                    this.sendMessage(chip.dataset.query);
                }
            });
        }

        toggleWindow() {
            this.isOpen ? this.closeWindow() : this.openWindow();
        }

        openWindow() {
            this.isOpen = true;
            this.dom.window.classList.add("open");
            this.dom.launcher.classList.add("active");
            this.dom.launcherIcon.textContent = "✕";
            setTimeout(() => this.dom.input.focus(), 300);
            this.scrollToBottom();
        }

        closeWindow() {
            this.isOpen = false;
            this.dom.window.classList.remove("open");
            this.dom.launcher.classList.remove("active");
            this.dom.launcherIcon.textContent = "💬";
        }

        openSettings() {
            this.dom.apiKeyInput.value = this.getApiKey();
            this.dom.modelSelect.value = this.getModel();
            this.dom.settingsModal.classList.add("active");
        }

        closeSettings() {
            this.dom.settingsModal.classList.remove("active");
        }

        saveSettings() {
            const key = this.dom.apiKeyInput.value.trim();
            const model = this.dom.modelSelect.value;

            if (key) {
                localStorage.setItem(STORAGE_KEY_API_KEY, key);
            } else {
                localStorage.removeItem(STORAGE_KEY_API_KEY);
            }
            localStorage.setItem(STORAGE_KEY_MODEL, model);

            this.closeSettings();
            this.updateBannerStatus();
            alert("Settings saved successfully!");
        }

        clearKey() {
            localStorage.removeItem(STORAGE_KEY_API_KEY);
            this.dom.apiKeyInput.value = "";
            this.closeSettings();
            this.updateBannerStatus();
            alert("API key removed. ServeBot will use the built-in local knowledge engine.");
        }

        loadStoredSettings() {
            this.dom.apiKeyInput.value = this.getApiKey();
            this.dom.modelSelect.value = this.getModel();
        }

        updateBannerStatus() {
            const key = this.getApiKey();
            if (key) {
                this.dom.bannerTag.className = "ls-banner-key-tag connected";
                this.dom.bannerIcon.textContent = "✨";
                this.dom.bannerText.textContent = `Gemini AI Connected (${this.getModel()})`;
            } else {
                this.dom.bannerTag.className = "ls-banner-key-tag fallback";
                this.dom.bannerIcon.textContent = "⚡";
                this.dom.bannerText.textContent = "Local Knowledge Engine (Add API Key for Full AI)";
            }
        }

        loadHistory() {
            let saved = [];
            try {
                saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY_HISTORY) || "[]");
            } catch (e) {
                saved = [];
            }

            if (saved.length > 0) {
                this.messages = saved;
                this.messages.forEach(msg => this.renderMessage(msg));
            } else {
                // Send customized welcome message
                const user = this.getLoggedInUser();
                const userName = user && user.name ? user.name : "there";
                const welcomeText = `👋 Hello **${userName}**! Welcome to **LocalServe**.

I'm **ServeBot**, your AI assistant. How can I help you today?
• 🔍 Search services (Plumbing, Electrical, Cleaning, Beauty, etc.)
• 📅 Guide you on making a booking
• 📋 Check your booking status`;

                const welcomeMsg = {
                    sender: "bot",
                    text: welcomeText,
                    time: this.getCurrentTime(),
                    actions: [
                        { label: "🚰 Find Plumber", query: "I need a plumber" },
                        { label: "⚡ Find Electrician", query: "I need an electrician" },
                        { label: "📅 How to book", query: "How do I book a service?" }
                    ]
                };
                this.messages.push(welcomeMsg);
                this.renderMessage(welcomeMsg);
                this.saveHistory();
            }
        }

        saveHistory() {
            sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.messages));
        }

        clearHistory() {
            this.messages = [];
            sessionStorage.removeItem(STORAGE_KEY_HISTORY);
            this.dom.messagesContainer.innerHTML = "";
            this.loadHistory();
        }

        getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }

        renderMessage(msg) {
            const group = document.createElement("div");
            group.className = `ls-msg-group ${msg.sender}`;

            let actionsHtml = "";
            if (msg.actions && msg.actions.length > 0) {
                actionsHtml = '<div class="ls-msg-actions">';
                for (const act of msg.actions) {
                    if (act.link) {
                        actionsHtml += `<a href="${act.link}" class="ls-action-btn">🔗 ${act.label}</a>`;
                    } else if (act.query) {
                        actionsHtml += `<button class="ls-action-btn ls-query-btn" data-query="${act.query}">💬 ${act.label}</button>`;
                    } else if (act.openSettings) {
                        actionsHtml += `<button class="ls-action-btn ls-settings-trigger">⚙️ ${act.label}</button>`;
                    }
                }
                actionsHtml += "</div>";
            }

            group.innerHTML = `
                <div class="ls-msg-bubble">
                    ${formatMessageText(msg.text)}
                    ${actionsHtml}
                </div>
                <span class="ls-msg-time">${msg.time}</span>
            `;

            // Bind click handlers on internal buttons
            group.querySelectorAll(".ls-query-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    this.sendMessage(btn.dataset.query);
                });
            });

            group.querySelectorAll(".ls-settings-trigger").forEach(btn => {
                btn.addEventListener("click", () => {
                    this.openSettings();
                });
            });

            this.dom.messagesContainer.appendChild(group);
            this.scrollToBottom();
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;
            const typing = document.createElement("div");
            typing.id = "lsTypingIndicator";
            typing.className = "ls-typing-indicator";
            typing.innerHTML = `
                <span class="ls-typing-dot"></span>
                <span class="ls-typing-dot"></span>
                <span class="ls-typing-dot"></span>
            `;
            this.dom.messagesContainer.appendChild(typing);
            this.scrollToBottom();
        }

        hideTyping() {
            this.isTyping = false;
            const typing = document.getElementById("lsTypingIndicator");
            if (typing) typing.remove();
        }

        scrollToBottom() {
            setTimeout(() => {
                this.dom.messagesContainer.scrollTop = this.dom.messagesContainer.scrollHeight;
            }, 50);
        }

        handleSend() {
            const query = this.dom.input.value.trim();
            if (!query) return;
            this.dom.input.value = "";
            this.dom.input.style.height = "auto";
            this.sendMessage(query);
        }

        async sendMessage(query) {
            // Render user message
            const userMsg = {
                sender: "user",
                text: query,
                time: this.getCurrentTime()
            };
            this.messages.push(userMsg);
            this.renderMessage(userMsg);
            this.saveHistory();

            this.showTyping();
            this.dom.sendBtn.disabled = true;

            try {
                const apiKey = this.getApiKey();
                let reply = null;

                if (apiKey) {
                    // Call Gemini API
                    reply = await this.callGeminiAPI(query, apiKey);
                }

                // If no API key or API call returned null, use smart local fallback
                if (!reply) {
                    const fallback = getFallbackResponse(query);
                    reply = {
                        text: fallback.text,
                        actions: fallback.actions
                    };
                }

                const botMsg = {
                    sender: "bot",
                    text: reply.text,
                    actions: reply.actions || [],
                    time: this.getCurrentTime()
                };

                this.messages.push(botMsg);
                this.renderMessage(botMsg);
                this.saveHistory();
            } catch (err) {
                console.error("Chat error:", err);
                const fallback = getFallbackResponse(query);
                const botMsg = {
                    sender: "bot",
                    text: fallback.text,
                    actions: fallback.actions || [],
                    time: this.getCurrentTime()
                };
                this.messages.push(botMsg);
                this.renderMessage(botMsg);
                this.saveHistory();
            } finally {
                this.hideTyping();
                this.dom.sendBtn.disabled = false;
            }
        }

        async callGeminiAPI(userQuery, apiKey) {
            const model = this.getModel();
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const user = this.getLoggedInUser();
            const userContext = user
                ? `Logged in user: Name="${user.name}", Email="${user.email}", Role="${user.role}".`
                : "User is currently a guest / not logged in.";

            // Format past conversation for multi-turn chat (up to last 6 messages)
            const recent = this.messages.slice(-6);
            const contents = [];

            // Add system instructions & context
            contents.push({
                role: "user",
                parts: [{ text: `${SYSTEM_PROMPT}\n\nContext for current user: ${userContext}` }]
            });
            contents.push({
                role: "model",
                parts: [{ text: "Understood! I am ServeBot, ready to assist LocalServe customers and service providers." }]
            });

            recent.forEach(m => {
                if (m.sender === "user") {
                    contents.push({ role: "user", parts: [{ text: m.text }] });
                } else if (m.sender === "bot") {
                    contents.push({ role: "model", parts: [{ text: m.text }] });
                }
            });

            // Add current query
            contents.push({
                role: "user",
                parts: [{ text: userQuery }]
            });

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: contents,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 600
                        }
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    console.warn("Gemini API call failed:", response.status, errData);
                    return null; // triggers local fallback gracefully
                }

                const data = await response.json();
                const candidates = data.candidates;
                if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
                    const text = candidates[0].content.parts.map(p => p.text).join("");
                    return { text: text.trim() };
                }
                return null;
            } catch (e) {
                console.warn("Fetch to Gemini API error:", e);
                return null;
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => new LocalServeChatbot());
    } else {
        new LocalServeChatbot();
    }
})();
