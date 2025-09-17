// --- 1. INITIALIZATION ---
// Initialize PocketBase client with your instance URL
const pb = new PocketBase('https://pb.flashreport.rest');

// --- 2. DOM ELEMENT SELECTION ---
// Forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Inputs
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupPasswordConfirmInput = document.getElementById('signup-password-confirm');

// Buttons & Tabs
const showLoginBtn = document.getElementById('show-login-btn');
const showSignupBtn = document.getElementById('show-signup-btn');

// Message Area
const messageArea = document.getElementById('message-area');

// --- 3. HELPER FUNCTIONS ---
/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {'success'|'error'} type - The type of message.
 */
function showMessage(message, type) {
    messageArea.textContent = message;
    messageArea.className = type; // Applies .success or .error CSS class
}

// --- 4. EVENT HANDLERS ---
/**
 * Handles the user login process.
 */
async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission
    showMessage('', ''); // Clear previous messages

    try {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Authenticate user with password
        const authData = await pb.collection('users').authWithPassword(email, password);

        // Handle successful login
        console.log('Login successful!', authData);
        showMessage('Successfully logged in!', 'success');

        // Redirect the user to the main page
        window.location.href = 'main.html';

    } catch (error) {
        console.error('Login failed:', error.message);
        showMessage(`Login failed: ${error.message}`, 'error');
    }
}

/**
 * Handles the new user sign-up process.
 */
async function handleSignUp(event) {
    event.preventDefault();
    showMessage('', '');

    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const passwordConfirm = signupPasswordConfirmInput.value;

    // Basic client-side validation
    if (password !== passwordConfirm) {
        showMessage('Passwords do not match.', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long.', 'error');
        return;
    }

    try {
        // Data to be sent to PocketBase to create a new user
        const newUser = {
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
            username: email.split('@')[0], // Set username from email
            balance: 0 // Initialize balance
        };

        // Create a new user record
        const record = await pb.collection('users').create(newUser);

        console.log('Sign up successful!', record);
        showMessage('Account created successfully! Please log in.', 'success');
        signupForm.reset(); // Clear the form

    } catch (error) {
        console.error('Sign up failed:', error.message);
        showMessage(`Sign up failed: ${error.message}`, 'error');
    }
}


// --- 5. EVENT LISTENERS ---
// Attach event listeners to forms
loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignUp);

// Tab switching logic
showLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    showLoginBtn.classList.add('active');
    showSignupBtn.classList.remove('active');
    showMessage('', ''); // Clear messages on tab switch
});

showSignupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    showLoginBtn.classList.remove('active');
    showSignupBtn.classList.add('active');
    showMessage('', '');
});