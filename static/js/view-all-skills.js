document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const skillGrid = document.getElementById('all-skills-grid');
    const skillCards = Array.from(skillGrid.querySelectorAll('.skill-card'));

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
        
        let visibleCards = skillCards.filter(card => {
            const title = card.dataset.title.toLowerCase();
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
});
