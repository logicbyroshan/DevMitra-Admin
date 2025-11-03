document.addEventListener('DOMContentLoaded', function() {
    // CSRF Token for AJAX requests
    const csrftoken = getCookie('csrftoken');
    
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

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
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
        
        // Update modal text
        if (achievementTitle) {
            modalBody.textContent = `Are you sure you want to permanently delete "${achievementTitle}"? This action cannot be undone.`;
        } else {
            modalBody.textContent = 'Are you sure you want to permanently delete this achievement? This action cannot be undone.';
        }
        
        // Show modal
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
                        
                        // Check if section is now empty
                        const achievementsGrid = document.querySelector('.achievements-grid');
                        const remainingCards = achievementsGrid?.querySelectorAll('.achievement-card:not(.empty-state)').length || 0;
                        
                        if (remainingCards === 0) {
                            achievementsGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-award"></i>
                                    <p>No achievements yet. Add your first achievement!</p>
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
    // Show Notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
