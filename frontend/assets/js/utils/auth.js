// Authentication API functions

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
async function loginApi(email, password) {
    try {
        const response = await apiRequest(
            API_CONFIG.endpoints.auth.login,
            'POST',
            { email, password }, 'user'
        );
        console.log("utils/AUTH.JS : ",response.result.accessToken)
        // Store token and user data in localStorage
        if (response.result) {
            localStorage.setItem('token', response.result.accessToken);
            localStorage.setItem('user', JSON.stringify(response.result.user));
        }
        
        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
async function signupApi(userData) {
    try {
        const response = await apiRequest(
            API_CONFIG.endpoints.auth.signup,
            'POST',
            userData
        );
        
        // Store token and user data in localStorage
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Get the current user information
 * @returns {Promise} - API response with user data
 */
async function getCurrentUser() {
    try {
        return await apiRequest(API_CONFIG.endpoints.auth.me);
    } catch (error) {
        // If the error is an authentication error (401), clear localStorage
        if (error.message.includes('Unauthorized') || error.message.includes('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        throw error;
    }
}

/**
 * Check if the user is authenticated
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

/**
 * Get user data from localStorage
 * @returns {Object|null} - User data or null if not authenticated
 */
function getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}