/**
 * Cart page functionality
 */

/**
 * Format price to currency string
 * @param {number} price - Price in pence
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return `£${(price / 100).toFixed(2)}`;
  }
  
  /**
   * Load cart and render it in the UI
   */
  async function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartDetails = document.getElementById('cart-details');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    try {
      // Show loading indicator
      cartContainer.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading cart...</p>
        </div>
      `;
      
      // Get cart data
      const cart = await cartApi.getCart();
      
      // Update cart count in navbar
      updateCartCount();
      
      // Hide loading indicator
      cartContainer.innerHTML = '';
      
      // Show empty cart message or cart details
      if (cart.items.length === 0) {
        emptyCartMessage.classList.remove('d-none');
        cartDetails.classList.add('d-none');
      } else {
        emptyCartMessage.classList.add('d-none');
        cartDetails.classList.remove('d-none');
        
        // Render cart items
        renderCartItems(cart);
        
        // Render special offers if applicable
        renderSpecialOffers(cart);
      }
    } catch (error) {
      cartContainer.innerHTML = `
        <div class="alert alert-danger">
          Failed to load cart. Please try again later.
        </div>
      `;
      console.error('Error loading cart:', error);
    }
  }
  
  /**
   * Render cart items in the table
   * @param {Object} cart - Cart data
   */
  function renderCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    
    // Add each item
    cart.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <div class="cart-item-image me-3 d-flex justify-content-center align-items-center">
              <i class="bi bi-basket"></i>
            </div>
            <div>
              <h6 class="mb-0">${item.name}</h6>
              ${item.specialOffer ? `<small class="text-success">${item.specialOffer}</small>` : ''}
            </div>
          </div>
        </td>
        <td>${formatPrice(item.price)}</td>
        <td>
          <div class="input-group cart-quantity">
            <button class="btn btn-sm btn-outline-secondary decrease-btn" data-product-id="${item.productId}">-</button>
            <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-product-id="${item.productId}">
            <button class="btn btn-sm btn-outline-secondary increase-btn" data-product-id="${item.productId}">+</button>
          </div>
        </td>
        <td>${formatPrice(item.price * item.quantity)}</td>
        <td>
          <button class="btn btn-sm btn-remove" data-product-id="${item.productId}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      
      cartItemsContainer.appendChild(row);
      
      // Add event listeners
      const decreaseBtn = row.querySelector('.decrease-btn');
      const increaseBtn = row.querySelector('.increase-btn');
      const quantityInput = row.querySelector('.quantity-input');
      const removeBtn = row.querySelector('.btn-remove');
      
      decreaseBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
          updateQuantity(item.productId, currentQuantity - 1);
        }
      });
      
      increaseBtn.addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        updateQuantity(item.productId, currentQuantity + 1);
      });
      
      quantityInput.addEventListener('change', () => {
        let newQuantity = parseInt(quantityInput.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
          newQuantity = 1;
          quantityInput.value = 1;
        }
        updateQuantity(item.productId, newQuantity);
      });
      
      removeBtn.addEventListener('click', () => {
        removeItem(item.productId);
      });
    });
    
    // Update total
    cartTotalElement.textContent = formatPrice(cart.total);
  }
  
  /**
   * Render special offers in the cart
   * @param {Object} cart - Cart data
   */
  function renderSpecialOffers(cart) {
    const specialOffersContainer = document.getElementById('special-offers-container');
    
    // Check if any items have special offers
    const offers = cart.items.filter(item => item.specialOffer);
    
    if (offers.length > 0) {
      // Show special offers section
      specialOffersContainer.classList.remove('d-none');
      specialOffersContainer.innerHTML = `
        <div class="card mb-4">
          <div class="card-header bg-success text-white">
            <i class="bi bi-tag me-2"></i> Special Offers Applied
          </div>
          <ul class="list-group list-group-flush">
            ${offers.map(item => `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold">${item.name}:</span>
                  <span>${item.specialOffer}</span>
                </div>
                <span class="badge bg-success rounded-pill">
                  Savings: ${formatPrice(item.savings || 0)}
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    } else {
      // Hide special offers section
      specialOffersContainer.classList.add('d-none');
    }
  }
  
  /**
   * Update cart count in navbar
   */
  async function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    
    if (!cartCountElement) return;
    
    try {
      const cart = await cartApi.getCart();
      const itemCount = cart.items.length;
      
      if (itemCount > 0) {
        cartCountElement.textContent = itemCount;
        cartCountElement.classList.remove('d-none');
      } else {
        cartCountElement.classList.add('d-none');
      }
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  }
  
  /**
   * Update item quantity in cart
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   */
  async function updateQuantity(productId, quantity) {
    try {
      // Show loading indicator
      document.getElementById('cart-container').classList.add('loading');
      
      // Update quantity
      await cartApi.updateQuantity(productId, quantity);
      
      // Reload cart
      await loadCart();
      
      // Show success message
      showToast('Cart updated', 'success');
    } catch (error) {
      // Show error message
      showToast(`Failed to update quantity: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      // Hide loading indicator
      document.getElementById('cart-container').classList.remove('loading');
    }
  }
  
  /**
   * Remove item from cart
   * @param {string} productId - Product ID
   */
  async function removeItem(productId) {
    try {
      // Show loading indicator
      document.getElementById('cart-container').classList.add('loading');
      
      // Remove item
      await cartApi.removeItem(productId);
      
      // Reload cart
      await loadCart();
      
      // Show success message
      showToast('Item removed from cart', 'success');
    } catch (error) {
      // Show error message
      showToast(`Failed to remove item: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      // Hide loading indicator
      document.getElementById('cart-container').classList.remove('loading');
    }
  }
  
  /**
   * Clear all items from cart
   */
  async function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }
    
    try {
      // Show loading indicator
      document.getElementById('cart-container').classList.add('loading');
      
      // Clear cart
      await cartApi.clearCart();
      
      // Reload cart
      await loadCart();
      
      // Show success message
      showToast('Cart cleared', 'success');
    } catch (error) {
      // Show error message
      showToast(`Failed to clear cart: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      // Hide loading indicator
      document.getElementById('cart-container').classList.remove('loading');
    }
  }
  
  /**
   * Proceed to checkout
   */
  async function checkout() {
    try {
      // Disable checkout button and show loading
      const checkoutBtn = document.getElementById('checkout-btn');
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
      
      // Process checkout
      const result = await cartApi.checkout();
      
      // Show success message
      showToast('Order placed successfully!', 'success');
      
      // Redirect to order confirmation or reload cart
      setTimeout(() => {
        window.location.href = 'products.html';
      }, 2000);
      
    } catch (error) {
      // Show error message
      showToast(`Checkout failed: ${error.message || 'Unknown error'}`, 'error');
      
      // Reset checkout button
      const checkoutBtn = document.getElementById('checkout-btn');
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = 'Proceed to Checkout';
    }
  }
  
  /**
   * Calculate savings from special offers
   * @param {Object} cart - Cart data
   * @returns {number} - Total savings amount
   */
  function calculateSavings(cart) {
    let totalSavings = 0;
    
    // Calculate standard price without offers
    const standardPrice = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Actual price with offers
    const actualPrice = cart.total;
    
    // Calculate savings
    totalSavings = standardPrice - actualPrice;
    
    return totalSavings;
  }
  
  /**
   * Get order summary with breakdown
   * @param {Object} cart - Cart data
   * @returns {Object} - Order summary details
   */
  function getOrderSummary(cart) {
    // Calculate subtotal (before offers)
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate savings
    const savings = calculateSavings(cart);
    
    // Calculate tax (assuming VAT at 20%)
    const taxRate = 0.2;
    const tax = Math.round((cart.total * taxRate) / (1 + taxRate));
    
    // Calculate net price (before tax)
    const netPrice = cart.total - tax;
    
    return {
      subtotal,
      savings,
      netPrice,
      tax,
      total: cart.total
    };
  }
  
  /**
   * Render order summary in cart
   * @param {Object} cart - Cart data
   */
  function renderOrderSummary(cart) {
    const summaryContainer = document.getElementById('order-summary');
    
    if (!summaryContainer) return;
    
    const summary = getOrderSummary(cart);
    
    summaryContainer.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Order Summary</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>${formatPrice(summary.subtotal)}</span>
          </div>
          ${summary.savings > 0 ? `
          <div class="d-flex justify-content-between mb-2 text-success">
            <span>Special Offers:</span>
            <span>-${formatPrice(summary.savings)}</span>
          </div>
          ` : ''}
          <div class="d-flex justify-content-between mb-2">
            <span>Net Price:</span>
            <span>${formatPrice(summary.netPrice)}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>VAT (20%):</span>
            <span>${formatPrice(summary.tax)}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>${formatPrice(summary.total)}</span>
          </div>
        </div>
        <div class="card-footer">
          <button id="checkout-btn" class="btn btn-primary w-100">
            Proceed to Checkout
          </button>
          <button id="clear-cart-btn" class="btn btn-outline-danger w-100 mt-2">
            Clear Cart
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
  }
  
  /**
   * Handle continue shopping button
   */
  function handleContinueShopping() {
    window.location.href = 'products.html';
  }
  
  // Initialize cart page when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    requireAuth('cart.html');
    
    // Load cart
    loadCart();
    
    // Add event listener for continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', handleContinueShopping);
    }
  });