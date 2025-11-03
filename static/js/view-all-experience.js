document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const experienceGrid = document.getElementById('all-experience-grid');
    const experienceCards = Array.from(experienceGrid.querySelectorAll('.experience-card'));
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const toggleSwitches = document.querySelectorAll('.experience-toggle');

    // Get filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    let currentFilter = urlParams.get('filter') || 'all';

    // Set active filter button based on URL
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

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
                    } else {
                        card.classList.add('inactive');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.checked = !isActive;
            });
        });
    });

    // Handle delete buttons
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const experienceId = this.dataset.experienceId;
            const experienceTitle = this.dataset.experienceTitle;
            const card = this.closest('.experience-card');

            if (confirm(`Are you sure you want to delete "${experienceTitle}"? This action cannot be undone.`)) {
                fetch(`/experience/${experienceId}/delete/`, {
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
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.remove();
                        }, 300);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to delete experience');
                });
            }
        });
    });

    // Initial filter and sort
    filterAndSort();

    // Search functionality
    searchInput.addEventListener('input', function() {
        filterAndSort();
    });

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterAndSort();
        });
    });

    // Sort functionality
    sortSelect.addEventListener('change', filterAndSort);

    function filterAndSort() {
        const searchTerm = searchInput.value.toLowerCase();
        const noResults = document.getElementById('no-results');
        
        let visibleCards = experienceCards.filter(card => {
            const title = card.dataset.title.toLowerCase();
            const company = card.querySelector('.company-name')?.textContent.toLowerCase() || '';
            const status = card.dataset.status;
            
            const matchesSearch = title.includes(searchTerm) || company.includes(searchTerm);
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
                experienceGrid.style.display = 'none';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
                experienceGrid.style.display = 'grid';
            }
        }

        // Sort visible cards
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
            experienceGrid.appendChild(card);
        });
    }

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
});
