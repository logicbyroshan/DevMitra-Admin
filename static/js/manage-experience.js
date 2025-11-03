document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const modal = document.getElementById('delete-confirm-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const toggleSwitches = document.querySelectorAll('.experience-toggle');
    let currentDeleteTarget = null;
    let currentExperienceId = null;

    // Handle toggle switch for active/inactive
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const experienceId = this.dataset.experienceId;
            const isActive = this.checked;
            const card = this.closest('.experience-card');

            fetch(`/experience/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `experience_id=${experienceId}&is_active=${isActive}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (isActive) {
                        card.classList.remove('inactive');
                        const inactiveBadge = card.querySelector('.status-badge.status-inactive');
                        if (inactiveBadge && inactiveBadge.textContent === 'Inactive') {
                            inactiveBadge.remove();
                        }
                        showNotification('Experience activated successfully!', 'success');
                    } else {
                        card.classList.add('inactive');
                        // Add inactive badge if not exists
                        const body = card.querySelector('.experience-body');
                        if (!card.querySelector('.status-badge.status-inactive')) {
                            const badge = document.createElement('span');
                            badge.className = 'status-badge status-inactive';
                            badge.textContent = 'Inactive';
                            body.appendChild(badge);
                        }
                        showNotification('Experience deactivated successfully!', 'success');
                    }
                } else {
                    this.checked = !isActive;
                    showNotification('Failed to update experience status.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.checked = !isActive;
                showNotification('An error occurred. Please try again.', 'error');
            });
        });
    });

    // Handle delete buttons
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentDeleteTarget = this.closest('.experience-card');
            currentExperienceId = this.dataset.experienceId;
            const experienceTitle = this.dataset.experienceTitle;
            modal.querySelector('.modal-body p').textContent = 
                `Are you sure you want to delete "${experienceTitle}"? This action cannot be undone.`;
            modal.classList.add('active');
        });
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        currentDeleteTarget = null;
        currentExperienceId = null;
    });

    confirmBtn.addEventListener('click', () => {
        if (currentExperienceId && currentDeleteTarget) {
            fetch(`/experience/${currentExperienceId}/delete/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentDeleteTarget.style.opacity = '0';
                    setTimeout(() => {
                        currentDeleteTarget.remove();
                        modal.classList.remove('active');
                        currentDeleteTarget = null;
                        currentExperienceId = null;
                        showNotification('Experience deleted successfully!', 'success');
                    }, 300);
                } else {
                    showNotification('Failed to delete experience.', 'error');
                    modal.classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again.', 'error');
                modal.classList.remove('active');
            });
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            currentDeleteTarget = null;
            currentExperienceId = null;
        }
    });

    // Helper function to get CSRF token
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
