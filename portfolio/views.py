from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from .models import Project, Category, UserProfile, ProjectScreenshot
from .forms import ProjectForm, CategoryForm, UserProfileForm
import json


# Dashboard Views
def dashboard(request):
    """Main dashboard view"""
    return render(request, "dashboard.html")


# Project Views
def manage_projects(request):
    """Manage projects view with AJAX support"""
    if request.method == "POST":
        # Handle toggle active/inactive
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            project_id = request.POST.get("project_id")
            is_active = request.POST.get("is_active") == "true"

            try:
                project = Project.objects.get(id=project_id)
                project.is_active = is_active
                project.save()
                return JsonResponse(
                    {"success": True, "message": "Project status updated"}
                )
            except Project.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Project not found"}, status=404
                )

    # Get all projects
    active_projects = Project.objects.filter(status="active", is_active=True)[:5]
    draft_projects = Project.objects.filter(status="draft")[:5]

    context = {
        "active_projects": active_projects,
        "draft_projects": draft_projects,
        "active_count": Project.objects.filter(status="active", is_active=True).count(),
        "draft_count": Project.objects.filter(status="draft").count(),
    }
    return render(request, "manage_projects.html", context)


def create_project(request):
    """Create new project view with AJAX support"""
    if request.method == "POST":
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            project = form.save()

            # Handle screenshot uploads
            screenshot_files = request.FILES.getlist("screenshots")
            for index, screenshot_file in enumerate(screenshot_files):
                ProjectScreenshot.objects.create(
                    project=project, image=screenshot_file, order=index
                )

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Project created successfully!",
                        "project_id": project.id,
                        "redirect_url": "/projects/",
                    }
                )
            else:
                messages.success(request, "Project created successfully!")
                return redirect("manage_projects")
        else:
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {"success": False, "errors": form.errors}, status=400
                )
    else:
        form = ProjectForm()

    categories = Category.objects.all()
    context = {
        "form": form,
        "categories": categories,
    }
    return render(request, "create_project.html", context)


def edit_project(request, project_id):
    """Edit existing project"""
    project = get_object_or_404(Project, id=project_id)

    if request.method == "POST":
        form = ProjectForm(request.POST, request.FILES, instance=project)
        if form.is_valid():
            project = form.save()

            # Handle screenshot uploads
            screenshot_files = request.FILES.getlist("screenshots")
            if screenshot_files:
                # Delete old screenshots if new ones are uploaded
                project.screenshots.all().delete()

                # Add new screenshots
                for index, screenshot_file in enumerate(screenshot_files):
                    ProjectScreenshot.objects.create(
                        project=project, image=screenshot_file, order=index
                    )

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Project updated successfully!",
                        "redirect_url": "/projects/",
                    }
                )
            else:
                messages.success(request, "Project updated successfully!")
                return redirect("manage_projects")
        else:
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {"success": False, "errors": form.errors}, status=400
                )
    else:
        form = ProjectForm(instance=project)

    categories = Category.objects.all()
    context = {
        "form": form,
        "project": project,
        "categories": categories,
        "is_edit": True,
    }
    return render(request, "create_project.html", context)


def delete_project(request, project_id):
    """Delete project"""
    if request.method == "POST":
        project = get_object_or_404(Project, id=project_id)
        project_title = project.title
        project.delete()

        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse(
                {
                    "success": True,
                    "message": f'Project "{project_title}" deleted successfully!',
                }
            )
        else:
            messages.success(
                request, f'Project "{project_title}" deleted successfully!'
            )
            return redirect("manage_projects")

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


def list_projects(request):
    """List all projects view with filtering"""
    filter_type = request.GET.get("filter", "all")

    if filter_type == "active":
        projects = Project.objects.filter(status="active", is_active=True)
    elif filter_type == "completed":
        projects = Project.objects.filter(status="completed")
    elif filter_type == "on-hold":
        projects = Project.objects.filter(status="on-hold")
    elif filter_type == "draft":
        projects = Project.objects.filter(status="draft")
    else:
        projects = Project.objects.all()

    context = {
        "projects": projects,
        "current_filter": filter_type,
        "total_count": Project.objects.count(),
        "active_count": Project.objects.filter(status="active", is_active=True).count(),
        "completed_count": Project.objects.filter(status="completed").count(),
        "on_hold_count": Project.objects.filter(status="on-hold").count(),
        "draft_count": Project.objects.filter(status="draft").count(),
    }
    return render(request, "list_projects.html", context)


# Experience Views
def manage_experience(request):
    """Manage experience view"""
    return render(request, "manage_experience.html")


def create_experience(request):
    """Create new experience view"""
    return render(request, "create_experience.html")


def list_experience(request):
    """List all experience view"""
    return render(request, "list_experience.html")


# Skills Views
def manage_skills(request):
    """Manage skills view"""
    return render(request, "manage_skills.html")


def create_skill(request):
    """Create new skill view"""
    return render(request, "create_skill.html")


def list_skills(request):
    """List all skills view"""
    return render(request, "list_skills.html")


# Achievements Views
def manage_achievements(request):
    """Manage achievements view"""
    return render(request, "manage_achievements.html")


def create_achievement(request):
    """Create new achievement view"""
    return render(request, "create_achievement.html")


def list_achievements(request):
    """List all achievements view"""
    return render(request, "list_achievements.html")


# Categories Views
def manage_categories(request):
    """Manage categories view with AJAX support"""
    if (
        request.method == "POST"
        and request.headers.get("X-Requested-With") == "XMLHttpRequest"
    ):
        action = request.POST.get("action")

        # Create new category
        if action == "create":
            form = CategoryForm(request.POST)
            if form.is_valid():
                category = form.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Category created successfully!",
                        "category": {
                            "id": category.id,
                            "name": category.name,
                            "slug": category.slug,
                            "category_type": category.category_type,
                            "category_type_display": category.get_category_type_display(),
                            "description": category.description or "",
                            "icon": category.icon,
                            "color": category.color,
                            "item_count": category.item_count(),
                        },
                    }
                )
            else:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Invalid data. Please check the form.",
                        "errors": form.errors,
                    }
                )

        # Update category
        elif action == "update":
            category_id = request.POST.get("category_id")
            try:
                category = Category.objects.get(id=category_id)
                form = CategoryForm(request.POST, instance=category)
                if form.is_valid():
                    category = form.save()
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "Category updated successfully!",
                            "category": {
                                "id": category.id,
                                "name": category.name,
                                "slug": category.slug,
                                "category_type": category.category_type,
                                "category_type_display": category.get_category_type_display(),
                                "description": category.description or "",
                                "icon": category.icon,
                                "color": category.color,
                                "item_count": category.item_count(),
                            },
                        }
                    )
                else:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Invalid data. Please check the form.",
                            "errors": form.errors,
                        }
                    )
            except Category.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Category not found."}
                )

        # Delete category
        elif action == "delete":
            category_id = request.POST.get("category_id")
            try:
                category = Category.objects.get(id=category_id)
                category_name = category.name
                category.delete()
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"Category '{category_name}' deleted successfully!",
                    }
                )
            except Category.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Category not found."}
                )

        # Get category for editing
        elif action == "get":
            category_id = request.POST.get("category_id")
            try:
                category = Category.objects.get(id=category_id)
                return JsonResponse(
                    {
                        "success": True,
                        "category": {
                            "id": category.id,
                            "name": category.name,
                            "slug": category.slug,
                            "category_type": category.category_type,
                            "description": category.description or "",
                            "icon": category.icon,
                            "color": category.color,
                        },
                    }
                )
            except Category.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Category not found."}
                )

    # GET request - display categories
    categories = Category.objects.all()
    form = CategoryForm()
    context = {"categories": categories, "form": form}
    return render(request, "manage_categories.html", context)


# Analytics Views
def manage_analytics(request):
    """Manage analytics view"""
    return render(request, "manage_analytics.html")


def list_contact_responses(request):
    """List all contact responses view"""
    return render(request, "list_contact_responses.html")


def contact_response_detail(request, response_id):
    """View single contact response detail"""
    return render(request, "contact_response_detail.html")


# Details Views
def manage_details(request):
    """Manage user profile details with AJAX support"""
    # Get or create user profile (assuming single user)
    profile, created = UserProfile.objects.get_or_create(
        id=1,
        defaults={
            "full_name": "Your Name",
            "email": "your.email@example.com",
            "title": "Your Professional Title",
        },
    )

    if request.method == "POST":
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            # Handle AJAX form submissions
            form_type = request.POST.get("form_type")

            if form_type == "personal_info":
                profile.full_name = request.POST.get("full_name", profile.full_name)
                profile.email = request.POST.get("email", profile.email)
                profile.phone = request.POST.get("phone", "")
                profile.location = request.POST.get("location", "")
                profile.title = request.POST.get("title", profile.title)
                profile.bio = request.POST.get("bio", "")
                profile.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Personal information updated successfully!",
                    }
                )

            elif form_type == "social_links":
                profile.github = request.POST.get("github", "")
                profile.linkedin = request.POST.get("linkedin", "")
                profile.twitter = request.POST.get("twitter", "")
                profile.instagram = request.POST.get("instagram", "")
                profile.youtube = request.POST.get("youtube", "")
                profile.website = request.POST.get("website", "")
                profile.save()
                return JsonResponse(
                    {"success": True, "message": "Social links updated successfully!"}
                )

            elif form_type == "contact_info":
                profile.contact_email = request.POST.get("contact_email", "")
                profile.contact_phone = request.POST.get("contact_phone", "")
                profile.address = request.POST.get("address", "")
                profile.city = request.POST.get("city", "")
                profile.state = request.POST.get("state", "")
                profile.country = request.POST.get("country", "")
                profile.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Contact information updated successfully!",
                    }
                )

            elif form_type == "seo":
                profile.meta_title = request.POST.get("meta_title", "")
                profile.meta_description = request.POST.get("meta_description", "")
                profile.meta_keywords = request.POST.get("meta_keywords", "")
                profile.save()
                return JsonResponse(
                    {"success": True, "message": "SEO settings updated successfully!"}
                )

            elif form_type == "preferences":
                profile.status = request.POST.get("status", "available")
                profile.work_type = request.POST.get("work_type", "remote")
                profile.hourly_rate = request.POST.get("hourly_rate") or None
                profile.experience_years = request.POST.get("experience_years", 0)
                profile.open_to_opportunities = (
                    request.POST.get("open_to_opportunities") == "on"
                )
                profile.available_for_freelance = (
                    request.POST.get("available_for_freelance") == "on"
                )
                profile.save()
                return JsonResponse(
                    {"success": True, "message": "Preferences updated successfully!"}
                )

            elif form_type == "profile_image":
                if "profile_image" in request.FILES:
                    profile.profile_image = request.FILES["profile_image"]
                    profile.save()
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "Profile image updated successfully!",
                            "image_url": (
                                profile.profile_image.url
                                if profile.profile_image
                                else None
                            ),
                        }
                    )
                return JsonResponse(
                    {"success": False, "message": "No image file provided"}
                )

            elif form_type == "delete_profile_image":
                if profile.profile_image:
                    profile.profile_image.delete()
                    profile.save()
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "Profile image deleted successfully!",
                        }
                    )
                return JsonResponse(
                    {"success": False, "message": "No profile image to delete"}
                )

            elif form_type == "upload_resume":
                if "resume" in request.FILES:
                    profile.resume = request.FILES["resume"]
                    profile.save()
                    return JsonResponse(
                        {"success": True, "message": "Resume uploaded successfully!"}
                    )
                return JsonResponse({"success": False, "message": "No file provided"})

            elif form_type == "upload_cover_letter":
                if "cover_letter" in request.FILES:
                    profile.cover_letter = request.FILES["cover_letter"]
                    profile.save()
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "Cover letter uploaded successfully!",
                        }
                    )
                return JsonResponse({"success": False, "message": "No file provided"})

            elif form_type == "delete_resume":
                if profile.resume:
                    profile.resume.delete()
                    profile.save()
                    return JsonResponse(
                        {"success": True, "message": "Resume deleted successfully!"}
                    )
                return JsonResponse(
                    {"success": False, "message": "No resume to delete"}
                )

            elif form_type == "delete_cover_letter":
                if profile.cover_letter:
                    profile.cover_letter.delete()
                    profile.save()
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "Cover letter deleted successfully!",
                        }
                    )
                return JsonResponse(
                    {"success": False, "message": "No cover letter to delete"}
                )

            elif form_type == "video_resume":
                profile.video_resume = request.POST.get("video_resume", "")
                profile.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Video resume link updated successfully!",
                    }
                )

            return JsonResponse({"success": False, "message": "Invalid form type"})

    form = UserProfileForm(instance=profile)
    context = {
        "profile": profile,
        "form": form,
    }
    return render(request, "manage_details.html", context)
