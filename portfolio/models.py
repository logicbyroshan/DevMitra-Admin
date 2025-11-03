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


class Experience(models.Model):
    """Experience model for work experience"""

    EMPLOYMENT_TYPE_CHOICES = [
        ("full-time", "Full-time Employment"),
        ("part-time", "Part-time"),
        ("freelance", "Freelance"),
        ("contract", "Contract"),
        ("internship", "Internship"),
        ("volunteer", "Volunteer"),
    ]

    STATUS_CHOICES = [
        ("current", "Current"),
        ("past", "Past"),
    ]

    # Basic Information
    position = models.CharField(max_length=200, help_text="Job title/position")
    slug = models.SlugField(max_length=200, unique=True)
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default="full-time",
        help_text="Type of employment",
    )
    employment_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="current",
        help_text="Current or past employment",
    )
    location = models.CharField(
        max_length=200, blank=True, help_text="Work location or Remote"
    )

    # Company Information
    company_name = models.CharField(max_length=200)
    company_about = models.TextField(blank=True, help_text="Brief company description")
    company_website = models.URLField(blank=True, null=True)
    company_logo = models.ImageField(
        upload_to="experience/logos/",
        blank=True,
        null=True,
        help_text="Company logo image",
    )

    # Employment Duration
    start_date = models.DateField(help_text="Employment start date")
    end_date = models.DateField(
        null=True, blank=True, help_text="Employment end date (blank if current)"
    )
    currently_working = models.BooleanField(
        default=False, help_text="Currently working here"
    )

    # Description
    short_description = models.TextField(
        help_text="Brief summary of role and responsibilities"
    )
    detailed_description = models.TextField(
        blank=True, help_text="Detailed experience description in HTML format"
    )

    # Status and visibility
    is_active = models.BooleanField(default=True, help_text="Show on website")
    is_draft = models.BooleanField(default=False, help_text="Draft status")

    # Metadata
    order = models.IntegerField(default=0, help_text="Display order")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-order", "-start_date"]
        verbose_name = "Experience"
        verbose_name_plural = "Experiences"

    def __str__(self):
        return f"{self.position} at {self.company_name}"

    @property
    def duration(self):
        """Return formatted duration string"""
        start = self.start_date.strftime("%b %Y")
        if self.currently_working:
            return f"{start} - Present"
        elif self.end_date:
            end = self.end_date.strftime("%b %Y")
            return f"{start} - {end}"
        return start


class ExperienceImage(models.Model):
    """Model for storing workplace/experience images"""

    experience = models.ForeignKey(
        Experience, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="experience/images/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.experience.position} - Image {self.id}"


class Skill(models.Model):
    """Skill model for technical skills"""

    SKILL_LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
        ("expert", "Expert"),
    ]

    # Basic Information
    name = models.CharField(max_length=200, help_text="Skill name (e.g., Python, React)")
    slug = models.SlugField(max_length=200, unique=True)
    skill_level = models.CharField(
        max_length=20,
        choices=SKILL_LEVEL_CHOICES,
        default="intermediate",
        help_text="Proficiency level",
    )
    proficiency = models.IntegerField(
        default=50,
        help_text="Proficiency percentage (0-100)",
    )
    description = models.TextField(
        blank=True, help_text="Brief description of skill and experience"
    )

    # Icon Options
    icon_type = models.CharField(
        max_length=20,
        choices=[("upload", "Uploaded Icon"), ("fontawesome", "FontAwesome Icon")],
        default="upload",
        help_text="Type of icon (uploaded image or FontAwesome class)",
    )
    icon_image = models.ImageField(
        upload_to="skills/icons/",
        blank=True,
        null=True,
        help_text="Uploaded skill icon",
    )
    icon_class = models.CharField(
        max_length=100,
        blank=True,
        help_text="FontAwesome icon class (e.g., 'fab fa-react')",
    )

    # Certificate Options
    certificate_type = models.CharField(
        max_length=20,
        choices=[("file", "Certificate File"), ("link", "Certificate Link")],
        default="file",
        blank=True,
        help_text="Type of certificate",
    )
    certificate_file = models.FileField(
        upload_to="skills/certificates/",
        blank=True,
        null=True,
        help_text="Certificate file (PDF or image)",
    )
    certificate_url = models.URLField(
        blank=True, null=True, help_text="Certificate URL link"
    )

    # Status and visibility
    is_active = models.BooleanField(default=True, help_text="Show on website")
    is_draft = models.BooleanField(default=False, help_text="Draft status")

    # Metadata
    order = models.IntegerField(default=0, help_text="Display order")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-proficiency", "name"]
        verbose_name = "Skill"
        verbose_name_plural = "Skills"

    def __str__(self):
        return f"{self.name} ({self.get_skill_level_display()})"


class Achievement(models.Model):
    """Model for achievements, certifications, awards"""

    CATEGORY_CHOICES = [
        ("certification", "Certification"),
        ("award", "Award"),
        ("competition", "Competition"),
        ("recognition", "Recognition"),
        ("publication", "Publication"),
        ("patent", "Patent"),
    ]

    ICON_TYPE_CHOICES = [
        ("upload", "Upload Image"),
        ("fontawesome", "Font Awesome Icon"),
    ]

    CREDENTIAL_TYPE_CHOICES = [
        ("file", "Upload File"),
        ("link", "URL Link"),
    ]

    # Basic Information
    title = models.CharField(max_length=255, help_text="Achievement title")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, help_text="Achievement category"
    )
    issuing_organization = models.CharField(
        max_length=255, help_text="Organization that issued the achievement"
    )
    achievement_date = models.DateField(help_text="Date achievement was received")
    expiration_date = models.DateField(
        null=True, blank=True, help_text="Expiration date if applicable"
    )
    no_expiration = models.BooleanField(
        default=True, help_text="Check if achievement doesn't expire"
    )

    # Descriptions
    short_description = models.TextField(help_text="Brief description")
    full_description = models.TextField(
        blank=True, null=True, help_text="Detailed description (supports HTML)"
    )

    # Icon/Badge
    icon_type = models.CharField(
        max_length=20,
        choices=ICON_TYPE_CHOICES,
        default="upload",
        help_text="Icon type",
    )
    icon_image = models.ImageField(
        upload_to="achievements/icons/",
        null=True,
        blank=True,
        help_text="Upload icon/badge image",
    )
    icon_class = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Font Awesome icon class (e.g., fas fa-trophy)",
    )

    # Credential/Certificate
    credential_type = models.CharField(
        max_length=20,
        choices=CREDENTIAL_TYPE_CHOICES,
        default="file",
        help_text="Credential type",
    )
    credential_file = models.FileField(
        upload_to="achievements/credentials/",
        null=True,
        blank=True,
        help_text="Upload credential document",
    )
    credential_url = models.URLField(
        max_length=500, blank=True, null=True, help_text="Credential verification URL"
    )
    credential_id = models.CharField(
        max_length=255, blank=True, null=True, help_text="Credential ID"
    )

    # Additional Info
    related_link = models.URLField(
        max_length=500, blank=True, null=True, help_text="Related link"
    )

    # Status and visibility
    is_active = models.BooleanField(default=True, help_text="Show on website")
    is_draft = models.BooleanField(default=False, help_text="Draft status")

    # Metadata
    order = models.IntegerField(default=0, help_text="Display order")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-achievement_date", "title"]
        verbose_name = "Achievement"
        verbose_name_plural = "Achievements"

    def __str__(self):
        return f"{self.title} - {self.issuing_organization}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Notification(models.Model):
    """Notification model for system notifications"""

    NOTIFICATION_TYPES = [
        ("info", "Information"),
        ("success", "Success"),
        ("warning", "Warning"),
        ("error", "Error"),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20, choices=NOTIFICATION_TYPES, default="info"
    )
    link = models.CharField(
        max_length=500, blank=True, null=True, help_text="Optional link URL"
    )
    link_text = models.CharField(
        max_length=100, blank=True, null=True, help_text="Link button text"
    )

    # Status
    is_read = models.BooleanField(default=False)
    is_active = models.BooleanField(
        default=True, help_text="Show in notification list"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.title} ({self.get_notification_type_display()})"
