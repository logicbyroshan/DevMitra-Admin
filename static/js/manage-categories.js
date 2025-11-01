// Manage Categories - Complete AJAX Implementation

console.log('Manage Categories JS loaded');

// Get CSRF token
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Auto-generate slug from name
    const categoryNameInput = document.getElementById('category-name');
    if (categoryNameInput) {
        categoryNameInput.addEventListener('input', function() {
            const slug = this.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            document.getElementById('category-slug').value = slug;
        });
    }

    // Modal management
    const categoryModal = document.getElementById('category-modal');
    const deleteModal = document.getElementById('delete-confirm-modal');
    let currentCategoryId = null;

    // Open create category modal
    const addCategoryBtn = document.getElementById('add-category-btn');
    console.log('Add Category Button:', addCategoryBtn);
    
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Category button clicked');
            document.getElementById('modal-title').textContent = 'Add New Category';
            document.getElementById('form-action').value = 'create';
            document.getElementById('category-id').value = '';
            document.getElementById('category-form').reset();
            document.getElementById('category-color').value = '#3b82f6';
            document.getElementById('category-icon').value = 'fas fa-folder';
            categoryModal.classList.add('open');
            console.log('Modal should be open now');
        });
    }

    // Close modal buttons
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            categoryModal.classList.remove('open');
        });
    }

    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', () => {
            categoryModal.classList.remove('open');
        });
    }

    const deleteCancelBtn = document.getElementById('delete-cancel-btn');
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', () => {
            deleteModal.classList.remove('open');
        });
    }

    // Close modal on overlay click
    if (categoryModal) {
        categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                categoryModal.classList.remove('open');
            }
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.classList.remove('open');
            }
        });
    }

    // Filter tabs functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter categories
            const categoryCards = document.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                if (filter === 'all' || card.dataset.categoryType === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Edit category
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.btn-edit')) {
            const categoryId = e.target.closest('.btn-edit').dataset.categoryId;
            
            const formData = new FormData();
            formData.append('action', 'get');
            formData.append('category_id', categoryId);
            formData.append('csrfmiddlewaretoken', getCSRFToken());
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: formData
                });
                
                const data = await response.json();
                if (data.success) {
                    document.getElementById('modal-title').textContent = 'Edit Category';
                    document.getElementById('form-action').value = 'update';
                    document.getElementById('category-id').value = data.category.id;
                    document.getElementById('category-name').value = data.category.name;
                    document.getElementById('category-slug').value = data.category.slug;
                    document.getElementById('category-type').value = data.category.category_type;
                    document.getElementById('category-description').value = data.category.description;
                    document.getElementById('category-icon').value = data.category.icon;
                    document.getElementById('category-color').value = data.category.color;
                    categoryModal.classList.add('open');
                } else {
                    showNotification(data.message || 'Failed to load category', 'error');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            }
        }
    });

    // Save category (create or update)
    const modalSaveBtn = document.getElementById('modal-save-btn');
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', async function() {
            const form = document.getElementById('category-form');
            const formData = new FormData(form);
            
            // Validate required fields
            const name = document.getElementById('category-name').value.trim();
            const slug = document.getElementById('category-slug').value.trim();
            
            if (!name || !slug) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: formData
                });
                
                const data = await response.json();
                if (data.success) {
                    showNotification(data.message);
                    categoryModal.classList.remove('open');
                    
                    // Update UI
                    if (formData.get('action') === 'create') {
                        addCategoryToUI(data.category);
                    } else {
                        updateCategoryInUI(data.category);
                    }
                } else {
                    showNotification(data.message || 'Failed to save category', 'error');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            }
        });
    }

    // Delete category
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-delete')) {
            currentCategoryId = e.target.closest('.btn-delete').dataset.categoryId;
            const categoryCard = e.target.closest('.category-card');
            const categoryName = categoryCard.querySelector('h4').textContent;
            document.getElementById('delete-category-name').textContent = categoryName;
            deleteModal.classList.add('open');
        }
    });

    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', async function() {
            if (!currentCategoryId) return;
            
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('category_id', currentCategoryId);
            formData.append('csrfmiddlewaretoken', getCSRFToken());
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': getCSRFToken()
                    },
                    body: formData
                });
                
                const data = await response.json();
                if (data.success) {
                    showNotification(data.message);
                    deleteModal.classList.remove('open');
                    
                    // Remove category from UI
                    const categoryCard = document.querySelector(`[data-category-id="${currentCategoryId}"]`);
                    if (categoryCard) {
                        categoryCard.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => categoryCard.remove(), 300);
                    }
                    
                    currentCategoryId = null;
                } else {
                    showNotification(data.message || 'Failed to delete category', 'error');
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            }
        });
    }
});

// Add category to UI
function addCategoryToUI(category) {
    const container = document.getElementById('categories-container');
    
    // Remove empty state if exists
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.dataset.categoryId = category.id;
    categoryCard.dataset.categoryType = category.category_type;
    categoryCard.innerHTML = `
        <div class="category-header">
            <div class="category-icon" style="background-color: ${category.color}20; color: ${category.color};">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-info">
                <h4>${category.name}</h4>
                <p class="category-type" style="color: #6b7280; font-size: 0.75rem; margin: 2px 0;">${category.category_type_display}</p>
                <p class="category-count">${category.item_count} Item${category.item_count !== 1 ? 's' : ''}</p>
            </div>
        </div>
        <div class="category-actions">
            <button class="btn-icon btn-edit" data-category-id="${category.id}">
                <i class="fas fa-pencil-alt"></i> Edit
            </button>
            <button class="btn-icon btn-delete" data-category-id="${category.id}">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </div>
    `;
    
    categoryCard.style.animation = 'fadeIn 0.3s ease';
    container.appendChild(categoryCard);
}

// Update category in UI
function updateCategoryInUI(category) {
    const categoryCard = document.querySelector(`[data-category-id="${category.id}"]`);
    if (categoryCard) {
        categoryCard.querySelector('h4').textContent = category.name;
        categoryCard.querySelector('.category-type').textContent = category.category_type_display;
        categoryCard.querySelector('.category-count').textContent = 
            `${category.item_count} Item${category.item_count !== 1 ? 's' : ''}`;
        
        const iconDiv = categoryCard.querySelector('.category-icon');
        iconDiv.style.backgroundColor = `${category.color}20`;
        iconDiv.style.color = category.color;
        iconDiv.querySelector('i').className = category.icon;
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    .modal-overlay.active {
        display: flex !important;
    }
    
    .modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
    }
`;
document.head.appendChild(style);
