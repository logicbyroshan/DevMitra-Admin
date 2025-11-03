from django.urls import path
from . import views
from . import notification_views
from django.views.generic import TemplateView

urlpatterns = [
    # Dashboard
    path("", views.dashboard, name="dashboard"),
    # API Documentation
    path("api-docs/", TemplateView.as_view(template_name="api_documentation.html"), name="api_documentation"),
    # Projects
    path("projects/", views.manage_projects, name="manage_projects"),
    path("projects/create/", views.create_project, name="create_project"),
    path("projects/<int:project_id>/edit/", views.edit_project, name="edit_project"),
    path(
        "projects/<int:project_id>/delete/", views.delete_project, name="delete_project"
    ),
    path("projects/list/", views.list_projects, name="list_projects"),
    # Experience
    path("experience/", views.manage_experience, name="manage_experience"),
    path("experience/create/", views.create_experience, name="create_experience"),
    path(
        "experience/<int:experience_id>/edit/",
        views.edit_experience,
        name="edit_experience",
    ),
    path(
        "experience/<int:experience_id>/delete/",
        views.delete_experience,
        name="delete_experience",
    ),
    path("experience/list/", views.list_experience, name="list_experience"),
    # Skills
    path("skills/", views.manage_skills, name="manage_skills"),
    path("skills/create/", views.create_skill, name="create_skill"),
    path("skills/<int:skill_id>/edit/", views.edit_skill, name="edit_skill"),
    path("skills/<int:skill_id>/delete/", views.delete_skill, name="delete_skill"),
    path("skills/list/", views.list_skills, name="list_skills"),
    # Achievements
    path("achievements/", views.manage_achievements, name="manage_achievements"),
    path("achievements/create/", views.create_achievement, name="create_achievement"),
    path("achievements/<int:achievement_id>/edit/", views.edit_achievement, name="edit_achievement"),
    path("achievements/<int:achievement_id>/delete/", views.delete_achievement, name="delete_achievement"),
    path("achievements/list/", views.list_achievements, name="list_achievements"),
    # Categories
    path("categories/", views.manage_categories, name="manage_categories"),
    # Analytics
    path("analytics/", views.manage_analytics, name="manage_analytics"),
    # Details
    path("details/", views.manage_details, name="manage_details"),
    # Notifications
    path("notifications/", notification_views.manage_notifications, name="manage_notifications"),
    path("notifications/save/", notification_views.save_notification, name="save_notification"),
    path("notifications/get/<int:id>/", notification_views.get_notification, name="get_notification"),
    path("notifications/delete/<int:id>/", notification_views.delete_notification, name="delete_notification"),
    path("notifications/mark-read/<int:id>/", notification_views.mark_notification_read, name="mark_notification_read"),
    path("notifications/mark-all-read/", notification_views.mark_all_notifications_read, name="mark_all_notifications_read"),
]
