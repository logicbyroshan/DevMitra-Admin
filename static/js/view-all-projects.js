document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const projectGrid = document.getElementById('all-projects-grid');
    const projectCards = Array.from(projectGrid.querySelectorAll('.blog-card:not(.empty-state)'));
    const csrftoken = getCookie('csrftoken');

    // Get filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    let currentFilter = urlParams.get('filter') || 'all';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
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
        
        let visibleCards = projectCards.filter(card => {
            const title = card.dataset.title?.toLowerCase() || '';
            const category = card.querySelector('.card-category')?.textContent.toLowerCase() || '';
            const status = card.dataset.status;
            
            const matchesSearch = title.includes(searchTerm) || category.includes(searchTerm);
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
                projectGrid.style.display = 'none';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
                projectGrid.style.display = 'grid';
            }
        }

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
            });

            // Reorder cards in DOM
            visibleCards.forEach(card => projectGrid.appendChild(card));
        }
    }

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
        button.addEventListener('click', function(e) {
            e.preventDefault();
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
                showNotification('Project status updated successfully!', 'success');
                
                const card = toggleElement.closest('.blog-card');
                if (isActive) {
                    card.classList.remove('inactive');
                } else {
                    card.classList.add('inactive');
                }
            } else {
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
                closeDeleteModal();
                
                const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
                if (projectCard) {
                    projectCard.style.opacity = '0';
                    projectCard.style.transform = 'scale(0.9)';
                    projectCard.style.transition = 'all 0.3s ease-out';
                    
                    setTimeout(() => {
                        projectCard.remove();
                        
                        // Update projectCards array
                        const index = projectCards.indexOf(projectCard);
                        if (index > -1) {
                            projectCards.splice(index, 1);
                        }
                        
                        // Check if any cards left
                        const remainingCards = document.querySelectorAll('.blog-card:not(.empty-state)').length;
                        if (remainingCards === 0) {
                            projectGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-folder-open"></i>
                                    <p>No projects found.</p>
                                    <a href="/projects/create/" class="btn-primary">
                                        <i class="fas fa-plus-circle"></i> Create Project
                                    </a>
                                </div>
                            `;
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

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
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
