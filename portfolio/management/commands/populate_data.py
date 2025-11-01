from django.core.management.base import BaseCommand
from portfolio.models import Category, Project
from datetime import date


class Command(BaseCommand):
    help = "Populate database with sample data for testing"

    def handle(self, *args, **kwargs):
        self.stdout.write("Creating sample data...")

        # Create categories
        categories_data = [
            {"name": "Web Development", "slug": "web-development"},
            {"name": "Mobile Development", "slug": "mobile-development"},
            {"name": "Artificial Intelligence", "slug": "artificial-intelligence"},
            {"name": "Data Science", "slug": "data-science"},
            {"name": "Blockchain", "slug": "blockchain"},
            {"name": "IoT", "slug": "iot"},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories[cat_data["slug"]] = category
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created category: {category.name}")
                )

        # Create sample projects
        projects_data = [
            {
                "title": "E-Commerce Platform",
                "slug": "e-commerce-platform",
                "description": "A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, payment integration, and order tracking.",
                "short_description": "Full-stack e-commerce solution with React, Node.js, and MongoDB.",
                "category": categories["web-development"],
                "technologies": "React, Node.js, MongoDB, Express, Stripe",
                "github_url": "https://github.com/example/ecommerce",
                "live_url": "https://ecommerce-demo.example.com",
                "status": "active",
                "is_active": True,
                "is_featured": True,
                "start_date": date(2024, 1, 15),
            },
            {
                "title": "AI Chatbot Integration",
                "slug": "ai-chatbot-integration",
                "description": "An intelligent chatbot using NLP and machine learning algorithms. Capable of understanding context, sentiment analysis, and providing helpful responses.",
                "short_description": "Intelligent chatbot using NLP and machine learning algorithms.",
                "category": categories["artificial-intelligence"],
                "technologies": "Python, TensorFlow, Flask, NLTK, spaCy",
                "github_url": "https://github.com/example/ai-chatbot",
                "demo_url": "https://chatbot-demo.example.com",
                "status": "active",
                "is_active": True,
                "start_date": date(2024, 3, 10),
            },
            {
                "title": "Mobile Banking App",
                "slug": "mobile-banking-app",
                "description": "A secure mobile banking application with real-time transactions, biometric authentication, and comprehensive financial management tools.",
                "short_description": "Secure mobile banking application with real-time transactions.",
                "category": categories["mobile-development"],
                "technologies": "Flutter, Firebase, Dart, REST API",
                "github_url": "https://github.com/example/banking-app",
                "status": "active",
                "is_active": True,
                "is_featured": True,
                "start_date": date(2024, 2, 1),
                "client": "FinTech Solutions Inc.",
            },
            {
                "title": "Real-time Analytics Dashboard",
                "slug": "analytics-dashboard",
                "description": "An advanced analytics platform with real-time data visualization using Apache Kafka for streaming and D3.js for interactive charts.",
                "short_description": "Advanced analytics platform with real-time data visualization.",
                "category": categories["data-science"],
                "technologies": "Python, Apache Kafka, D3.js, PostgreSQL",
                "github_url": "https://github.com/example/analytics",
                "live_url": "https://analytics.example.com",
                "status": "active",
                "is_active": True,
                "start_date": date(2023, 11, 5),
                "end_date": date(2024, 4, 20),
            },
            {
                "title": "Portfolio Website",
                "slug": "portfolio-website",
                "description": "A modern portfolio website showcasing projects and skills with smooth animations and responsive design.",
                "short_description": "Modern portfolio showcasing projects and skills with animations.",
                "category": categories["web-development"],
                "technologies": "HTML5, CSS3, JavaScript, GSAP",
                "github_url": "https://github.com/example/portfolio",
                "live_url": "https://portfolio.example.com",
                "status": "completed",
                "is_active": True,
                "start_date": date(2023, 6, 1),
                "end_date": date(2023, 8, 15),
            },
            {
                "title": "Blockchain Wallet",
                "slug": "blockchain-wallet",
                "description": "A secure cryptocurrency wallet with multi-chain support, built on Ethereum and supporting various ERC tokens.",
                "short_description": "Secure cryptocurrency wallet with multi-chain support.",
                "category": categories["blockchain"],
                "technologies": "Solidity, Web3.js, React, MetaMask",
                "github_url": "https://github.com/example/crypto-wallet",
                "status": "on-hold",
                "is_active": False,
                "start_date": date(2024, 1, 10),
            },
            {
                "title": "IoT Monitoring Dashboard",
                "slug": "iot-dashboard",
                "description": "A real-time dashboard for monitoring IoT devices and sensors with WebSocket communication and MQTT protocol support.",
                "short_description": "Real-time dashboard for monitoring IoT devices and sensors.",
                "category": categories["iot"],
                "technologies": "Vue.js, WebSocket, MQTT, Node.js",
                "status": "draft",
                "is_active": False,
            },
            {
                "title": "Social Media API",
                "slug": "social-media-api",
                "description": "A RESTful API for a social media platform with user management, posts, comments, likes, and real-time notifications.",
                "short_description": "RESTful API for social media with real-time features.",
                "category": categories["web-development"],
                "technologies": "Django, PostgreSQL, Redis, Celery",
                "github_url": "https://github.com/example/social-api",
                "status": "draft",
                "is_active": False,
            },
        ]

        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                slug=project_data["slug"], defaults=project_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created project: {project.title}")
                )

        self.stdout.write(self.style.SUCCESS("\n✅ Sample data created successfully!"))
        self.stdout.write(self.style.SUCCESS(f"Categories: {Category.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Projects: {Project.objects.count()}"))
