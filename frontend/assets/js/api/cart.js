// Cart API functions

/**
 * Get the current cart
 * @returns {Promise} - API response with cart items
 */
async function getCart() {
    try {
        // Use API if authenticated, otherwise use localStorage cart
        if (isAuthenticated()) {
            return await apiRequest(API_CONFIG.endpoints.cart.get);
        } else {
            return getLocalCart();
        }
    } catch (error) {
        console.error('Error getting cart:', error);
        // Fallback to local cart if API fails
        return getLocalCart();
    }
}

/**
 * Add an item to the cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise} - API response
 */
async function addToCart(productId, quantity = 1) {
    try {
        if (isAuthenticated()) {
            return await apiRequest(
                `${API_CONFIG.endpoints.cart.add}/${productId}`,
                'GET',
                { }
            );
        } else {
            return addToLocalCart(productId, quantity);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local cart if API fails
        return addToLocalCart(productId, quantity);
    }
}

/**
 * Update cart item quantity
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise} - API response
 */
async function updateCartItem(productId, quantity) {
    try {
        if (isAuthenticated()) {
            return await apiRequest(
                API_CONFIG.endpoints.cart.update,
                'PUT',
                { productId, quantity }
            );
        } else {
            return updateLocalCartItem(productId, quantity);
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        return updateLocalCartItem(productId, quantity);
    }
}

/**
 * Remove an item from the cart
 * @param {number} productId - Product ID
 * @returns {Promise} - API response
 */
async function removeFromCart(productId) {
    try {
        if (isAuthenticated()) {
            return await apiRequest(
                `${API_CONFIG.endpoints.cart.remove}/${productId}`,
                'DELETE'
            );
        } else {
            return removeFromLocalCart(productId);
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        return removeFromLocalCart(productId);
    }
}

/**
 * Clear the cart
 * @returns {Promise} - API response
 */
async function clearCart() {
    try {
        if (isAuthenticated()) {
            return await apiRequest(
                API_CONFIG.endpoints.cart.clear,
                'DELETE'
            );
        } else {
            return clearLocalCart();
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        return clearLocalCart();
    }
}

/**
 * Checkout
 * @returns {Promise} - API response
 */
async function checkoutApi() {
    try {
        if (isAuthenticated()) {
            return await apiRequest(
                API_CONFIG.endpoints.cart.checkout,
                'POST'
            );
        } else {
            // For unauthenticated users, just clear the cart and return success
            clearLocalCart();
            return { success: true };
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
}

/**
 * Get the local cart from localStorage
 * @returns {Object} - Cart object with items
 */
function getLocalCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

/**
 * Save the local cart to localStorage
 * @param {Object} cart - Cart object
 */
function saveLocalCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

/**
 * Add a product to the local cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Object} - Updated cart
 */
function addToLocalCart(productId, quantity = 1) {
    const cart = getLocalCart();
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Get product details from mock data (in production, would need to fetch from API)
        const product = getMockProducts().find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        
        cart.items.push({
            productId,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            specialOffer: product.specialOffer
        });
    }
    
    // Recalculate total
    cart.total = calculateTotal(cart.items);
    
    // Save cart
    saveLocalCart(cart);
    return cart;
}

/**
 * Update a product quantity in the local cart
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Object} - Updated cart
 */
function updateLocalCartItem(productId, quantity) {
    const cart = getLocalCart();
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            // Remove item if quantity is 0 or less
            return removeFromLocalCart(productId);
        }
    }
    
    // Recalculate total
    cart.total = calculateTotal(cart.items);
    
    // Save cart
    saveLocalCart(cart);
    return cart;
}

/**
 * Remove a product from the local cart
 * @param {number} productId - Product ID
 * @returns {Object} - Updated cart
 */
function removeFromLocalCart(productId) {
    const cart = getLocalCart();
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Recalculate total
    cart.total = calculateTotal(cart.items);
    
    // Save cart
    saveLocalCart(cart);
    return cart;
}

/**
 * Clear the local cart
 * @returns {Object} - Empty cart
 */
function clearLocalCart() {
    const emptyCart = { items: [], total: 0 };
    saveLocalCart(emptyCart);
    return emptyCart;
}

/**
 * Calculate the total price of cart items with special offers applied
 * @param {Array} items - Cart items
 * @returns {number} - Total price
 */
function calculateTotal(items) {
    let total = 0;
    
    // Group items by product
    const groupedItems = {};
    items.forEach(item => {
        if (!groupedItems[item.productId]) {
            groupedItems[item.productId] = {
                ...item
            };
        } else {
            groupedItems[item.productId].quantity += item.quantity;
        }
    });
    
    // Apply pricing rules
    Object.values(groupedItems).forEach(item => {
        if (item.name === 'Melon') {
            // Buy one get one free
            const paidMelons = Math.ceil(item.quantity / 2);
            total += paidMelons * item.price;
        } else if (item.name === 'Lime') {
            // Three for the price of two
            const fullPriceSets = Math.floor(item.quantity / 3) * 2;
            const remainder = item.quantity % 3;
            total += (fullPriceSets + remainder) * item.price;
        } else {
            // Regular pricing
            total += item.quantity * item.price;
        }
    });
    
    return total;
}

/**
 * Update the cart count in the navbar
 */
function updateCartCount() {
    const cart = getLocalCart();
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}