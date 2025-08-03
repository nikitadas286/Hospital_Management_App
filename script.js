 // Navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
            
            // Auth dropdown toggle
            const authDropdownBtn = document.getElementById('auth-dropdown-btn');
            const authDropdown = document.getElementById('auth-dropdown');
            
            authDropdownBtn.addEventListener('click', function() {
                authDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!authDropdownBtn.contains(event.target) && !authDropdown.contains(event.target)) {
                    authDropdown.classList.add('hidden');
                }
            });
            
            // Page navigation
            const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a, #auth-dropdown a, footer a[href^="#"]');
            const pages = document.querySelectorAll('.page');
            
            // Function to show a specific page and hide others
            function showPage(pageId) {
                pages.forEach(page => {
                    if (page.id === pageId + '-page') {
                        page.classList.remove('hidden');
                        page.classList.add('active');
                    } else {
                        page.classList.add('hidden');
                        page.classList.remove('active');
                    }
                });

                // Update active nav link
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + pageId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }

            // Listen for navigation clicks
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const pageId = href.substring(1);
                        showPage(pageId);
                        // Close mobile menu after navigation
                        if (!mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                        // Close auth dropdown after navigation
                        if (!authDropdown.classList.contains('hidden')) {
                            authDropdown.classList.add('hidden');
                        }
                    }
                });
            });
            
            // Optionally, show the correct page on load based on hash
            if (window.location.hash) {
                const pageId = window.location.hash.substring(1);
                showPage(pageId);
            } else {
                showPage('home');
            }
        });
        
        // --- User Registration ---
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.onsubmit = function(e) {
                e.preventDefault();
                const firstname = document.getElementById('register-firstname').value.trim();
                const lastname = document.getElementById('register-lastname').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value;
                const confirm = document.getElementById('register-confirm-password').value;
                const terms = document.getElementById('terms').checked;

                // Simple validation (add more as needed)
                if (!firstname || !lastname || !email || !password || !confirm || !terms) {
                    alert("Please fill all fields and accept terms.");
                    return;
                }
                if (password !== confirm) {
                    alert("Passwords do not match.");
                    return;
                }
                // Save user to localStorage (for demo only, not secure)
                localStorage.setItem('medicare-user', JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password
                }));
                alert("Registration successful! Please sign in.");
                window.location.hash = "#login";
                // Optionally, auto-fill email on login page
                setTimeout(() => {
                    const loginEmail = document.getElementById('login-email');
                    if (loginEmail) loginEmail.value = email;
                }, 500);
            };
        }

        // --- User Login ---
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.onsubmit = function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                const user = JSON.parse(localStorage.getItem('medicare-user') || '{}');
                if (user.email === email && user.password === password) {
                    // Save login state
                    localStorage.setItem('medicare-loggedin', 'true');
                    localStorage.setItem('medicare-username', user.firstname);
                    alert("Login successful!");
                    // Show home page and update greeting
                    window.location.hash = "#home";
                    showGreeting();
                } else {
                    alert("Invalid email or password.");
                }
            };
        }

        // --- Show greeting on Home page if logged in ---
        function showGreeting() {
            const username = localStorage.getItem('medicare-username');
            const homePage = document.getElementById('home-page');
            if (username && homePage) {
                let greetDiv = document.getElementById('user-greeting');
                if (!greetDiv) {
                    greetDiv = document.createElement('div');
                    greetDiv.id = 'user-greeting';
                    greetDiv.className = "text-xl font-semibold text-blue-800 mb-4";
                    // Insert greeting at the top of the home page
                    homePage.querySelector('.container')?.prepend(greetDiv);
                }
                greetDiv.textContent = `Hello, ${username}!`;
            }
        }

        // Call showGreeting on page load and after login
        document.addEventListener('DOMContentLoaded', showGreeting);
        window.addEventListener('hashchange', function() {
            if (window.location.hash === "#home") showGreeting();
        });
        
        // Add this inside your <script> tag, after DOMContentLoaded

        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.onsubmit = function(e) {
                e.preventDefault();
                const name = document.getElementById('appointment-name').value.trim();
                const email = document.getElementById('appointment-email').value.trim();
                const phone = document.getElementById('appointment-phone').value.trim();
                const department = document.getElementById('appointment-department').value;
                const date = document.getElementById('appointment-date').value;

                if (!name || !email || !phone || !department || !date) {
                    alert("Please fill all required fields.");
                    return;
                }

                // Show confirmation modal with dynamic info
                const modal = document.getElementById('appointment-modal');
                const modalTitle = modal.querySelector('h3');
                const modalMsg = modal.querySelector('.text-sm.text-gray-500');
                modalTitle.textContent = "Appointment Booked Successfully!";
                modalMsg.innerHTML = `Your appointment has been scheduled for <strong>${date}</strong> in the <strong>${department}</strong> department. We'll send a confirmation to your email.`;

                modal.classList.remove('hidden');
            };
        }

        // Close modal functionality
        document.getElementById('close-modal')?.addEventListener('click', function() {
            const modal = document.getElementById('appointment-modal');
            modal.classList.add('hidden');
        });