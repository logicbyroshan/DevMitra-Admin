// Filter and Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const responseCards = document.querySelectorAll('.response-card');

    let currentFilter = 'all';
    let currentSort = 'date-desc';

    // Check URL parameters for auto-filtering
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        currentFilter = filterParam;
        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterParam);
        });
    }

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterAndSort();
        });
    });

    // Search input handler
    searchInput.addEventListener('input', function() {
        filterAndSort();
    });

    // Sort select handler
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        filterAndSort();
    });

    // Filter and sort function
    function filterAndSort() {
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCards = [];

        responseCards.forEach(card => {
            const priority = card.dataset.priority;
            const status = card.dataset.status;
            const name = card.dataset.name.toLowerCase();
            const email = card.querySelector('.sender-email').textContent.toLowerCase();
            const message = card.querySelector('.response-message').textContent.toLowerCase();

            // Filter logic
            let matchesFilter = false;
            if (currentFilter === 'all') {
                matchesFilter = true;
            } else if (currentFilter === 'urgent') {
                matchesFilter = priority === 'urgent';
            } else if (currentFilter === 'normal') {
                matchesFilter = priority === 'normal';
            } else if (currentFilter === 'responded') {
                matchesFilter = status === 'responded';
            } else if (currentFilter === 'pending') {
                matchesFilter = status === 'pending';
            }

            // Search logic
            const matchesSearch = searchTerm === '' || 
                name.includes(searchTerm) || 
                email.includes(searchTerm) || 
                message.includes(searchTerm);

            // Show/hide card
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                visibleCards.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Sort visible cards
        sortCards(visibleCards);
    }

    // Sort cards function
    function sortCards(cards) {
        const grid = document.getElementById('responsesGrid');
        
        cards.sort((a, b) => {
            if (currentSort === 'date-desc') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (currentSort === 'date-asc') {
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            } else if (currentSort === 'name') {
                return a.dataset.name.localeCompare(b.dataset.name);
            }
        });

        // Reorder in DOM
        cards.forEach(card => {
            grid.appendChild(card);
        });
    }

    // Mark as responded functionality
    document.querySelectorAll('.btn-success').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.response-card');
            const statusBadge = card.querySelector('.status-badge');
            
            // Update status
            card.dataset.status = 'responded';
            statusBadge.className = 'status-badge responded';
            statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Responded';
            
            // Change button to "Respond Again"
            this.style.display = 'none';
            const respondBtn = card.querySelector('.btn-primary');
            respondBtn.innerHTML = '<i class="fas fa-reply"></i> Respond Again';
            
            // Show success message
            showNotification('Response marked as responded!', 'success');
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize filtering on page load
    filterAndSort();
});
