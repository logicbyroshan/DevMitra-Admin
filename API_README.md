# Portfolio API

## 🚀 Quick Start

### 1. Access API Documentation
Visit: `http://localhost:8000/api-docs/`

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:8000/api/health/

# Get all projects
curl http://localhost:8000/api/projects/

# Get portfolio summary
curl http://localhost:8000/api/summary/

# Get user profile
curl http://localhost:8000/api/profile/

# Get all skills
curl http://localhost:8000/api/skills/

# Get top skills
curl http://localhost:8000/api/skills/top/
```

## 🔒 Security Features

### READ-ONLY Access
- ✅ All API endpoints are **READ-ONLY**
- ❌ No POST, PUT, DELETE operations allowed from external sources
- ✅ Only active and published content is exposed

### CORS Protection
- Only configured origins can access the API
- Update `CORS_ALLOWED_ORIGINS` in `config/settings.py` with your portfolio URL

### Rate Limiting
- Anonymous users: **100 requests/hour**
- Authenticated users: **1000 requests/hour**

### Data Filtering
- Only `is_active=True` and `is_draft=False` items are returned
- Sensitive data (resume, cover letter files) are excluded

## 📡 Available Endpoints

### Projects
- `GET /api/projects/` - List all projects
- `GET /api/projects/{slug}/` - Get project by slug
- `GET /api/projects/featured/` - Get featured projects (top 6)
- Query params: `?category=web-development&status=published`

### Experience
- `GET /api/experience/` - List all experience
- `GET /api/experience/{id}/` - Get single experience

### Skills
- `GET /api/skills/` - List all skills
- `GET /api/skills/{id}/` - Get single skill
- `GET /api/skills/top/` - Get top 10 skills by proficiency
- Query params: `?category=programming`

### Achievements
- `GET /api/achievements/` - List all achievements
- `GET /api/achievements/{id}/` - Get single achievement
- Query params: `?category=certifications`

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{slug}/` - Get category by slug
- Query params: `?type=project`

### Profile
- `GET /api/profile/` - Get user profile

### Summary
- `GET /api/summary/` - Get portfolio statistics

### Health
- `GET /api/health/` - API health check

## 🔧 Configuration

### 1. Add Your Portfolio URL to CORS

In `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev
    "http://localhost:5173",  # Vite dev
    "https://yourportfolio.com",  # Production
]
```

### 2. Optional: API Key

For additional security, you can enforce API key validation:

In `config/settings.py`:
```python
API_KEY = 'your-secure-random-key-here'
```

In `portfolio/api_views.py`, update `APIKeyPermission`:
```python
def has_permission(self, request, view):
    api_key = request.headers.get('X-API-Key')
    return api_key == settings.API_KEY  # Enforce API key
```

Then in your portfolio frontend:
```javascript
fetch('http://localhost:8000/api/projects/', {
  headers: {
    'X-API-Key': 'your-secure-random-key-here'
  }
})
```

## 💻 Usage in Frontend

### React/Next.js Example

```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Get all projects
  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/projects/?${query}`);
    return response.json();
  },

  // Get featured projects
  async getFeaturedProjects() {
    const response = await fetch(`${API_BASE_URL}/projects/featured/`);
    return response.json();
  },

  // Get all skills
  async getSkills() {
    const response = await fetch(`${API_BASE_URL}/skills/`);
    return response.json();
  },

  // Get portfolio summary
  async getSummary() {
    const response = await fetch(`${API_BASE_URL}/summary/`);
    return response.json();
  },

  // Get profile
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile/`);
    return response.json();
  }
};

// Usage in component
import { api } from './utils/api';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects({ category: 'web-development' })
      .then(data => setProjects(data.results));
  }, []);

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Vue.js Example

```javascript
// services/api.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export default {
  getProjects: (params) => client.get('/projects/', { params }),
  getFeaturedProjects: () => client.get('/projects/featured/'),
  getSkills: () => client.get('/skills/'),
  getExperience: () => client.get('/experience/'),
  getProfile: () => client.get('/profile/'),
  getSummary: () => client.get('/summary/'),
};
```

## 📦 Response Format

All list endpoints return paginated results:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/projects/?page=2",
  "previous": null,
  "results": [...]
}
```

## 🧪 Testing

Test all endpoints:

```bash
# Install httpie (optional, better than curl)
pip install httpie

# Test endpoints
http GET http://localhost:8000/api/health/
http GET http://localhost:8000/api/projects/
http GET http://localhost:8000/api/skills/top/
http GET http://localhost:8000/api/summary/
```

## 🚢 Production Deployment

1. **Update CORS** with your production domain
2. **Set DEBUG=False** in settings.py
3. **Use environment variables** for SECRET_KEY and API_KEY
4. **Enable HTTPS** for secure communication
5. **Consider caching** for better performance

## 📝 Notes

- API returns only **active** and **published** content
- All write operations must be done through the admin interface
- Media files (images) are served from `/media/` endpoint
- Pagination is enabled (20 items per page by default)

## 🆘 Support

For issues or questions, refer to the API documentation at `/api-docs/`
