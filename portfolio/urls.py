from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path("", views.dashboard, name="dashboard"),
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
    path("experience/list/", views.list_experience, name="list_experience"),
    # Skills
    path("skills/", views.manage_skills, name="manage_skills"),
    path("skills/create/", views.create_skill, name="create_skill"),
    path("skills/list/", views.list_skills, name="list_skills"),
    # Achievements
    path("achievements/", views.manage_achievements, name="manage_achievements"),
    path("achievements/create/", views.create_achievement, name="create_achievement"),
    path("achievements/list/", views.list_achievements, name="list_achievements"),
    # Categories
    path("categories/", views.manage_categories, name="manage_categories"),
    # Analytics
    path("analytics/", views.manage_analytics, name="manage_analytics"),
    path(
        "analytics/contact-responses/",
        views.list_contact_responses,
        name="list_contact_responses",
    ),
    path(
        "analytics/contact-responses/<int:response_id>/",
        views.contact_response_detail,
        name="contact_response_detail",
    ),
    # Details
    path("details/", views.manage_details, name="manage_details"),
]
