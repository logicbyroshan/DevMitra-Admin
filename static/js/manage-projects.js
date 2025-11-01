// Manage Projects JavaScript with AJAX functionality

document.addEventListener('DOMContentLoaded', function() {
    // CSRF Token for AJAX requests
    const csrftoken = getCookie('csrftoken');
    
    // Toggle Project Active/Inactive
    const toggleSwitches = document.querySelectorAll('.project-toggle');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const projectId = this.dataset.projectId;
            const isActive = this.checked;
            
            toggleProjectStatus(projectId, isActive, this);
        });
    });
    
    // Delete Project Buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const modal = document.getElementById('delete-confirm-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    let currentProjectId = null;
    let currentProjectTitle = null;
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentProjectId = this.dataset.projectId;
            currentProjectTitle = this.dataset.projectTitle;
            
            showDeleteModal(currentProjectId, currentProjectTitle);
        });
    });
    
    // Modal Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Modal Confirm Button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentProjectId) {
                deleteProject(currentProjectId);
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
    function showDeleteModal(projectId, projectTitle) {
        const modalBody = modal.querySelector('.modal-body p');
        
        // Update modal text
        if (projectTitle) {
            modalBody.textContent = `Are you sure you want to permanently delete "${projectTitle}"? This action cannot be undone.`;
        } else {
            modalBody.textContent = 'Are you sure you want to permanently delete this project? This action cannot be undone.';
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close Delete Modal
    function closeDeleteModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentProjectId = null;
        currentProjectTitle = null;
    }
    
    // Toggle Project Status via AJAX
    function toggleProjectStatus(projectId, isActive, toggleElement) {
        const formData = new FormData();
        formData.append('project_id', projectId);
        formData.append('is_active', isActive);
        
        fetch('/projects/', {
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
                // Show success notification
                showNotification('Project status updated successfully!', 'success');
                
                // Update UI if needed
                const card = toggleElement.closest('.blog-card');
                if (isActive) {
                    card.classList.remove('inactive');
                } else {
                    card.classList.add('inactive');
                }
            } else {
                // Revert toggle on failure
                toggleElement.checked = !isActive;
                showNotification('Failed to update project status.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toggleElement.checked = !isActive;
            showNotification('An error occurred. Please try again.', 'error');
        });
    }
    
    // Delete Project via AJAX
    function deleteProject(projectId) {
        fetch(`/projects/${projectId}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Close modal
                closeDeleteModal();
                
                // Remove project card from DOM with animation
                const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
                if (projectCard) {
                    projectCard.style.opacity = '0';
                    projectCard.style.transform = 'scale(0.9)';
                    projectCard.style.transition = 'all 0.3s ease-out';
                    
                    setTimeout(() => {
                        projectCard.remove();
                        
                        // Check if section is now empty
                        const section = projectCard.closest('section');
                        const grid = section?.querySelector('.blog-grid');
                        const remainingCards = grid?.querySelectorAll('.blog-card:not(.empty-state)').length || 0;
                        
                        if (remainingCards === 0 && grid) {
                            // Show empty state
                            grid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-folder-open"></i>
                                    <p>No projects in this section.</p>
                                </div>
                            `;
                        }
                        
                        // Update count
                        const countElement = section?.querySelector('.blog-count');
                        if (countElement) {
                            const currentCount = parseInt(countElement.textContent.match(/\d+/)?.[0] || '0');
                            countElement.textContent = `(${Math.max(0, currentCount - 1)})`;
                        }
                    }, 300);
                }
                
                showNotification('Project deleted successfully!', 'success');
            } else {
                showNotification(data.error || 'Failed to delete project.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    }
});

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

// Get CSRF Token from Cookie
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

// Add notification styles if not present
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease-out;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-success i {
            color: #10b981;
            font-size: 20px;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-error i {
            color: #ef4444;
            font-size: 20px;
        }
        
        .notification span {
            flex: 1;
            font-size: 14px;
            color: #1f2937;
        }
        
        .modal-overlay.active {
            display: flex !important;
        }
        
        .blog-card.inactive {
            opacity: 0.6;
        }
    `;
    document.head.appendChild(style);
}

