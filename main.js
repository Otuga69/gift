// --- 1. INITIALIZATION ---
const pb = new PocketBase('https://pb.flashreport.rest');

// --- 2. DOM ELEMENT SELECTION ---
const profileBtn = document.getElementById('profile-btn');
const profileDetails = document.getElementById('profile-details');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userVerified = document.getElementById('user-verified');
const userBalance = document.getElementById('user-balance');
const logoutBtn = document.getElementById('logout-btn');
const giftCardGrid = document.getElementById('gift-card-grid');

// --- 3. FUNCTIONS ---

/**
 * Fetches and displays gift cards from the 'content' collection.
 */
async function loadGiftCards() {
    try {
        const records = await pb.collection('content').getFullList({
            sort: '-created',
        });

        giftCardGrid.innerHTML = ''; // Clear existing content
        records.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            
            const imageUrl = pb.getFileUrl(card, card.image);

            cardElement.innerHTML = `
                <img src="${imageUrl}" alt="${card.giftname}">
                <div class="card-content">
                    <h3>${card.giftname}</h3>
                    <p class="price">$${card.price}</p>
                </div>
            `;
            giftCardGrid.appendChild(cardElement);
        });

    } catch (error) {
        console.error('Failed to load gift cards:', error.message);
        giftCardGrid.innerHTML = '<p>Could not load gift cards.</p>';
    }
}

/**
 * Fetches and displays the current user's data.
 */
async function loadUserProfile() {
    if (!pb.authStore.isValid) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const user = pb.authStore.model;
        userName.textContent = user.username;
        userEmail.textContent = user.email;
        userVerified.textContent = user.verified ? 'Yes' : 'No';
        userBalance.textContent = user.balance;

    } catch (error) {
        console.error('Failed to load user profile:', error.message);
        if (!pb.authStore.isValid) {
            window.location.href = 'index.html';
        }
    }
}

/**
 * Toggles the visibility of the profile details dropdown.
 */
function toggleProfileDetails() {
    profileDetails.classList.toggle('hidden');
}

/**
 * Logs the user out.
 */
function handleLogout() {
    pb.authStore.clear();
    window.location.href = 'index.html';
}

// --- 4. EVENT LISTENERS ---
profileBtn.addEventListener('click', toggleProfileDetails);
logoutBtn.addEventListener('click', handleLogout);

// --- 5. INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadGiftCards();
});