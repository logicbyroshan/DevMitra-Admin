from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from .models import (
    Project,
    Category,
    UserProfile,
    ProjectScreenshot,
    Experience,
    ExperienceImage,
    Skill,
    Achievement,
    Notification,
)
from .forms import ProjectForm, CategoryForm, UserProfileForm, ExperienceForm, SkillForm, AchievementForm
from django.utils.text import slugify
import json


# Dashboard Views
def dashboard(request):
    """Main dashboard view with real data"""
    from django.db.models import Count
    
    # Get counts
    total_projects = Project.objects.count()
    total_experience = Experience.objects.count()
    total_achievements = Achievement.objects.count()
    total_skills = Skill.objects.count()
    
    # Get recent items (last 3)
    recent_projects = Project.objects.order_by('-created_at')[:3]
    recent_experience = Experience.objects.order_by('-start_date')[:3]
    recent_achievements = Achievement.objects.order_by('-achievement_date')[:3]
    
    # Get top 5 skills (by proficiency percentage)
    top_skills = Skill.objects.filter(is_active=True).order_by('-proficiency')[:5]
    
    # Get category counts (top 5 only)
    category_counts = Project.objects.values('category__name', 'category__icon').annotate(count=Count('id')).order_by('-count')[:5]
    
    context = {
        'total_projects': total_projects,
        'total_experience': total_experience,
        'total_achievements': total_achievements,
        'total_skills': total_skills,
        'recent_projects': recent_projects,
        'recent_experience': recent_experience,
        'recent_achievements': recent_achievements,
        'top_skills': top_skills,
        'category_counts': category_counts,
    }
    
    return render(request, "dashboard.html", context)


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

    # Get recent projects (latest 6 projects regardless of status)
    recent_projects = Project.objects.all().order_by('-created_at')[:6]

    context = {
        "recent_projects": recent_projects,
        "total_count": Project.objects.count(),
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

    if filter_type == "draft":
        projects = Project.objects.filter(status="draft")
    else:
        projects = Project.objects.all()

    context = {
        "projects": projects,
        "current_filter": filter_type,
        "total_count": Project.objects.count(),
        "draft_count": Project.objects.filter(status="draft").count(),
    }
    return render(request, "list_projects.html", context)


# Experience Views
def manage_experience(request):
    """Manage experience view"""
    if request.method == "POST":
        # Handle toggle active/inactive
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            experience_id = request.POST.get("experience_id")
            is_active = request.POST.get("is_active") == "true"

            try:
                experience = Experience.objects.get(id=experience_id)
                experience.is_active = is_active
                experience.save()
                return JsonResponse(
                    {"success": True, "message": "Experience status updated"}
                )
            except Experience.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Experience not found"}, status=404
                )

    experiences = Experience.objects.all()[:6]  # Get latest 6
    total_count = Experience.objects.count()

    context = {
        "experiences": experiences,
        "total_count": total_count,
    }
    return render(request, "manage_experience.html", context)


def create_experience(request):
    """Create new experience view"""
    if request.method == "POST":
        # Handle month input conversion to date
        post_data = request.POST.copy()
        
        # Convert start_date from YYYY-MM to YYYY-MM-01
        if 'start_date' in post_data and post_data['start_date']:
            start_date = post_data['start_date']
            if len(start_date) == 7:  # Format: YYYY-MM
                post_data['start_date'] = f"{start_date}-01"
                print(f"Converted start_date: {start_date} -> {post_data['start_date']}")
        
        # Convert end_date from YYYY-MM to YYYY-MM-01
        if 'end_date' in post_data and post_data['end_date']:
            end_date = post_data['end_date']
            if len(end_date) == 7:  # Format: YYYY-MM
                post_data['end_date'] = f"{end_date}-01"
                print(f"Converted end_date: {end_date} -> {post_data['end_date']}")
        
        # Set default order if not provided
        if 'order' not in post_data or not post_data['order']:
            post_data['order'] = '0'
            print("Set default order to 0")
        
        print(f"Final POST data - start_date: {post_data.get('start_date')}, end_date: {post_data.get('end_date')}, order: {post_data.get('order')}")
        
        form = ExperienceForm(post_data, request.FILES)
        if form.is_valid():
            experience = form.save(commit=False)

            # Handle draft status from button click
            is_draft = request.POST.get("is_draft", "false")
            experience.is_draft = is_draft == "true"

            # Generate slug from position
            if not experience.slug:
                base_slug = slugify(experience.position)
                slug = base_slug
                counter = 1
                while Experience.objects.filter(slug=slug).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                experience.slug = slug

            experience.save()

            # Handle workplace image uploads
            workplace_files = request.FILES.getlist("workplace_images")
            for index, image_file in enumerate(workplace_files):
                ExperienceImage.objects.create(
                    experience=experience, image=image_file, order=index
                )

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Experience created successfully!",
                        "experience_id": experience.id,
                        "redirect_url": "/experience/",
                    }
                )
            else:
                messages.success(request, "Experience created successfully!")
                return redirect("manage_experience")
        else:
            # Print form errors to console for debugging
            print("Form validation errors:")
            print(form.errors)
            print("POST data:", request.POST)
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {"success": False, "errors": form.errors}, status=400
                )
            # Pass form with errors back to template
            messages.error(request, "Please correct the errors below.")
    else:
        form = ExperienceForm()

    context = {
        "form": form,
    }
    return render(request, "create_experience.html", context)


def edit_experience(request, experience_id):
    """Edit existing experience"""
    experience = get_object_or_404(Experience, id=experience_id)

    if request.method == "POST":
        # Handle month input conversion to date
        post_data = request.POST.copy()
        
        # Convert start_date from YYYY-MM to YYYY-MM-01
        if 'start_date' in post_data and post_data['start_date']:
            start_date = post_data['start_date']
            if len(start_date) == 7:  # Format: YYYY-MM
                post_data['start_date'] = f"{start_date}-01"
        
        # Convert end_date from YYYY-MM to YYYY-MM-01
        if 'end_date' in post_data and post_data['end_date']:
            end_date = post_data['end_date']
            if len(end_date) == 7:  # Format: YYYY-MM
                post_data['end_date'] = f"{end_date}-01"
        
        form = ExperienceForm(post_data, request.FILES, instance=experience)
        if form.is_valid():
            experience = form.save()

            # Handle workplace image uploads
            workplace_files = request.FILES.getlist("workplace_images")
            if workplace_files:
                # Delete old images if new ones are uploaded
                experience.images.all().delete()

                # Add new images
                for index, image_file in enumerate(workplace_files):
                    ExperienceImage.objects.create(
                        experience=experience, image=image_file, order=index
                    )

            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Experience updated successfully!",
                        "redirect_url": "/experience/",
                    }
                )
            else:
                messages.success(request, "Experience updated successfully!")
                return redirect("manage_experience")
        else:
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse(
                    {"success": False, "errors": form.errors}, status=400
                )
    else:
        form = ExperienceForm(instance=experience)

    context = {
        "form": form,
        "experience": experience,
        "is_edit": True,
    }
    return render(request, "create_experience.html", context)


def delete_experience(request, experience_id):
    """Delete experience"""
    if request.method == "POST":
        experience = get_object_or_404(Experience, id=experience_id)
        position = experience.position
        experience.delete()

        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse(
                {
                    "success": True,
                    "message": f'Experience "{position}" deleted successfully!',
                }
            )
        else:
            messages.success(request, f'Experience "{position}" deleted successfully!')
            return redirect("manage_experience")

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


def list_experience(request):
    """List all experience view"""
    filter_type = request.GET.get("filter", "all")

    if filter_type == "draft":
        experiences = Experience.objects.filter(is_draft=True)
    else:
        experiences = Experience.objects.all()

    context = {
        "experiences": experiences,
        "current_filter": filter_type,
        "total_count": Experience.objects.count(),
        "draft_count": Experience.objects.filter(is_draft=True).count(),
    }
    return render(request, "list_experience.html", context)


# Skills Views
def manage_skills(request):
    """Manage skills view - show recent 6 skills only"""
    # Handle AJAX toggle
    if (
        request.method == "POST"
        and request.headers.get("X-Requested-With") == "XMLHttpRequest"
    ):
        skill_id = request.POST.get("skill_id")
        is_active = request.POST.get("is_active") == "true"

        try:
            skill = Skill.objects.get(id=skill_id)
            skill.is_active = is_active
            skill.save()
            return JsonResponse({"success": True, "message": "Skill status updated!"})
        except Skill.DoesNotExist:
            return JsonResponse({"success": False, "error": "Skill not found"}, status=404)

    # Get latest 6 skills (regardless of draft status)
    recent_skills = Skill.objects.all().order_by("-created_at")[:6]
    total_count = Skill.objects.count()

    context = {
        "recent_skills": recent_skills,
        "total_count": total_count,
    }
    return render(request, "manage_skills.html", context)


def create_skill(request):
    """Create new skill view"""
    if request.method == "POST":
        form = SkillForm(request.POST, request.FILES)
        if form.is_valid():
            skill = form.save(commit=False)
            
            # Generate slug from name
            from django.utils.text import slugify
            skill.slug = slugify(skill.name)
            
            # Set default order if not provided
            if not skill.order:
                skill.order = 0
            
            skill.save()
            messages.success(request, f"Skill '{skill.name}' created successfully!")
            return redirect("manage_skills")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SkillForm()
    
    return render(request, "create_skill.html", {"form": form})


def list_skills(request):
    """List all skills view with filtering (All/Draft only)"""
    filter_type = request.GET.get("filter", "all")

    if filter_type == "draft":
        skills = Skill.objects.filter(is_draft=True).order_by("-created_at")
    else:  # all
        skills = Skill.objects.all().order_by("-created_at")

    # Get counts
    total_count = Skill.objects.count()
    draft_count = Skill.objects.filter(is_draft=True).count()

    context = {
        "skills": skills,
        "current_filter": filter_type,
        "total_count": total_count,
        "draft_count": draft_count,
    }
    return render(request, "list_skills.html", context)


def edit_skill(request, skill_id):
    """Edit skill view"""
    skill = get_object_or_404(Skill, id=skill_id)

    if request.method == "POST":
        form = SkillForm(request.POST, request.FILES, instance=skill)
        if form.is_valid():
            form.save()
            messages.success(request, f"Skill '{skill.name}' updated successfully!")
            return redirect("manage_skills")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SkillForm(instance=skill)

    return render(request, "create_skill.html", {"form": form, "skill": skill})


def delete_skill(request, skill_id):
    """Delete skill"""
    if request.method == "POST":
        skill = get_object_or_404(Skill, id=skill_id)
        skill_name = skill.name
        skill.delete()

        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse(
                {
                    "success": True,
                    "message": f'Skill "{skill_name}" deleted successfully!',
                }
            )
        else:
            messages.success(request, f'Skill "{skill_name}" deleted successfully!')
            return redirect("manage_skills")

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


# Achievements Views
def manage_achievements(request):
    """Manage achievements view - show recent 6 achievements"""
    if request.method == "POST" and request.headers.get("X-Requested-With") == "XMLHttpRequest":
        achievement_id = request.POST.get("achievement_id")
        is_active = request.POST.get("is_active") == "true"

        try:
            achievement = Achievement.objects.get(id=achievement_id)
            achievement.is_active = is_active
            achievement.save()
            return JsonResponse({"success": True})
        except Achievement.DoesNotExist:
            return JsonResponse({"success": False, "error": "Achievement not found"})

    recent_achievements = Achievement.objects.all().order_by("-created_at")[:6]
    total_count = Achievement.objects.count()

    context = {
        "recent_achievements": recent_achievements,
        "total_count": total_count,
    }
    return render(request, "manage_achievements.html", context)


def create_achievement(request):
    """Create new achievement view"""
    if request.method == "POST":
        form = AchievementForm(request.POST, request.FILES)
        if form.is_valid():
            achievement = form.save(commit=False)
            
            # Generate slug if not provided
            if not achievement.slug:
                achievement.slug = slugify(achievement.title)
            
            achievement.save()
            messages.success(request, f'Achievement "{achievement.title}" created successfully!')
            return redirect("manage_achievements")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = AchievementForm()

    return render(request, "create_achievement.html", {"form": form})


def edit_achievement(request, achievement_id):
    """Edit achievement view"""
    achievement = get_object_or_404(Achievement, id=achievement_id)

    if request.method == "POST":
        form = AchievementForm(request.POST, request.FILES, instance=achievement)
        if form.is_valid():
            achievement = form.save()
            messages.success(request, f'Achievement "{achievement.title}" updated successfully!')
            return redirect("manage_achievements")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = AchievementForm(instance=achievement)

    context = {
        "form": form,
        "achievement": achievement,
        "is_edit": True,
    }
    return render(request, "create_achievement.html", context)


def delete_achievement(request, achievement_id):
    """Delete achievement"""
    if request.method == "POST":
        achievement = get_object_or_404(Achievement, id=achievement_id)
        achievement_title = achievement.title
        achievement.delete()

        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse(
                {
                    "success": True,
                    "message": f'Achievement "{achievement_title}" deleted successfully!',
                }
            )
        else:
            messages.success(request, f'Achievement "{achievement_title}" deleted successfully!')
            return redirect("manage_achievements")

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


def list_achievements(request):
    """List all achievements view"""
    filter_type = request.GET.get("filter", "all")

    if filter_type == "draft":
        achievements = Achievement.objects.filter(is_draft=True)
    else:
        achievements = Achievement.objects.all()

    achievements = achievements.order_by("-achievement_date")

    # Count for filters
    total_count = Achievement.objects.count()
    draft_count = Achievement.objects.filter(is_draft=True).count()

    context = {
        "achievements": achievements,
        "current_filter": filter_type,
        "total_count": total_count,
        "draft_count": draft_count,
    }
    return render(request, "list_achievements.html", context)


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
    
    # Check if resume and cover letter files exist
    resume_exists = False
    resume_size = 0
    if profile.resume:
        try:
            resume_exists = profile.resume.storage.exists(profile.resume.name)
            if resume_exists:
                resume_size = profile.resume.size
        except:
            resume_exists = False
    
    cover_letter_exists = False
    cover_letter_size = 0
    if profile.cover_letter:
        try:
            cover_letter_exists = profile.cover_letter.storage.exists(profile.cover_letter.name)
            if cover_letter_exists:
                cover_letter_size = profile.cover_letter.size
        except:
            cover_letter_exists = False
    
    context = {
        "profile": profile,
        "form": form,
        "resume_exists": resume_exists,
        "resume_size": resume_size,
        "cover_letter_exists": cover_letter_exists,
        "cover_letter_size": cover_letter_size,
    }
    return render(request, "manage_details.html", context)
