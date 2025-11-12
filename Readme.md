<div align="center">

<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/trello.svg" width="100" alt="TaskPlexus" style="filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6));" />

# TaskPlexus

<p align="center">
  <img src="https://img.shields.io/badge/⚡-Lightning_Fast-FFD700?style=for-the-badge" alt="Fast" />
  <img src="https://img.shields.io/badge/🎯-Task_Focused-00D4FF?style=for-the-badge" alt="Focused" />
  <img src="https://img.shields.io/badge/🔄-Real_Time-00FF00?style=for-the-badge" alt="Real-time" />
</p>

### *Smart Task Management with Visual Workflows*

[![Go Version](https://img.shields.io/badge/Go-1.25.3-00ADD8?style=for-the-badge&logo=go)](https://golang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**A next-generation task management system combining lightning-fast Go backend with an intelligent React frontend, featuring workspace-based organization and interactive flowchart visualization.**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Setup](#-quick-start) • [Architecture](#-architecture) • [API](#-api-documentation)

</div>

---

## 🌟 Key Features

### 🗂️ **Multi-Workspace Management**
- Create unlimited workspaces for different projects/contexts
- Switch seamlessly between workspaces
- Each workspace maintains isolated todos, goals, and flowcharts
- Optimistic UI updates for instant feedback

### 📋 **Smart Task Management**
- Priority-based task organization (Low, Medium, High)
- Real-time task status tracking
- Bulk operations and quick actions
- IndexedDB persistence for offline capability

### 🎯 **Goal Tracking System**
- Set and monitor long-term goals per workspace
- Progress visualization with completion metrics
- Goal-task relationship mapping

### 🔄 **Interactive Flowchart View**
- Drag-and-drop node positioning
- Visual task dependencies
- Custom connections and relationships
- Auto-save canvas state per workspace
- Zoom, pan, and minimap controls

### 📊 **Advanced Analytics**
- Task completion trends over time
- Workspace-specific statistics
- Priority distribution charts
- Progress monitoring dashboard

### 🎨 **Modern UI/UX**
- Glass-morphism design language
- Smooth animations and transitions
- Responsive across all devices
- Dark-themed professional interface
- Collapsible sidebar navigation

## 🚀 Tech Stack

<div align="center">

### Backend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white) | Core Backend | 1.25.3 |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Database | Atlas |
| Clean Architecture | Pattern | - |
| JWT | Authentication | - |

### Frontend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI Framework | 19 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type Safety | 5.0 |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | Latest |
| React Flow | Flowchart | Latest |
| Zustand | State Management | Latest |
| IndexedDB | Local Storage | Native |

</div>

## 📁 Project Structure

```
fast-todo/
├── 📁 client/                    # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 pages/             # Page Components
│   │   │   ├── Dashboard.tsx    # Main dashboard with stats
│   │   │   ├── FlowchartView.tsx # Interactive flowchart
│   │   │   ├── SignIn.tsx       # Authentication
│   │   │   └── SignUp.tsx       # User registration
│   │   ├── 📁 components/        # Reusable Components
│   │   │   └── Protected.tsx    # Route protection
│   │   ├── 📁 store/             # Zustand State Management
│   │   │   ├── useWorkspaceStore.ts  # Workspace state with todos, goals, nodes
│   │   │   ├── useUserInfo.ts    # User authentication state
│   │   │   └── 📁 indexDB/       # IndexedDB utilities
│   │   ├── 📁 api/               # API Integration
│   │   │   ├── signInUserApi.ts
│   │   │   ├── signUpUserApi.ts
│   │   │   └── createWorkspace.ts
│   │   ├── 📁 hooks/             # Custom React Hooks
│   │   │   └── useAuth.tsx      # Authentication hook
│   │   ├── 📁 types/             # TypeScript Interfaces
│   │   └── main.tsx             # Application Entry
│   └── package.json
│
└── 📁 server/                    # Go Backend Application
    ├── 📁 cmd/
    │   └── 📁 fast-todo/
    │       └── main.go           # Server Entry Point
    ├── 📁 internal/
    │   ├── 📁 app/               # App Initialization
    │   ├── 📁 config/            # Configuration Management
    │   ├── 📁 handler/           # HTTP Request Handlers
    │   │   ├── todo_handler.go
    │   │   ├── goal_handler.go
    │   │   ├── user_handler.go
    │   │   └── workspace_handler.go
    │   ├── 📁 service/           # Business Logic Layer
    │   │   ├── todo_service.go
    │   │   ├── goal_service.go
    │   │   ├── user_service.go
    │   │   └── workspace_service.go
    │   ├── 📁 repository/        # Database Operations
    │   │   ├── todo_repo.go
    │   │   ├── goal_repo.go
    │   │   ├── user_repo.go
    │   │   └── workspace_repo.go
    │   ├── 📁 model/             # Data Models
    │   │   ├── todo_model.go
    │   │   ├── goals_model.go
    │   │   ├── user_model.go
    │   │   └── workspace_model.go
    │   ├── 📁 middleware/        # HTTP Middleware
    │   │   ├── auth.go           # JWT Authentication
    │   │   ├── cors.go           # CORS Configuration
    │   │   └── logging.go        # Request Logging
    │   └── 📁 server/            # HTTP Server Setup
    │       └── fast_todo_server.go
    ├── 📁 pkg/                   # Shared Utilities
    │   ├── 📁 nbcrypt/           # Password Hashing
    │   └── 📁 njwt/              # JWT Token Management
    └── go.mod
```

## 🏗️ Architecture

### Backend Architecture (Clean Architecture Pattern)

```mermaid
graph TB
    A[Client Request] --> B[HTTP Router]
    B --> C[Middleware Layer]
    C --> D[Handler Layer]
    D --> E[Service Layer]
    E --> F[Repository Layer]
    F --> G[(MongoDB Atlas)]
    
    C --> |Auth, CORS, Logging| D
    D --> |HTTP Request/Response| E
    E --> |Business Logic| F
    F --> |Database Operations| G
    
    style A fill:#61DAFB
    style G fill:#47A248
    style E fill:#00ADD8
```

### Frontend State Management

```mermaid
graph LR
    A[User Action] --> B[Zustand Store]
    B --> C[Optimistic Update]
    C --> D[UI Updates Instantly]
    B --> E[API Call Background]
    E --> F{Success?}
    F --> |Yes| G[Sync Complete]
    F --> |No| H[Rollback State]
    H --> I[Show Error + Retry]
    
    style B fill:#764ABC
    style C fill:#61DAFB
    style D fill:#4CAF50
```

### Data Flow

**Workspace → Todos/Goals → Flowchart Visualization**

Each workspace maintains:
- Independent task lists with priorities
- Separate goal tracking
- Isolated flowchart canvas (nodes + edges)
- Persistent state via IndexedDB

## ⚡ Quick Start

### Prerequisites

```bash
# Required
✓ Go 1.25+ installed
✓ Node.js 18+ and npm
✓ MongoDB Atlas account (or local MongoDB)
✓ Git
```

### 🔧 Backend Setup

```bash
# 1. Clone and navigate
cd server

# 2. Create .env file
cat > .env << EOL
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskplexus?retryWrites=true&w=majority
PORT=:8080
JWT_SECRET=your_super_secret_jwt_key_here
EOL

# 3. Install dependencies
go mod download

# 4. Run server
go run cmd/fast-todo/main.go

# ✅ Server running at http://localhost:8080
```

### 🎨 Frontend Setup

```bash
# 1. Navigate to client
cd client

# 2. Install dependencies
npm install

# 3. Create .env (optional)
cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8080
EOL

# 4. Start development server
npm run dev

# ✅ Frontend running at http://localhost:5173
```

### 🚀 Production Build

```bash
# Backend
cd server
go build -o bin/taskplexus cmd/fast-todo/main.go
./bin/taskplexus

# Frontend
cd client
npm run build
npm run preview
```

## 🎓 Learning Journey

This project is built while learning **Go for backend development**. Key concepts explored:

- ✅ Go project structure & organization
- ✅ MongoDB integration with Go driver
- ✅ Clean Architecture (Layered approach)
- ✅ Dependency Injection pattern
- ✅ HTTP server with net/http
- ✅ Error handling in Go
- ✅ Context management
- ✅ Middleware implementation
- ✅ Professional frontend design patterns
- ✅ State management in React
- ✅ Interactive data visualization

## 📝 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Authentication
```http
POST   /users/signup          # Create new user account
POST   /users/signin          # Login and get JWT token
GET    /users/:id             # Get user profile (Protected)
```

#### 🗂️ Workspaces
```http
GET    /workspaces            # Get all user workspaces (Protected)
POST   /workspaces/create     # Create new workspace (Protected)
PUT    /workspaces/:id        # Update workspace (Protected)
DELETE /workspaces/:id        # Delete workspace (Protected)
```

#### 📋 Todos
```http
GET    /todos                 # Get all todos for workspace (Protected)
GET    /todos/:id             # Get specific todo (Protected)
POST   /todos                 # Create new todo (Protected)
PUT    /todos/:id             # Update todo (Protected)
DELETE /todos/:id             # Delete todo (Protected)
PATCH  /todos/:id/toggle      # Toggle todo completion (Protected)
```

#### 🎯 Goals
```http
GET    /goals                 # Get all goals for workspace (Protected)
GET    /goals/:id             # Get specific goal (Protected)
POST   /goals                 # Create new goal (Protected)
PUT    /goals/:id             # Update goal (Protected)
DELETE /goals/:id             # Delete goal (Protected)
PATCH  /goals/:id/toggle      # Toggle goal completion (Protected)
```

### Example Requests

**Sign Up:**
```json
POST /users/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Create Todo:**
```json
POST /todos
Headers: { "Authorization": "Bearer <token>" }
{
  "text": "Complete project documentation",
  "priority": "high",
  "workspaceId": "workspace_12345"
}
```

## 🎨 UI/UX Highlights

### Design Philosophy
> **"Instant Feedback, Zero Latency"** - Every action feels immediate through optimistic updates

| Feature | Description | Tech |
|---------|-------------|------|
| 🎭 **Glass-morphism** | Modern translucent UI elements | CSS Backdrop Filter |
| ⚡ **Optimistic Updates** | Instant UI response before API | Zustand + Rollback |
| 🎨 **Smooth Animations** | Fluid transitions and micro-interactions | CSS Transitions |
| 📱 **Responsive Design** | Perfect on mobile, tablet, desktop | Flexbox/Grid |
| 🌙 **Dark Theme** | Eye-friendly professional theme | Custom CSS Variables |
| 💾 **Offline Support** | Works without internet | IndexedDB |
| 🔄 **Real-time Sync** | Background data synchronization | Async API Calls |

### Key Pages

- **📊 Dashboard** - Stats overview, recent tasks, quick actions
- **🔄 Flowchart View** - Interactive canvas with drag-drop nodes
- **🗂️ Workspace Switcher** - Seamless context switching
- **📈 Analytics** - Visual task completion trends
- **🔐 Auth Pages** - Modern sign-in/sign-up flow

## 🔮 Roadmap

### Phase 1 - Core Features ✅
- [x] Multi-workspace management
- [x] Task CRUD with priorities
- [x] Goal tracking system
- [x] Interactive flowchart view
- [x] Optimistic UI updates
- [x] IndexedDB persistence

### Phase 2 - Enhanced Features 🚧
- [ ] Real-time collaboration (WebSocket)
- [ ] Task categories and custom tags
- [ ] Deadline reminders and notifications
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Advanced search and filters

### Phase 3 - Professional Tools 📋
- [ ] Team workspaces with role-based access
- [ ] Time tracking integration
- [ ] Export/Import (JSON, CSV, PDF)
- [ ] Slack/Discord webhooks
- [ ] Calendar view integration
- [ ] Task dependencies visualization

### Phase 4 - Scale & Deploy 🚀
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] AWS/GCP deployment
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Caching layer (Redis)

## 🎓 Learning Outcomes

<div align="center">

### Backend Mastery 🔧
| Concept | Implementation |
|---------|----------------|
| Clean Architecture | Repository → Service → Handler |
| Go Best Practices | Project structure, error handling |
| MongoDB Integration | BSON, cursors, context management |
| JWT Auth | Token generation & validation |
| Middleware | Auth, CORS, logging pipeline |
| Dependency Injection | Flexible & testable code |

### Frontend Excellence 🎨
| Concept | Implementation |
|---------|----------------|
| State Management | Zustand with optimistic updates |
| Persistence | IndexedDB for offline support |
| Interactive UI | React Flow for flowcharts |
| Type Safety | TypeScript throughout |
| Hooks Pattern | Custom hooks (useAuth, useWorkspace) |
| Modern Design | Glass-morphism, animations |

</div>

## 💡 Key Insights

> **"The best architecture makes changes easy, not hard."**

- ⚡ **Optimistic Updates** - UI responds instantly while API syncs in background
- 🏗️ **Clean Architecture** - Each layer has single responsibility (easy to test & maintain)
- 💾 **Offline-First** - IndexedDB provides resilience when network fails
- 🔐 **Type Safety** - TypeScript catches bugs at compile-time, not runtime
- 🎯 **Separation of Concerns** - Backend/Frontend completely decoupled

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - feel free to use it for learning and building!

## 🙏 Acknowledgments

- Go community for excellent documentation
- React team for amazing developer experience
- MongoDB for powerful database
- All open-source contributors

---

<div align="center">

**Built with 💙 by [ndk123-web](https://github.com/ndk123-web)**

*Learning Go, Building Fast!*

[![GitHub](https://img.shields.io/badge/GitHub-ndk123--web-181717?style=for-the-badge&logo=github)](https://github.com/ndk123-web)
[![Made with Go](https://img.shields.io/badge/Made%20with-Go-00ADD8?style=for-the-badge&logo=go)](https://golang.org/)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

*"The best way to learn is to build something amazing!"* ⚡

</div>
