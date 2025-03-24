// Products API functions

/**
 * Fetch all products
 * @returns {Promise} - API response with products
 */
async function getProducts() {
    try {
        const fetchProducts = await apiRequest(API_CONFIG.endpoints.products.list);
        return fetchProducts.result
    } catch (error) {
        throw error;
    }
}

/**
 * Mock products data for development (remove in production)
 * @returns {Array} - Array of product objects
 */
function getMockProducts() {
    return [
        {
            id: 1,
            name: 'Apple',
            price: 0.35,
            image: 'apple.jpg',
            description: 'Fresh red apples',
            specialOffer: null
        },
        {
            id: 2,
            name: 'Banana',
            price: 0.20,
            image: 'banana.jpg',
            description: 'Ripe yellow bananas',
            specialOffer: null
        },
        {
            id: 3,
            name: 'Melon',
            price: 0.50,
            image: 'melon.jpg',
            description: 'Sweet juicy melons',
            specialOffer: 'Buy one get one free'
        },
        {
            id: 4,
            name: 'Lime',
            price: 0.15,
            image: 'lime.jpg',
            description: 'Zesty green limes',
            specialOffer: 'Three for the price of two'
        }
    ];
}

/**
 * Format price in pounds
 * @param {number} price - Price in pounds
 * @returns {string} - Formatted price (e.g., "£0.35")
 */
function formatPrice(price) {
    // Check if price is undefined or not a valid number
    if (price === undefined || price === null || isNaN(price)) {
        return 'INR 0.00'; // Return a default price if invalid
    }
    return `INR ${Number(price).toFixed(2)}`;
}