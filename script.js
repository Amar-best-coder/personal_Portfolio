// DOM Elements
const authModal = document.getElementById('authModal');
const portfolioContainer = document.getElementById('portfolioContainer');
const closeAuthBtn = document.getElementById('closeAuth');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
const signupTab = document.querySelector('.auth-tab[data-tab="signup"]');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const logoutBtn = document.getElementById('logoutBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Store user credentials (in a real app, this would be on a server)
const userCredentials = {
    email: null,
    password: null,
    name: null
};

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('portfolioLoggedIn');
    const hasSignedUp = localStorage.getItem('hasSignedUp');
    
    if (isLoggedIn === 'true') {
        authModal.classList.add('hidden');
        portfolioContainer.classList.add('show');
    } else {
        authModal.classList.remove('hidden');
        
        // If user hasn't signed up yet, show signup form first
        if (hasSignedUp !== 'true') {
            // Switch to signup tab by default
            authTabs.forEach(t => t.classList.remove('active'));
            signupTab.classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === 'signupForm') {
                    form.classList.add('active');
                }
            });
            
            // Disable login tab until signup is complete
            loginTab.style.pointerEvents = 'none';
            loginTab.style.opacity = '0.5';
        }
    }
    
    // Load saved credentials if they exist
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');
    const savedName = localStorage.getItem('userName');
    
    if (savedEmail && savedPassword) {
        userCredentials.email = savedEmail;
        userCredentials.password = savedPassword;
        userCredentials.name = savedName;
    }
});

// Switch between login and signup tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Don't allow switching to login if user hasn't signed up
        if (tabId === 'login' && localStorage.getItem('hasSignedUp') !== 'true') {
            alert('Please sign up first to create an account.');
            return;
        }
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${tabId}Form`) {
                form.classList.add('active');
            }
        });
    });
});

// Switch to signup from login footer
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    authTabs.forEach(t => t.classList.remove('active'));
    signupTab.classList.add('active');
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'signupForm') {
            form.classList.add('active');
        }
    });
});

// Switch to login from signup footer
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if user has signed up first
    if (localStorage.getItem('hasSignedUp') !== 'true') {
        alert('Please complete sign up first to create an account.');
        return;
    }
    
    authTabs.forEach(t => t.classList.remove('active'));
    loginTab.classList.add('active');
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'loginForm') {
            form.classList.add('active');
        }
    });
});

// Handle signup form submission (REQUIRED FIRST)
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    // Save user credentials
    userCredentials.email = email;
    userCredentials.password = password;
    userCredentials.name = name;
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    localStorage.setItem('userName', name);
    localStorage.setItem('hasSignedUp', 'true');
    
    // Enable login tab now that user has signed up
    loginTab.style.pointerEvents = 'auto';
    loginTab.style.opacity = '1';
    
    // Auto-fill login form with signup credentials
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = password;
    
    // Switch to login tab automatically
    authTabs.forEach(t => t.classList.remove('active'));
    loginTab.classList.add('active');
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'loginForm') {
            form.classList.add('active');
        }
    });
    
    // Show success message
    alert(`Account created successfully! You can now log in with your credentials.`);
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Check if user has signed up first
    if (localStorage.getItem('hasSignedUp') !== 'true') {
        alert('Please sign up first to create an account.');
        
        // Switch to signup form
        authTabs.forEach(t => t.classList.remove('active'));
        signupTab.classList.add('active');
        
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === 'signupForm') {
                form.classList.add('active');
            }
        });
        return;
    }
    
    // Check credentials against saved ones
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');
    
    if (email === savedEmail && password === savedPassword) {
        localStorage.setItem('portfolioLoggedIn', 'true');
        
        // Hide auth modal and show portfolio
        authModal.classList.add('hidden');
        portfolioContainer.classList.add('show');
        
        // Show success message
        const userName = localStorage.getItem('userName') || 'User';
        alert(`Login successful! Welcome ${userName}.`);
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Handle contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }
    
    // In a real app, you would send this data to a server
    // For demo, we'll just show a success message
    formSuccess.classList.add('show');
    
    // Reset form
    contactForm.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        formSuccess.classList.remove('show');
    }, 5000);
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('portfolioLoggedIn');
    
    portfolioContainer.classList.remove('show');
    authModal.classList.remove('hidden');
    
    // Reset forms
    loginForm.reset();
    contactForm.reset();
    formSuccess.classList.remove('show');
    
    // Switch back to login tab
    authTabs.forEach(t => t.classList.remove('active'));
    loginTab.classList.add('active');
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'loginForm') {
            form.classList.add('active');
        }
    });
});

// Close auth modal (optional - can be removed)
closeAuthBtn.addEventListener('click', () => {
    // Check if user has signed up
    if (localStorage.getItem('hasSignedUp') !== 'true') {
        alert('Please sign up first to create an account and view the portfolio.');
    } else {
        alert('Please log in to view the portfolio.');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a, .footer-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Update active nav link
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            if (this.parentElement.parentElement.classList.contains('nav')) {
                this.classList.add('active');
            }
            
            // Scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Add Font Awesome icons as fallback
document.addEventListener('DOMContentLoaded', function() {
    // Create style for custom icons
    const style = document.createElement('style');
    style.textContent = `
        .icon-laptop-code:before { content: "💻"; font-size: 48px; }
        .icon-design:before { content: "🎨"; font-size: 48px; }
        .icon-responsive:before { content: "📱"; font-size: 48px; }
        .icon-project-1:before { content: "📊"; font-size: 48px; }
        .icon-project-2:before { content: "🏋️"; font-size: 48px; }
        .icon-project-3:before { content: "✈️"; font-size: 48px; }
    `;
    document.head.appendChild(style);
});

