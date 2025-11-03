from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'projects', api_views.ProjectViewSet, basename='api-projects')
router.register(r'experience', api_views.ExperienceViewSet, basename='api-experience')
router.register(r'skills', api_views.SkillViewSet, basename='api-skills')
router.register(r'achievements', api_views.AchievementViewSet, basename='api-achievements')
router.register(r'categories', api_views.CategoryViewSet, basename='api-categories')
router.register(r'profile', api_views.UserProfileViewSet, basename='api-profile')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('summary/', api_views.portfolio_summary, name='api-summary'),
    path('health/', api_views.api_health_check, name='api-health'),
]
