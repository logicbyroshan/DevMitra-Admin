// Manage Details Page - AJAX Form Handlers

// Get CSRF token
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Personal Information Form
document.getElementById('personal-info-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Personal information updated successfully!');
        } else {
            showNotification(data.message || 'Failed to update information', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Social Links Form
document.getElementById('social-links-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Social links updated successfully!');
        } else {
            showNotification(data.message || 'Failed to update links', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// SEO Form
document.getElementById('seo-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'SEO settings updated successfully!');
        } else {
            showNotification(data.message || 'Failed to update SEO settings', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Preferences Form
document.getElementById('preferences-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Preferences updated successfully!');
        } else {
            showNotification(data.message || 'Failed to update preferences', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Video Resume Form
document.getElementById('video-resume-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Video resume link updated successfully!');
        } else {
            showNotification(data.message || 'Failed to update video link', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Profile Image Upload
document.getElementById('profile-upload')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData(document.getElementById('profile-image-form'));
    formData.append('profile_image', file);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Profile image uploaded successfully!');
            if (data.image_url) {
                document.getElementById('profile-preview').src = data.image_url;
            }
        } else {
            showNotification(data.message || 'Failed to upload image', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Delete Profile Image
document.getElementById('delete-profile-image')?.addEventListener('click', async function() {
    if (!confirm('Are you sure you want to delete your profile image?')) return;
    
    const formData = new FormData();
    formData.append('form_type', 'delete_profile_image');
    formData.append('csrfmiddlewaretoken', getCSRFToken());
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Profile image deleted successfully!');
            document.getElementById('profile-preview').src = 'https://via.placeholder.com/200';
        } else {
            showNotification(data.message || 'Failed to delete image', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Resume Upload
document.getElementById('resume-upload')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData(document.getElementById('upload-resume-form'));
    formData.append('resume', file);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Resume uploaded successfully!');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(data.message || 'Failed to upload resume', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Cover Letter Upload
document.getElementById('cover-letter-upload')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData(document.getElementById('upload-cover-letter-form'));
    formData.append('cover_letter', file);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Cover letter uploaded successfully!');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(data.message || 'Failed to upload cover letter', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Delete Resume
document.getElementById('delete-resume')?.addEventListener('click', async function() {
    if (!confirm('Are you sure you want to delete your resume?')) return;
    
    const formData = new FormData();
    formData.append('form_type', 'delete_resume');
    formData.append('csrfmiddlewaretoken', getCSRFToken());
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Resume deleted successfully!');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(data.message || 'Failed to delete resume', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Delete Cover Letter
document.getElementById('delete-cover-letter')?.addEventListener('click', async function() {
    if (!confirm('Are you sure you want to delete your cover letter?')) return;
    
    const formData = new FormData();
    formData.append('form_type', 'delete_cover_letter');
    formData.append('csrfmiddlewaretoken', getCSRFToken());
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification(data.message || 'Cover letter deleted successfully!');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(data.message || 'Failed to delete cover letter', 'error');
        }
    } catch (error) {
        showNotification('An error occurred. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
