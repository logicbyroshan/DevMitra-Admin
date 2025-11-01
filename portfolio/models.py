from django.db import models
from django.utils import timezone


class Category(models.Model):
    """Category model for projects, skills, achievements, and experience"""

    CATEGORY_TYPES = [
        ("project", "Project"),
        ("skill", "Skill"),
        ("achievement", "Achievement"),
        ("experience", "Experience"),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    category_type = models.CharField(
        max_length=20,
        choices=CATEGORY_TYPES,
        default="project",
        help_text="Type of category (Project, Skill, Achievement, or Experience)",
    )
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(
        max_length=50,
        default="fas fa-folder",
        help_text="FontAwesome icon class (e.g., 'fas fa-globe')",
    )
    color = models.CharField(
        max_length=7,
        default="#3b82f6",
        help_text="Hex color code (e.g., '#3b82f6')",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["category_type", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_category_type_display()})"

    def item_count(self):
        """Return the number of items in this category based on type"""
        if self.category_type == "project":
            return self.projects.count()
        elif self.category_type == "skill":
            return self.skills.count() if hasattr(self, "skills") else 0
        elif self.category_type == "achievement":
            return self.achievements.count() if hasattr(self, "achievements") else 0
        elif self.category_type == "experience":
            return self.experiences.count() if hasattr(self, "experiences") else 0
        return 0


class Project(models.Model):
    """Project model for portfolio projects"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("on-hold", "On Hold"),
        ("draft", "Draft"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    project_name = models.CharField(
        max_length=200, blank=True, help_text="Display name for the project"
    )
    documentation = models.TextField(
        blank=True, help_text="Project documentation in HTML format"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="projects"
    )

    # Technology and links
    technologies = models.CharField(
        max_length=500, help_text="Comma-separated list of technologies"
    )
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    demo_url = models.URLField(blank=True, null=True)
    other_url = models.URLField(blank=True, null=True, help_text="Other project link")

    # Project details
    thumbnail = models.ImageField(
        upload_to="projects/thumbnails/",
        blank=True,
        null=True,
        help_text="Project thumbnail image",
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    client = models.CharField(max_length=200, blank=True)

    # Status and visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    is_active = models.BooleanField(default=True, help_text="Show on website")
    is_featured = models.BooleanField(default=False)

    # Metadata
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    order = models.IntegerField(default=0, help_text="Display order")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-order", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def tech_list(self):
        """Return technologies as a list"""
        return [tech.strip() for tech in self.technologies.split(",") if tech.strip()]


class ProjectScreenshot(models.Model):
    """Model for storing multiple project screenshots"""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="screenshots"
    )
    image = models.ImageField(upload_to="projects/screenshots/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-uploaded_at"]

    def __str__(self):
        return f"{self.project.title} - Screenshot {self.id}"


class UserProfile(models.Model):
    """User profile model for personal information"""

    STATUS_CHOICES = [
        ("available", "Available for Work"),
        ("busy", "Busy"),
        ("not-looking", "Not Looking"),
    ]

    WORK_TYPE_CHOICES = [
        ("remote", "Remote"),
        ("hybrid", "Hybrid"),
        ("onsite", "On-site"),
        ("flexible", "Flexible"),
    ]

    # Personal Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=200, help_text="Professional title")
    bio = models.TextField(blank=True, help_text="About me description")

    # Profile Image
    profile_image = models.ImageField(upload_to="profile/", blank=True, null=True)

    # Social Links
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    website = models.URLField(blank=True)

    # Contact Information
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Documents
    resume = models.FileField(upload_to="documents/", blank=True, null=True)
    cover_letter = models.FileField(upload_to="documents/", blank=True, null=True)
    video_resume = models.URLField(blank=True, help_text="YouTube link to video resume")

    # SEO & Meta
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=300, blank=True)

    # Availability & Preferences
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="available"
    )
    work_type = models.CharField(
        max_length=20, choices=WORK_TYPE_CHOICES, default="remote"
    )
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    experience_years = models.IntegerField(default=0)
    open_to_opportunities = models.BooleanField(default=True)
    available_for_freelance = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return self.full_name
