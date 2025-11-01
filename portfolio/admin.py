from django.contrib import admin
from .models import Project, Category, UserProfile, ProjectScreenshot

# Register your models here.


class ProjectScreenshotInline(admin.TabularInline):
    model = ProjectScreenshot
    extra = 1
    fields = ["image", "caption", "order"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "status", "created_at", "updated_at"]
    list_filter = ["category", "status", "created_at"]
    search_fields = ["title", "description", "project_name"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectScreenshotInline]


@admin.register(ProjectScreenshot)
class ProjectScreenshotAdmin(admin.ModelAdmin):
    list_display = ["project", "caption", "order", "uploaded_at"]
    list_filter = ["uploaded_at"]
    search_fields = ["project__title", "caption"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "category_type",
        "icon",
        "color",
        "item_count",
        "created_at",
    ]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ["category_type", "created_at"]

    def item_count(self, obj):
        return obj.item_count()

    item_count.short_description = "Items"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "status", "work_type", "updated_at"]
    list_filter = [
        "status",
        "work_type",
        "open_to_opportunities",
        "available_for_freelance",
    ]
    search_fields = ["full_name", "email", "title"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (
            "Personal Information",
            {"fields": ("full_name", "email", "phone", "location", "title", "bio")},
        ),
        ("Profile Image", {"fields": ("profile_image",)}),
        (
            "Social Links",
            {
                "fields": (
                    "github",
                    "linkedin",
                    "twitter",
                    "instagram",
                    "youtube",
                    "website",
                )
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "contact_email",
                    "contact_phone",
                    "address",
                    "city",
                    "state",
                    "country",
                )
            },
        ),
        ("Documents", {"fields": ("resume", "cover_letter", "video_resume")}),
        ("SEO & Meta", {"fields": ("meta_title", "meta_description", "meta_keywords")}),
        (
            "Availability & Preferences",
            {
                "fields": (
                    "status",
                    "work_type",
                    "hourly_rate",
                    "experience_years",
                    "open_to_opportunities",
                    "available_for_freelance",
                )
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
