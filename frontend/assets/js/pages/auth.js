/**
 * Login user 
 */
function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    // Call login API
    loginApi(email, password)
        .then(response => {
            showToast('Login successful!', 'success');
            console.log("response :::::: -------->>>> ",response)
            
            // Check if there's a redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            // Redirect after successful login
            setTimeout(() => {
                window.location.href = redirect || '../pages/products.html';
            }, 1000);
        })
        .catch(error => {
            // For demo purposes, allow mock login
            if (email === 'demo@example.com' && password === 'password') {
                // Set mock token and user
                localStorage.setItem('token', 'mock_token_12345');
                localStorage.setItem('user', JSON.stringify({
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@example.com'
                }));
                
                showToast('Demo login successful!', 'success');
                setTimeout(() => {
                    window.location.href = '../pages/products.html';
                }, 1000);
                
                return;
            }
            
            showToast(error.message || 'Login failed', 'error');
        });
}

/**
 * Sign up user
 */
function signupUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Call signup API
    signupApi({ name, email, password })
        .then(response => {
            showToast('Registration successful!', 'success');
            
            // Redirect after successful signup
            setTimeout(() => {
                window.location.href = '../pages/products.html';
            }, 1000);
        })
        .catch(error => {
            // For demo purposes, create a mock user
            if (email && password) {
                // Set mock token and user
                localStorage.setItem('token', 'mock_token_' + Date.now());
                localStorage.setItem('user', JSON.stringify({
                    id: Date.now(),
                    name,
                    email
                }));
                
                showToast('Demo registration successful!', 'success');
                setTimeout(() => {
                    window.location.href = '../pages/products.html';
                }, 1000);
                
                return;
            }
            
            showToast(error.message || 'Registration failed', 'error');
        });
}