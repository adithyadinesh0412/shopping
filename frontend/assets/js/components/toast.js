/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast mb-3';
    toast.classList.add(type);
    
    // Toast HTML structure
    toast.innerHTML = `
        <div class="toast-header ${type}">
            <strong class="me-auto">${getToastTitle(type)}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
        <div class="toast-progress ${type}"></div>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Close button event
    const closeButton = toast.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove a toast element
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * Get appropriate title for toast based on type
 * @param {string} type - Toast type
 * @returns {string} - Title text
 */
function getToastTitle(type) {
    switch (type) {
        case 'success':
            return 'Success';
        case 'error':
            return 'Error';
        case 'warning':
            return 'Warning';
        case 'info':
            return 'Information';
        default:
            return 'Notification';
    }
}