document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const modal = document.getElementById('delete-confirm-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    let currentDeleteTarget = null;

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentDeleteTarget = this.closest('.achievement-card');
            modal.classList.add('active');
        });
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        currentDeleteTarget = null;
    });

    confirmBtn.addEventListener('click', () => {
        if (currentDeleteTarget) {
            currentDeleteTarget.style.opacity = '0';
            currentDeleteTarget.style.transform = 'scale(0.9)';
            setTimeout(() => {
                currentDeleteTarget.remove();
                modal.classList.remove('active');
                currentDeleteTarget = null;
            }, 300);
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            currentDeleteTarget = null;
        }
    });
});
