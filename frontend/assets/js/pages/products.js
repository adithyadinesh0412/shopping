/**
 * Load products and render them in the UI
 */
async function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    
    try {
        // Get products from API or mock data
        let products;
        try {
            products = await getProducts();
            console.log("products : : : ",products)
        } catch (error) {
            console.log('Using mock products:', error);
            products = getMockProducts();
        }
        
        // Clear loading indicator
        productsContainer.innerHTML = '';
        
        // Render products
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    Failed to load products. Please try again later.
                </div>
            </div>
        `;
        console.error('Error loading products:', error);
    }
}

/**
 * Create a product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3 mb-4';
    
    // Create image placeholder or use actual product image
    const imageSrc = product.image || '/api/placeholder/300/200';
    
    col.innerHTML = `
        <div class="card product-card">
            <div class="card-img-top text-center">
                <i class="bi bi-basket" style="font-size: 3rem;"></i>
            </div>
            <div class="card-body">
                <h5 class="card-title product-title">${product.item}</h5>
                <p class="card-text">${product?.description || `Fresh ${product.item}`}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="product-price">${formatPrice(product.price_per_item)}</span>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
                ${product.specialOffer ? `
                    <div class="mt-2">
                        <span class="product-special">
                            <i class="bi bi-tags"></i> ${product.specialOffer}
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add event listener to "Add to Cart" button
    const addButton = col.querySelector('.add-to-cart-btn');
    addButton.addEventListener('click', () => {
        addToCart(product.id)
            .then(() => {
                showToast(`${Object.keys(product)}.`, 'success');
                updateCartCount();
            })
            .catch(error => {
                showToast(`Failed to add ${product.name} to cart`, 'error');
                console.error('Error adding to cart:', error);
            });
    });
    
    return col;
}