// Contact Response Detail Page JavaScript

// Mark as Responded
const markRespondedBtn = document.querySelector('.btn-mark-responded');
if (markRespondedBtn) {
    markRespondedBtn.addEventListener('click', function() {
        const statusBadge = document.querySelector('.status-badge');
        
        if (statusBadge.classList.contains('pending')) {
            statusBadge.classList.remove('pending');
            statusBadge.classList.add('responded');
            statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Responded';
            
            this.innerHTML = '<i class="fas fa-check"></i> Marked as Responded';
            this.disabled = true;
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';
            
            // Update timeline
            addTimelineEvent('Marked as Responded', 'Just now', 'Status updated in admin panel');
            
            showNotification('Message marked as responded!', 'success');
        }
    });
}

// Reply Button
const replyBtn = document.querySelector('.btn-reply');
if (replyBtn) {
    replyBtn.addEventListener('click', function() {
        showNotification('Opening email client...', 'info');
        // In a real app, this would open a reply modal or email client
        setTimeout(() => {
            const email = document.querySelector('.sender-email').textContent.trim();
            window.location.href = `mailto:${email.split(' ')[1]}`;
        }, 500);
    });
}

// Forward Button
const forwardBtn = document.querySelector('.btn-forward');
if (forwardBtn) {
    forwardBtn.addEventListener('click', function() {
        showNotification('Forward functionality coming soon!', 'info');
    });
}

// Archive Button
const archiveBtn = document.querySelector('.btn-archive');
if (archiveBtn) {
    archiveBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to archive this message?')) {
            showNotification('Message archived successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/analytics/contact-responses/';
            }, 1500);
        }
    });
}

// Delete Button
const deleteBtn = document.querySelector('.btn-delete');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            showNotification('Deleting message...', 'info');
            setTimeout(() => {
                showNotification('Message deleted successfully!', 'success');
                setTimeout(() => {
                    window.location.href = '/analytics/contact-responses/';
                }, 1000);
            }, 1000);
        }
    });
}

// Quick Actions
const printBtn = document.querySelectorAll('.quick-action-btn')[0];
const downloadBtn = document.querySelectorAll('.quick-action-btn')[1];
const copyBtn = document.querySelectorAll('.quick-action-btn')[2];

if (printBtn) {
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        showNotification('PDF download functionality coming soon!', 'info');
    });
}

if (copyBtn) {
    copyBtn.addEventListener('click', function() {
        const messageContent = document.querySelector('.message-content').textContent;
        navigator.clipboard.writeText(messageContent).then(() => {
            showNotification('Message copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy message', 'error');
        });
    });
}

// Add Timeline Event
function addTimelineEvent(title, time, description) {
    const timeline = document.querySelector('.history-timeline');
    const newEvent = document.createElement('div');
    newEvent.className = 'timeline-item';
    newEvent.innerHTML = `
        <div class="timeline-dot responded"></div>
        <div class="timeline-content">
            <p class="timeline-title">${title}</p>
            <p class="timeline-time">${time}</p>
            <p class="timeline-desc">${description}</p>
        </div>
    `;
    timeline.appendChild(newEvent);
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @media print {
            .back-navigation,
            .action-section,
            .sidebar-card,
            .breadcrumb-nav {
                display: none !important;
            }
            
            .message-detail-container {
                grid-template-columns: 1fr !important;
            }
            
            .message-card {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Auto-mark as read when page loads
window.addEventListener('load', function() {
    const readStatus = document.querySelector('.info-item:last-child .info-value');
    if (readStatus && readStatus.textContent === 'Unread') {
        setTimeout(() => {
            readStatus.textContent = 'Read';
            addTimelineEvent('Message Read', 'Just now', 'Opened in admin panel');
        }, 1000);
    }
});
