document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const achievementGrid = document.getElementById('all-achievements-grid');
    const achievementCards = Array.from(achievementGrid.querySelectorAll('.achievement-card:not(.empty-state)'));
    const csrftoken = getCookie('csrftoken');

    // Get filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    let currentFilter = urlParams.get('filter') || 'all';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterAndSort();
        });
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndSort);
    }

    function filterAndSort() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let visibleCards = achievementCards.filter(card => {
            const title = card.dataset.title?.toLowerCase() || '';
            const issuer = card.querySelector('.achievement-issuer')?.textContent.toLowerCase() || '';
            const status = card.dataset.status;
            
            const matchesSearch = title.includes(searchTerm) || issuer.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || status === currentFilter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                return true;
            } else {
                card.style.display = 'none';
                return false;
            }
        });

        // Sort visible cards
        if (sortSelect) {
            const sortValue = sortSelect.value;
            visibleCards.sort((a, b) => {
                if (sortValue === 'newest') {
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                } else if (sortValue === 'oldest') {
                    return new Date(a.dataset.date) - new Date(b.dataset.date);
                } else if (sortValue === 'title-az') {
                    return a.dataset.title.localeCompare(b.dataset.title);
                } else if (sortValue === 'title-za') {
                    return b.dataset.title.localeCompare(a.dataset.title);
                }
                return 0;
            });

            // Reorder cards in the DOM
            visibleCards.forEach(card => {
                achievementGrid.appendChild(card);
            });
        }
    }

    // Toggle Achievement Active/Inactive
    const toggleSwitches = document.querySelectorAll('.achievement-toggle');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const achievementId = this.dataset.achievementId;
            const isActive = this.checked;
            
            toggleAchievementStatus(achievementId, isActive, this);
        });
    });

    // Delete Achievement Buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const modal = document.getElementById('delete-confirm-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    let currentAchievementId = null;
    let currentAchievementTitle = null;
    let currentDeleteTarget = null;

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            currentAchievementId = this.dataset.achievementId;
            currentAchievementTitle = this.dataset.achievementTitle;
            currentDeleteTarget = this.closest('.achievement-card');
            
            showDeleteModal(currentAchievementId, currentAchievementTitle);
        });
    });

    // Modal Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }

    // Modal Confirm Button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentAchievementId) {
                deleteAchievement(currentAchievementId);
            }
        });
    }

    // Close modal on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDeleteModal();
            }
        });
    }

    // Show Delete Confirmation Modal
    function showDeleteModal(achievementId, achievementTitle) {
        const modalBody = modal.querySelector('.modal-body p');
        
        if (achievementTitle) {
            modalBody.textContent = `Are you sure you want to permanently delete "${achievementTitle}"? This action cannot be undone.`;
        } else {
            modalBody.textContent = 'Are you sure you want to permanently delete this achievement? This action cannot be undone.';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Delete Modal
    function closeDeleteModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentAchievementId = null;
        currentAchievementTitle = null;
        currentDeleteTarget = null;
    }

    // Toggle Achievement Status via AJAX
    function toggleAchievementStatus(achievementId, isActive, toggleElement) {
        const formData = new FormData();
        formData.append('achievement_id', achievementId);
        formData.append('is_active', isActive);
        
        fetch('/achievements/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Achievement status updated successfully!', 'success');
                
                const card = toggleElement.closest('.achievement-card');
                if (isActive) {
                    card.classList.remove('inactive');
                } else {
                    card.classList.add('inactive');
                }
            } else {
                toggleElement.checked = !isActive;
                showNotification('Failed to update achievement status.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toggleElement.checked = !isActive;
            showNotification('An error occurred. Please try again.', 'error');
        });
    }

    // Delete Achievement via AJAX
    function deleteAchievement(achievementId) {
        fetch(`/achievements/${achievementId}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeDeleteModal();
                
                if (currentDeleteTarget) {
                    currentDeleteTarget.style.opacity = '0';
                    currentDeleteTarget.style.transform = 'scale(0.9)';
                    currentDeleteTarget.style.transition = 'all 0.3s ease-out';
                    
                    setTimeout(() => {
                        currentDeleteTarget.remove();
                        
                        // Update the achievementCards array
                        const index = achievementCards.indexOf(currentDeleteTarget);
                        if (index > -1) {
                            achievementCards.splice(index, 1);
                        }
                        
                        // Check if grid is now empty
                        const remainingCards = achievementGrid.querySelectorAll('.achievement-card:not(.empty-state)').length;
                        if (remainingCards === 0) {
                            achievementGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-award"></i>
                                    <p>No achievements found.</p>
                                </div>
                            `;
                        }
                    }, 300);
                }
                
                showNotification('Achievement deleted successfully!', 'success');
            } else {
                showNotification(data.error || 'Failed to delete achievement.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    }

    // Get CSRF Token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Show Notification
    function showNotification(message, type) {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Intersection Observer for fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    achievementCards.forEach(card => {
        observer.observe(card);
    });

    // Initial filter and sort
    filterAndSort();
});
