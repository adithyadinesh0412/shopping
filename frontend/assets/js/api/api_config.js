// API Configuration
const API_CONFIG = {
    baseUrl: 'http://localhost:3031/commerce/v1', // Change this to your actual API URL
    userBaseUrl : "http://localhost:3030/user/v1",
    endpoints: {
        auth: {
            login: '/users/login',
            signup: '/users/signUp',
            me: '/auth/me'
        },
        products: {
            list: '/products/list'
        },
        cart: {
            get: '/cart',
            add: '/cart/add',
            update: '/cart/update',
            remove: '/cart/remove',
            clear: '/cart/clear',
            checkout: '/cart/checkout'
        }
    },
    headers: {
        'Content-Type': 'application/json'
    },
    getAuthHeader: function() {
        const token = localStorage.getItem('token');
        console.log("TOKEN ::::: ------------>> " , token , { 'X-auth-token': `bearer ${token}` })
        token
        return token ? { 'X-auth-token': `bearer ${token}` } : {};
    }
};

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null , service = 'commerce') {
    const url = service == 'user' ? `${API_CONFIG.userBaseUrl}${endpoint}` : `${API_CONFIG.baseUrl}${endpoint}`;
    
    const headers = {
        ...API_CONFIG.headers,
        ...API_CONFIG.getAuthHeader()
    };
    
    const options = {
        method,
        headers
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // If response is not ok, throw an error
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }
        
        // If the response is 204 No Content
        if (response.status === 204) {
            return { success: true };
        }
        
        // Otherwise, parse the JSON
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}