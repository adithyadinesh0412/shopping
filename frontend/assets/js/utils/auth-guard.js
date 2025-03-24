/**
 * Check if user is logged in and update UI accordingly
 * @param {boolean|string} redirectIfLoggedIn - Whether to redirect if already logged in
 */
function checkLoggedIn(redirectIfLoggedIn = false) {
    
    const  isLoggedIn = isAuthenticated();
    
    // For login/signup pages, redirect to products if already logged in
    if (redirectIfLoggedIn && isLoggedIn) {
        window.location.href = redirectIfLoggedIn === true ? 'products.html' : redirectIfLoggedIn;
        return;
    }
    
    // For protected pages, redirect to login if not logged in
    const restrictedPages = ['cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage) && !isLoggedIn) {
        showToast('Please log in to access your cart', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=' + currentPage;
        }, 2000);
    }
    
    // Update navigation based on authentication state
    updateNavigation();
}

/**
 * Update navigation UI based on authentication state
 */
function updateNavigation() {
    const isLoggedIn = isAuthenticated();
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (isLoggedIn) {
        if (loginLink) loginLink.classList.add('d-none');
        if (signupLink) signupLink.classList.add('d-none');
        if (logoutLink) logoutLink.classList.remove('d-none');
    } else {
        if (loginLink) loginLink.classList.remove('d-none');
        if (signupLink) signupLink.classList.remove('d-none');
        if (logoutLink) logoutLink.classList.add('d-none');
    }
}