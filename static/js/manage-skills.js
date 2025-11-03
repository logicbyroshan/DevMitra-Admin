document.addEventListener('DOMContentLoaded', function() {
    // CSRF Token for AJAX requests
    const csrftoken = getCookie('csrftoken');
    
    // Toggle Skill Active/Inactive
    const toggleSwitches = document.querySelectorAll('.skill-toggle');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const skillId = this.dataset.skillId;
            const isActive = this.checked;
            
            toggleSkillStatus(skillId, isActive, this);
        });
    });
    
    // Delete Skill Buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const modal = document.getElementById('delete-confirm-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    let currentSkillId = null;
    let currentSkillName = null;
    let currentDeleteTarget = null;

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            currentSkillId = this.dataset.skillId;
            currentSkillName = this.dataset.skillName;
            currentDeleteTarget = this.closest('.skill-card');
            
            showDeleteModal(currentSkillId, currentSkillName);
        });
    });

    // Modal Cancel Button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }

    // Modal Confirm Button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (currentSkillId) {
                deleteSkill(currentSkillId);
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
    function showDeleteModal(skillId, skillName) {
        const modalBody = modal.querySelector('.modal-body p');
        
        // Update modal text
        if (skillName) {
            modalBody.textContent = `Are you sure you want to permanently delete "${skillName}"? This action cannot be undone.`;
        } else {
            modalBody.textContent = 'Are you sure you want to permanently delete this skill? This action cannot be undone.';
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Delete Modal
    function closeDeleteModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentSkillId = null;
        currentSkillName = null;
        currentDeleteTarget = null;
    }

    // Toggle Skill Status via AJAX
    function toggleSkillStatus(skillId, isActive, toggleElement) {
        const formData = new FormData();
        formData.append('skill_id', skillId);
        formData.append('is_active', isActive);
        
        fetch('/skills/', {
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
                showNotification('Skill status updated successfully!', 'success');
                
                const card = toggleElement.closest('.skill-card');
                if (isActive) {
                    card.classList.remove('inactive');
                } else {
                    card.classList.add('inactive');
                }
            } else {
                toggleElement.checked = !isActive;
                showNotification('Failed to update skill status.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toggleElement.checked = !isActive;
            showNotification('An error occurred. Please try again.', 'error');
        });
    }

    // Delete Skill via AJAX
    function deleteSkill(skillId) {
        fetch(`/skills/${skillId}/delete/`, {
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
                        const skillsGrid = document.querySelector('.skills-grid');
                        const remainingCards = skillsGrid?.querySelectorAll('.skill-card:not(.empty-state)').length || 0;
                        
                        if (remainingCards === 0) {
                            skillsGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-code"></i>
                                    <p>No skills yet. Add your first skill!</p>
                                    <a href="/skills/create/" class="btn-primary">
                                        <i class="fas fa-plus-circle"></i> Add Skill
                                    </a>
                                </div>
                            `;
                        }
                    }, 300);
                }
                
                showNotification('Skill deleted successfully!', 'success');
            } else {
                showNotification(data.error || 'Failed to delete skill.', 'error');
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
