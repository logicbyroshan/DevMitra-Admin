from .models import Notification


def notifications_context(request):
    """Add notification data to all templates"""
    recent_notifications = Notification.objects.filter(is_active=True).order_by('-created_at')[:3]
    unread_count = Notification.objects.filter(is_active=True, is_read=False).count()
    
    return {
        'recent_notifications': recent_notifications,
        'unread_count': unread_count,
    }
