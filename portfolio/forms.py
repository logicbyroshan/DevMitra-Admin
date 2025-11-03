from django import forms
from .models import Project, Category, UserProfile, Experience, Skill, Achievement


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


class ExperienceForm(forms.ModelForm):
    """Form for creating and editing work experience"""

    class Meta:
        model = Experience
        fields = [
            "position",
            "employment_type",
            "employment_status",
            "location",
            "company_name",
            "company_about",
            "company_website",
            "company_logo",
            "start_date",
            "end_date",
            "currently_working",
            "short_description",
            "detailed_description",
            "is_active",
            "is_draft",
            "order",
        ]
        widgets = {
            "position": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., Senior Full Stack Developer",
                    "required": True,
                    "id": "id_position",
                }
            ),
            "employment_type": forms.Select(
                attrs={"class": "form-input", "required": True, "id": "id_employment_type"}
            ),
            "employment_status": forms.Select(
                attrs={"class": "form-input", "required": True, "id": "id_employment_status"}
            ),
            "location": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., San Francisco, CA or Remote",
                    "id": "id_location",
                }
            ),
            "company_name": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Enter company name",
                    "required": True,
                    "id": "id_company_name",
                }
            ),
            "company_about": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "placeholder": "Brief description of the company",
                    "rows": 3,
                    "id": "id_company_about",
                }
            ),
            "company_website": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://company.com",
                    "id": "id_company_website",
                }
            ),
            "company_logo": forms.FileInput(
                attrs={
                    "class": "form-input",
                    "accept": "image/*",
                    "id": "id_company_logo",
                }
            ),
            "start_date": forms.DateInput(
                attrs={
                    "class": "form-input",
                    "type": "date",
                    "required": True,
                    "id": "id_start_date",
                }
            ),
            "end_date": forms.DateInput(
                attrs={"class": "form-input", "type": "date", "id": "id_end_date"}
            ),
            "currently_working": forms.CheckboxInput(
                attrs={"class": "form-checkbox", "id": "currently-working"}
            ),
            "short_description": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "placeholder": "Brief summary of your role and responsibilities",
                    "rows": 3,
                    "required": True,
                    "id": "id_short_description",
                }
            ),
            "detailed_description": forms.Textarea(
                attrs={
                    "class": "form-textarea tinymce-editor",
                    "id": "experience-details",
                }
            ),
            "is_active": forms.CheckboxInput(attrs={"class": "form-checkbox"}),
            "is_draft": forms.CheckboxInput(attrs={"class": "form-checkbox"}),
            "order": forms.NumberInput(
                attrs={"class": "form-input", "placeholder": "0", "min": 0, "value": "0"}
            ),
        }
        labels = {
            "position": "Position Title",
            "employment_type": "Category",
            "employment_status": "Employment Status",
            "location": "Location",
            "company_name": "Company Name",
            "company_about": "About Company",
            "company_website": "Company Website",
            "company_logo": "Company Logo",
            "start_date": "Start Date",
            "end_date": "End Date",
            "currently_working": "I currently work here",
            "short_description": "Short Description",
            "detailed_description": "Detailed Description",
            "is_active": "Show on Website",
            "is_draft": "Save as Draft",
            "order": "Display Order",
        }


class SkillForm(forms.ModelForm):
    """Form for creating and editing skills"""

    class Meta:
        model = Skill
        fields = [
            "name",
            "skill_level",
            "proficiency",
            "description",
            "icon_type",
            "icon_image",
            "icon_class",
            "certificate_type",
            "certificate_file",
            "certificate_url",
            "is_active",
            "is_draft",
            "order",
        ]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., JavaScript, React, Python",
                }
            ),
            "skill_level": forms.Select(attrs={"class": "form-input"}),
            "proficiency": forms.NumberInput(
                attrs={
                    "class": "form-input",
                    "min": 0,
                    "max": 100,
                    "id": "proficiency-input",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "rows": 4,
                    "placeholder": "Brief description of your skill level and experience",
                }
            ),
            "icon_type": forms.RadioSelect(),
            "icon_image": forms.FileInput(attrs={"accept": "image/*"}),
            "icon_class": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., fab fa-react",
                    "id": "fa-class-input",
                }
            ),
            "certificate_type": forms.RadioSelect(),
            "certificate_file": forms.FileInput(attrs={"accept": ".pdf,image/*"}),
            "certificate_url": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://certificates.example.com/your-certificate",
                }
            ),
            "is_active": forms.CheckboxInput(),
            "is_draft": forms.CheckboxInput(),
            "order": forms.NumberInput(
                attrs={"class": "form-input", "placeholder": "0", "min": 0}
            ),
        }
        labels = {
            "name": "Skill Name",
            "skill_level": "Skill Level",
            "proficiency": "Proficiency (%)",
            "description": "Description",
            "icon_type": "Icon Method",
            "icon_image": "Upload Custom Icon",
            "icon_class": "FontAwesome Class",
            "certificate_type": "Certificate Method",
            "certificate_file": "Upload Certificate File",
            "certificate_url": "Certificate URL",
            "is_active": "Show on Website",
            "is_draft": "Save as Draft",
            "order": "Display Order",
        }


class AchievementForm(forms.ModelForm):
    """Form for creating and editing achievements"""

    class Meta:
        model = Achievement
        fields = [
            "title",
            "category",
            "issuing_organization",
            "achievement_date",
            "expiration_date",
            "no_expiration",
            "short_description",
            "full_description",
            "icon_type",
            "icon_image",
            "icon_class",
            "credential_type",
            "credential_file",
            "credential_url",
            "credential_id",
            "related_link",
            "is_active",
            "is_draft",
            "order",
        ]
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., AWS Certified Solutions Architect",
                }
            ),
            "category": forms.Select(attrs={"class": "form-input"}),
            "issuing_organization": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "e.g., Amazon Web Services",
                }
            ),
            "achievement_date": forms.DateInput(
                attrs={"class": "form-input", "type": "date"}
            ),
            "expiration_date": forms.DateInput(
                attrs={"class": "form-input", "type": "date"}
            ),
            "no_expiration": forms.CheckboxInput(attrs={"id": "no-expiration"}),
            "short_description": forms.Textarea(
                attrs={
                    "class": "form-textarea",
                    "rows": 3,
                    "placeholder": "Brief description of the achievement",
                }
            ),
            "full_description": forms.Textarea(
                attrs={"id": "achievement-details", "class": "tinymce-editor"}
            ),
            "icon_type": forms.HiddenInput(attrs={"name": "icon_type"}),
            "icon_image": forms.FileInput(
                attrs={"accept": "image/*", "style": "display: none;"}
            ),
            "icon_class": forms.HiddenInput(attrs={"id": "icon-class-input"}),
            "credential_type": forms.HiddenInput(attrs={"name": "credential_type"}),
            "credential_file": forms.FileInput(
                attrs={"accept": ".pdf,image/*", "style": "display: none;"}
            ),
            "credential_url": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://credentials.example.com/verify/123456",
                }
            ),
            "credential_id": forms.TextInput(
                attrs={"class": "form-input", "placeholder": "e.g., CERT-123456"}
            ),
            "related_link": forms.URLInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "https://example.com/achievement",
                }
            ),
            "is_active": forms.HiddenInput(attrs={"value": "False"}),
            "is_draft": forms.HiddenInput(attrs={"value": "True"}),
            "order": forms.NumberInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "0",
                    "min": "0",
                    "value": "0",
                }
            ),
        }
        labels = {
            "title": "Achievement Title",
            "category": "Category",
            "issuing_organization": "Issuing Organization",
            "achievement_date": "Achievement Date",
            "expiration_date": "Expiration Date",
            "no_expiration": "No expiration",
            "short_description": "Short Description",
            "full_description": "Full Description",
            "icon_type": "Icon Method",
            "icon_image": "Upload Badge/Icon",
            "icon_class": "Icon Class",
            "credential_type": "Credential Method",
            "credential_file": "Upload Certificate/Document",
            "credential_url": "Credential URL",
            "credential_id": "Credential ID",
            "related_link": "Related Link",
            "is_active": "Show on Website",
            "is_draft": "Save as Draft",
            "order": "Display Order",
        }
