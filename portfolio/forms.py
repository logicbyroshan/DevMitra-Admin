from django import forms
from .models import Project, Category, UserProfile


class ProjectForm(forms.ModelForm):
    """Form for creating and editing projects"""

    class Meta:
        model = Project
        fields = [
            "title",
            "project_name",
            "category",
            "description",
            "documentation",
            "technologies",
            "status",
            "is_active",
            "is_featured",
            "github_url",
            "live_url",
            "demo_url",
            "other_url",
            "start_date",
            "end_date",
            "client",
            "thumbnail",
            "order",
        ]
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Enter project title",
                    "required": True,
                }
            ),
            "project_name": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Enter project display name",
                }
            ),
            "category": forms.Select(attrs={"class": "form-input"}),
            "description": forms.Textarea(
                attrs={
                    "class": "form-textarea tinymce-editor",
                    "placeholder": "Full project description",
                    "rows": 6,
                    "required": True,
                    "id": "id_description",
                }
            ),
            "documentation": forms.Textarea(
                attrs={
                    "class": "form-textarea tinymce-editor",
                    "placeholder": "Project documentation (optional)",
                    "rows": 8,
                    "id": "id_documentation",
                }
            ),
            "technologies": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., React, Node.js, MongoDB (comma-separated)",
                    "required": True,
                }
            ),
            "status": forms.Select(attrs={"class": "form-input"}),
            "github_url": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://github.com/username/repo",
                }
            ),
            "live_url": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "https://example.com"}
            ),
            "demo_url": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "https://demo.example.com"}
            ),
            "other_url": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "https://other-link.com"}
            ),
            "start_date": forms.DateInput(
                attrs={"class": "form-input", "type": "date"}
            ),
            "end_date": forms.DateInput(attrs={"class": "form-input", "type": "date"}),
            "client": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Client name (optional)"}
            ),
            "thumbnail": forms.FileInput(
                attrs={
                    "class": "form-input",
                    "accept": "image/*",
                    "id": "id_thumbnail",
                }
            ),
            "order": forms.NumberInput(
                attrs={"class": "form-input", "placeholder": "0", "min": 0}
            ),
        }
        labels = {
            "title": "Project Title",
            "project_name": "Project Name",
            "category": "Category",
            "description": "Full Description",
            "documentation": "Project Documentation",
            "technologies": "Technologies Used",
            "status": "Project Status",
            "is_active": "Show on Website",
            "is_featured": "Featured Project",
            "github_url": "GitHub Repository URL",
            "live_url": "Live Project URL",
            "demo_url": "Demo URL",
            "other_url": "Other Link",
            "start_date": "Start Date",
            "end_date": "End Date",
            "client": "Client/Company",
            "thumbnail": "Project Thumbnail",
            "order": "Display Order",
        }


class CategoryForm(forms.ModelForm):
    """Form for creating and editing categories"""

    class Meta:
        model = Category
        fields = ["name", "slug", "category_type", "description", "icon", "color"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Category name",
                    "required": True,
                }
            ),
            "slug": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "URL-friendly slug (e.g., web-development)",
                    "required": True,
                }
            ),
            "category_type": forms.Select(
                attrs={
                    "class": "form-input",
                    "required": True,
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "placeholder": "Category description (optional)",
                    "rows": 3,
                }
            ),
            "icon": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "FontAwesome icon class (e.g., fas fa-globe)",
                }
            ),
            "color": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "type": "color",
                    "placeholder": "#3b82f6",
                }
            ),
        }


class UserProfileForm(forms.ModelForm):
    """Form for managing user profile details"""

    class Meta:
        model = UserProfile
        fields = "__all__"
        exclude = ["created_at", "updated_at"]

        widgets = {
            "full_name": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Enter your full name"}
            ),
            "email": forms.EmailInput(
                attrs={"class": "form-input", "placeholder": "Enter your email"}
            ),
            "phone": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Enter your phone"}
            ),
            "location": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Enter your location"}
            ),
            "title": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Enter your professional title",
                }
            ),
            "bio": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "rows": 5,
                    "placeholder": "Write a brief description about yourself",
                }
            ),
            "profile_image": forms.FileInput(
                attrs={"class": "form-input", "accept": "image/*"}
            ),
            # Social Links
            "github": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "GitHub profile URL"}
            ),
            "linkedin": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "LinkedIn profile URL"}
            ),
            "twitter": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "Twitter profile URL"}
            ),
            "instagram": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "Instagram profile URL"}
            ),
            "youtube": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "YouTube channel URL"}
            ),
            "website": forms.URLInput(
                attrs={"class": "form-input", "placeholder": "Portfolio website URL"}
            ),
            # Contact Information
            "contact_email": forms.EmailInput(
                attrs={"class": "form-input", "placeholder": "Public contact email"}
            ),
            "contact_phone": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Public contact phone"}
            ),
            "address": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Street address"}
            ),
            "city": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "City"}
            ),
            "state": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "State or region"}
            ),
            "country": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Country"}
            ),
            # Documents
            "resume": forms.FileInput(
                attrs={"class": "form-input", "accept": ".pdf,.doc,.docx"}
            ),
            "cover_letter": forms.FileInput(
                attrs={"class": "form-input", "accept": ".pdf,.doc,.docx"}
            ),
            "video_resume": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://www.youtube.com/watch?v=...",
                }
            ),
            # SEO & Meta
            "meta_title": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "SEO title for your portfolio",
                    "maxlength": 60,
                }
            ),
            "meta_description": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "rows": 3,
                    "placeholder": "SEO description for your portfolio",
                    "maxlength": 160,
                }
            ),
            "meta_keywords": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "Comma-separated keywords"}
            ),
            # Availability & Preferences
            "status": forms.Select(attrs={"class": "form-input"}),
            "work_type": forms.Select(attrs={"class": "form-input"}),
            "hourly_rate": forms.NumberInput(
                attrs={"class": "form-input", "placeholder": "Your hourly rate"}
            ),
            "experience_years": forms.NumberInput(
                attrs={"class": "form-input", "placeholder": "Years"}
            ),
            "open_to_opportunities": forms.CheckboxInput(
                attrs={"class": "form-checkbox"}
            ),
            "available_for_freelance": forms.CheckboxInput(
                attrs={"class": "form-checkbox"}
            ),
        }
