from rest_framework import serializers
from .models import (
    Project,
    ProjectScreenshot,
    Experience,
    ExperienceImage,
    Skill,
    Achievement,
    Category,
    UserProfile,
)


class ProjectScreenshotSerializer(serializers.ModelSerializer):
    """Serializer for project screenshots"""
    
    class Meta:
        model = ProjectScreenshot
        fields = ['id', 'image', 'caption', 'order', 'uploaded_at']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for categories"""
    item_count = serializers.IntegerField(read_only=True)
    category_type_display = serializers.CharField(source='get_category_type_display', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'category_type', 'category_type_display',
            'description', 'icon', 'color', 'item_count', 'created_at', 'updated_at'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects"""
    category = CategorySerializer(read_only=True)
    screenshots = ProjectScreenshotSerializer(many=True, read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'project_name',
            'category', 'technologies', 'technologies_list',
            'featured_image', 'demo_url', 'github_url',
            'status', 'order', 'screenshots',
            'is_active', 'is_draft', 'created_at', 'updated_at'
        ]


class ExperienceImageSerializer(serializers.ModelSerializer):
    """Serializer for experience images"""
    
    class Meta:
        model = ExperienceImage
        fields = ['id', 'image', 'caption', 'order', 'uploaded_at']


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for experience"""
    images = ExperienceImageSerializer(many=True, read_only=True)
    duration = serializers.CharField(source='get_duration', read_only=True)
    
    class Meta:
        model = Experience
        fields = [
            'id', 'position', 'company_name', 'company_logo',
            'location', 'employment_type', 'start_date', 'end_date',
            'currently_working', 'duration', 'description',
            'responsibilities', 'achievements_text', 'technologies',
            'images', 'order', 'is_active', 'is_draft',
            'created_at', 'updated_at'
        ]


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for skills"""
    category = CategorySerializer(read_only=True)
    skill_level_display = serializers.CharField(source='get_skill_level_display', read_only=True)
    
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'category', 'proficiency', 'skill_level',
            'skill_level_display', 'icon', 'description', 'years_of_experience',
            'order', 'is_active', 'is_draft', 'created_at', 'updated_at'
        ]


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'description', 'category', 'icon',
            'achievement_date', 'issuer', 'certificate_url',
            'order', 'is_active', 'is_draft', 'created_at', 'updated_at'
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'full_name', 'email', 'phone', 'location',
            'title', 'bio', 'profile_image', 'resume', 'cover_letter',
            'video_resume', 'github_url', 'linkedin_url', 'twitter_url',
            'portfolio_url', 'other_url', 'hourly_rate', 'experience_years',
            'open_to_opportunities', 'available_for_freelance',
            'created_at', 'updated_at'
        ]
        # Exclude sensitive fields from API
        read_only_fields = ['resume', 'cover_letter']


class PortfolioSummarySerializer(serializers.Serializer):
    """Serializer for portfolio summary/statistics"""
    total_projects = serializers.IntegerField()
    total_experience = serializers.IntegerField()
    total_skills = serializers.IntegerField()
    total_achievements = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    active_experience = serializers.IntegerField()
    active_skills = serializers.IntegerField()
    active_achievements = serializers.IntegerField()
    years_of_experience = serializers.IntegerField()
