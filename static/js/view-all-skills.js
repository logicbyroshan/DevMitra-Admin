document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const skillGrid = document.getElementById('all-skills-grid');
    const skillCards = Array.from(skillGrid.querySelectorAll('.skill-card:not(.empty-state)'));
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
        const noResults = document.getElementById('no-results');
        
        let visibleCards = skillCards.filter(card => {
            const title = card.dataset.title?.toLowerCase() || '';
            const status = card.dataset.status;
            
            const matchesSearch = title.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || status === currentFilter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                return true;
            } else {
                card.style.display = 'none';
                return false;
            }
        });

        // Show/hide no results message
        if (visibleCards.length === 0) {
            if (noResults) {
                noResults.style.display = 'flex';
                skillGrid.style.display = 'none';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
                skillGrid.style.display = 'grid';
            }
        }

        // Sort visible cards
        if (sortSelect) {
            const sortValue = sortSelect.value;
            visibleCards.sort((a, b) => {
                if (sortValue === 'proficiency') {
                    return parseInt(b.dataset.proficiency) - parseInt(a.dataset.proficiency);
                } else if (sortValue === 'lowest') {
                    return parseInt(a.dataset.proficiency) - parseInt(b.dataset.proficiency);
                } else if (sortValue === 'name-az') {
                    return a.dataset.title.localeCompare(b.dataset.title);
                } else if (sortValue === 'name-za') {
                    return b.dataset.title.localeCompare(a.dataset.title);
                }
                return 0;
            });

            // Reorder cards in the DOM
            visibleCards.forEach(card => {
                skillGrid.appendChild(card);
            });
        }
    }

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

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
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
                        
                        // Update skillCards array
                        const index = skillCards.indexOf(currentDeleteTarget);
                        if (index > -1) {
                            skillCards.splice(index, 1);
                        }
                        
                        // Check if any cards left
                        const remainingCards = document.querySelectorAll('.skill-card:not(.empty-state)').length;
                        if (remainingCards === 0) {
                            skillGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-code"></i>
                                    <p>No skills found.</p>
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
    function showNotification(message, type) {
        // Check if notification container exists
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

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Fade in animation on scroll
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

    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
