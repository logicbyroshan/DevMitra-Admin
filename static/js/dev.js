document.addEventListener('DOMContentLoaded', function() {
    // All the JavaScript from script.js is already included
    // and will handle the theme, mobile menu, and dropdowns.

    // Dev Mitra specific JavaScript functionality

    // Animate skill progress bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    // Get the target width from inline style
                    const targetWidth = progressBar.style.width;
                    // Reset to 0 first
                    progressBar.style.width = '0';
                    // Trigger reflow
                    void progressBar.offsetWidth;
                    // Animate to target width
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 100);
                }
                // Unobserve after animation to prevent re-triggering
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all skill items
    document.querySelectorAll('.skill-item').forEach(skill => {
        skillObserver.observe(skill);
    });

    // Quick search functionality for projects, experience, and achievements
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Search through all list items
            const allListItems = document.querySelectorAll('.list-item');
            allListItems.forEach(item => {
                const title = item.querySelector('.list-item-title')?.textContent.toLowerCase() || '';
                const meta = item.querySelector('.list-item-meta')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || meta.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });

            // Search through skills
            const allSkills = document.querySelectorAll('.skill-item');
            allSkills.forEach(skill => {
                const skillName = skill.querySelector('.skill-name')?.textContent.toLowerCase() || '';
                
                if (skillName.includes(searchTerm)) {
                    skill.style.display = 'flex';
                } else {
                    skill.style.display = 'none';
                }
            });
        });
    }

    // Add confirmation for delete actions
    const deleteLinks = document.querySelectorAll('.action-link');
    deleteLinks.forEach(link => {
        if (link.textContent.includes('Delete')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const itemTitle = this.closest('.list-item').querySelector('.list-item-title').textContent;
                if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
                    // Remove the item with animation
                    const listItem = this.closest('.list-item');
                    listItem.style.transition = 'all 0.3s ease';
                    listItem.style.opacity = '0';
                    listItem.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        listItem.remove();
                    }, 300);
                }
            });
        }
    });

    // Stats counter animation
    const animateCounter = (element, target) => {
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Animate stat values when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !statValue.classList.contains('animated')) {
                    const targetValue = parseInt(statValue.textContent);
                    statValue.classList.add('animated');
                    animateCounter(statValue, targetValue);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    console.log('Dev Mitra Dashboard initialized successfully!');
});
