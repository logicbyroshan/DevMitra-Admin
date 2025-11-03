from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Notification


def manage_notifications(request):
    """Manage notifications view"""
    filter_type = request.GET.get('filter', 'all')
    
    notifications = Notification.objects.filter(is_active=True)
    
    # Apply filters
    if filter_type == 'unread':
        notifications = notifications.filter(is_read=False)
    elif filter_type == 'read':
        notifications = notifications.filter(is_read=True)
    elif filter_type in ['info', 'success', 'warning', 'error']:
        notifications = notifications.filter(notification_type=filter_type)
    
    # Get counts
    total_count = Notification.objects.filter(is_active=True).count()
    unread_count = Notification.objects.filter(is_active=True, is_read=False).count()
    read_count = Notification.objects.filter(is_active=True, is_read=True).count()
    info_count = Notification.objects.filter(is_active=True, notification_type='info').count()
    success_count = Notification.objects.filter(is_active=True, notification_type='success').count()
    warning_count = Notification.objects.filter(is_active=True, notification_type='warning').count()
    error_count = Notification.objects.filter(is_active=True, notification_type='error').count()
    
    context = {
        'notifications': notifications,
        'current_filter': filter_type,
        'total_count': total_count,
        'unread_count': unread_count,
        'read_count': read_count,
        'info_count': info_count,
        'success_count': success_count,
        'warning_count': warning_count,
        'error_count': error_count,
    }
    
    return render(request, 'manage_notifications.html', context)


def save_notification(request):
    """Save or update notification"""
    if request.method == 'POST':
        notification_id = request.POST.get('notification_id')
        
        if notification_id:
            notification = get_object_or_404(Notification, id=notification_id)
        else:
            notification = Notification()
        
        notification.title = request.POST.get('title')
        notification.message = request.POST.get('message')
        notification.notification_type = request.POST.get('notification_type')
        notification.link = request.POST.get('link') or None
        notification.link_text = request.POST.get('link_text') or None
        notification.save()
        
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})


def get_notification(request, id):
    """Get notification details"""
    notification = get_object_or_404(Notification, id=id)
    
    return JsonResponse({
        'success': True,
        'notification': {
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'notification_type': notification.notification_type,
            'link': notification.link or '',
            'link_text': notification.link_text or '',
        }
    })


def delete_notification(request, id):
    """Delete notification"""
    if request.method == 'POST':
        notification = get_object_or_404(Notification, id=id)
        notification.delete()
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})


def mark_notification_read(request, id):
    """Mark notification as read"""
    if request.method == 'POST':
        notification = get_object_or_404(Notification, id=id)
        notification.is_read = True
        notification.save()
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})


def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    if request.method == 'POST':
        Notification.objects.filter(is_active=True, is_read=False).update(is_read=True)
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'message': 'Invalid request'})
