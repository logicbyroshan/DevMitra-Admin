from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.db.models import Q
from .models import (
    Project,
    Experience,
    Skill,
    Achievement,
    Category,
    UserProfile,
)
from .serializers import (
    ProjectSerializer,
    ExperienceSerializer,
    SkillSerializer,
    AchievementSerializer,
    CategorySerializer,
    UserProfileSerializer,
    PortfolioSummarySerializer,
)


class ReadOnlyPermission(permissions.BasePermission):
    """
    Custom permission to only allow read operations (GET, HEAD, OPTIONS).
    No write operations allowed from external sources.
    """
    def has_permission(self, request, view):
        # Only allow safe methods (GET, HEAD, OPTIONS)
        return request.method in permissions.SAFE_METHODS


class APIKeyPermission(permissions.BasePermission):
    """
    Custom permission to check for API key in headers.
    Additional security layer.
    """
    def has_permission(self, request, view):
        api_key = request.headers.get('X-API-Key')
        # Allow requests without API key for now (optional security)
        # To enforce: return api_key == settings.API_KEY
        return True  # Change to enforce API key if needed


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for projects (READ ONLY).
    
    GET /api/projects/ - List all active projects
    GET /api/projects/{id}/ - Get single project
    GET /api/projects/featured/ - Get featured projects
    """
    serializer_class = ProjectSerializer
    permission_classes = [ReadOnlyPermission]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Return only active, non-draft projects"""
        queryset = Project.objects.filter(is_active=True, is_draft=False).select_related('category').prefetch_related('screenshots')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by status
        project_status = self.request.query_params.get('status', None)
        if project_status:
            queryset = queryset.filter(status=project_status)
        
        return queryset.order_by('-order', '-created_at')
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects (status=published, top 6)"""
        projects = self.get_queryset().filter(status='published')[:6]
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for experience (READ ONLY).
    
    GET /api/experience/ - List all active experience
    GET /api/experience/{id}/ - Get single experience
    """
    serializer_class = ExperienceSerializer
    permission_classes = [ReadOnlyPermission]
    
    def get_queryset(self):
        """Return only active, non-draft experience"""
        return Experience.objects.filter(
            is_active=True, 
            is_draft=False
        ).prefetch_related('images').order_by('-start_date')


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for skills (READ ONLY).
    
    GET /api/skills/ - List all active skills
    GET /api/skills/{id}/ - Get single skill
    GET /api/skills/top/ - Get top skills by proficiency
    """
    serializer_class = SkillSerializer
    permission_classes = [ReadOnlyPermission]
    
    def get_queryset(self):
        """Return only active, non-draft skills"""
        queryset = Skill.objects.filter(is_active=True, is_draft=False).select_related('category')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        return queryset.order_by('-proficiency', 'name')
    
    @action(detail=False, methods=['get'])
    def top(self, request):
        """Get top 10 skills by proficiency"""
        skills = self.get_queryset()[:10]
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for achievements (READ ONLY).
    
    GET /api/achievements/ - List all active achievements
    GET /api/achievements/{id}/ - Get single achievement
    """
    serializer_class = AchievementSerializer
    permission_classes = [ReadOnlyPermission]
    
    def get_queryset(self):
        """Return only active, non-draft achievements"""
        queryset = Achievement.objects.filter(is_active=True, is_draft=False).select_related('category')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        return queryset.order_by('-achievement_date', '-created_at')


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for categories (READ ONLY).
    
    GET /api/categories/ - List all categories
    GET /api/categories/{slug}/ - Get single category
    """
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyPermission]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Return all categories"""
        queryset = Category.objects.all()
        
        # Filter by type
        category_type = self.request.query_params.get('type', None)
        if category_type:
            queryset = queryset.filter(category_type=category_type)
        
        return queryset.order_by('category_type', 'name')


class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for user profile (READ ONLY).
    
    GET /api/profile/ - Get user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [ReadOnlyPermission]
    
    def get_queryset(self):
        """Return user profile (only one)"""
        return UserProfile.objects.all()[:1]
    
    def list(self, request, *args, **kwargs):
        """Return single profile instead of list"""
        profile = UserProfile.objects.first()
        if profile:
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        return Response({}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([ReadOnlyPermission])
def portfolio_summary(request):
    """
    Get portfolio summary statistics.
    
    GET /api/summary/ - Get overall portfolio stats
    """
    data = {
        'total_projects': Project.objects.count(),
        'total_experience': Experience.objects.count(),
        'total_skills': Skill.objects.count(),
        'total_achievements': Achievement.objects.count(),
        'active_projects': Project.objects.filter(is_active=True, is_draft=False).count(),
        'active_experience': Experience.objects.filter(is_active=True, is_draft=False).count(),
        'active_skills': Skill.objects.filter(is_active=True, is_draft=False).count(),
        'active_achievements': Achievement.objects.filter(is_active=True, is_draft=False).count(),
        'years_of_experience': UserProfile.objects.first().experience_years if UserProfile.objects.first() else 0,
    }
    
    serializer = PortfolioSummarySerializer(data)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_health_check(request):
    """
    Health check endpoint to verify API is running.
    
    GET /api/health/ - Check API health
    """
    return Response({
        'status': 'healthy',
        'message': 'Portfolio API is running',
        'version': '1.0.0',
        'read_only': True,
    })
