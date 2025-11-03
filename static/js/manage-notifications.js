document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            window.location.href = `?filter=${filter}`;
        });
    });
});

// Get CSRF token
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

// Open create modal
function openCreateModal() {
    document.getElementById('modal-title').textContent = 'Create Notification';
    document.getElementById('notification-form').reset();
    document.getElementById('notification_id').value = '';
    document.getElementById('notification-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('notification-modal').classList.remove('active');
}

// Edit notification
function editNotification(id) {
    // Fetch notification data and populate form
    fetch(`/notifications/get/${id}/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('modal-title').textContent = 'Edit Notification';
                document.getElementById('notification_id').value = data.notification.id;
                document.getElementById('title').value = data.notification.title;
                document.getElementById('message').value = data.notification.message;
                document.getElementById('notification_type').value = data.notification.notification_type;
                document.getElementById('link').value = data.notification.link || '';
                document.getElementById('link_text').value = data.notification.link_text || '';
                document.getElementById('notification-modal').classList.add('active');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Delete notification
function deleteNotification(id) {
    if (confirm('Are you sure you want to delete this notification?')) {
        const csrftoken = getCookie('csrftoken');
        
        fetch(`/notifications/delete/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                alert('Error deleting notification: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting notification');
        });
    }
}

// Mark as read
function markAsRead(id) {
    const csrftoken = getCookie('csrftoken');
    
    fetch(`/notifications/mark-read/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Mark all as read
function markAllAsRead() {
    if (confirm('Mark all notifications as read?')) {
        const csrftoken = getCookie('csrftoken');
        
        fetch('/notifications/mark-all-read/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Form submission
document.getElementById('notification-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const csrftoken = getCookie('csrftoken');
    
    fetch('/notifications/save/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert('Error saving notification: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving notification');
    });
});

// Close modal when clicking outside
document.getElementById('notification-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
