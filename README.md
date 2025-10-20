# Task Management Web App

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![MariaDB](https://img.shields.io/badge/MariaDB-10.6-orange.svg)

A full-stack task management application built with Spring Boot backend and React frontend, featuring JWT authentication, drag-and-drop task reordering, and real-time updates.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- MariaDB 10.6+

### Installation

1. **Clone & Setup Database**
```bash
git clone https://github.com/Dumanrogger/task-management-web-app.git
cd task-management-web-app

# Create database
mysql -u root -p
CREATE DATABASE taskmanagement;
CREATE USER 'taskapp'@'localhost' IDENTIFIED BY 'taskapp123';
GRANT ALL PRIVILEGES ON taskmanagement.* TO 'taskapp'@'localhost';
```

2. **Start Backend**
```bash
./mvnw spring-boot:run
```

3. **Start Frontend**
```bash
cd frontend/task-management-frontend
npm install && npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Login: `admin` / `password`

## 📋 Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure login/registration
- 📝 **Task Management** - Create, edit, delete, assign tasks
- 🎯 **Priority System** - High/Medium/Low with color coding
- 👥 **User Assignment** - Manual and automatic task assignment
- 📱 **Responsive Design** - Works on desktop and mobile

### Advanced Features
- 🖱️ **Drag & Drop** - Reorder tasks with mouse
- ⚡ **Real-time Updates** - Instant UI feedback
- 🔗 **Shareable URLs** - Share specific tasks
- 📊 **Statistics Dashboard** - Task analytics
- 🌐 **Cross-browser Support** - Chrome, Firefox, Edge

## 🏗️ Architecture

```
┌─────────────────┐    REST API     ┌──────────────────┐
│   React App     │ ◄────────────► │  Spring Boot     │
│   (Port 3000)   │                │   (Port 8080)    │
└─────────────────┘                └──────────────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │    MariaDB       │
                                   └──────────────────┘
```

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
```

### Tasks
```http
GET    /api/tasks           # Get all tasks
POST   /api/tasks           # Create task
PUT    /api/tasks/{id}      # Update task
DELETE /api/tasks/{id}      # Delete task
POST   /api/tasks/{id}/assign  # Auto-assign task
```

### Users
```http
GET /api/users          # Get all users
GET /api/users/{id}     # Get user by ID
```

## 🗄️ Database Schema

```sql
┌─────────────────────┐       ┌─────────────────────┐
│       Users         │  1:N  │       Tasks         │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)            │◄──────┤ id (PK)            │
│ username (UNIQUE)   │       │ title              │
│ email (UNIQUE)      │       │ description        │
│ hashed_password     │       │ priority_level     │
│ availability_status │       │ assigned_user_id(FK)│
└─────────────────────┘       └─────────────────────┘
```

## 🧪 Testing

```bash
# Backend tests
./mvnw test

# Frontend tests
cd frontend/task-management-frontend
npm test

# Integration tests
npm run test:integration
```

## 📈 Lab Progress

### ✅ Lab 1: Backend Foundation (100/100)
- Spring Boot + JPA entities
- REST API with JWT security
- Automatic task assignment
- Database setup with sample data

### ✅ Lab 2: Frontend Development (98/100)
- React app with routing
- Drag-and-drop functionality
- Task management UI
- Responsive design

### ✅ Lab 3: Integration & Completion (96/100)
- Full E2E integration
- Performance optimizations
- Cross-browser testing
- Comprehensive documentation

## 🌐 Browser Support

| Browser | Status | Notes |
|---------|---------|-------|
| Chrome 120+ | ✅ Full | Recommended |
| Firefox 115+ | ✅ Full | All features |
| Edge 110+ | ✅ Full | Chromium-based |
| Safari 16+ | ⚠️ Limited | Drag issues |

## 🛠️ Development

### Project Structure
```
├── src/main/java/          # Spring Boot backend
│   ├── entity/            # JPA entities
│   ├── repository/        # Data access
│   ├── service/          # Business logic
│   ├── controller/       # REST endpoints
│   └── security/         # JWT & auth
├── frontend/             # React frontend
│   └── task-management-frontend/
│       ├── src/components/  # UI components
│       ├── src/pages/      # Route pages
│       └── src/services/   # API calls
```

### Configuration
```properties
# application.properties
spring.datasource.url=jdbc:mariadb://localhost:3306/taskmanagement
spring.datasource.username=taskapp
spring.datasource.password=taskapp123
jwt.secret=mySecretKey123456789012345678901234567890
```

## 🚨 Troubleshooting

**Database Connection Issues:**
```bash
sudo systemctl start mariadb
mysql -u taskapp -p taskmanagement
```

**Port Conflicts:**
```bash
# Backend on different port
./mvnw spring-boot:run -Dserver.port=8081

# Frontend on different port
PORT=3001 npm start
```

**CORS Issues:**
Ensure `SecurityConfig.java` allows `http://localhost:3000`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**Dumanrogger** - [GitHub](https://github.com/Dumanrogger)

---

⭐ **Star this repo if you found it helpful!**

🔗 **Live Demo:** Coming Soon
