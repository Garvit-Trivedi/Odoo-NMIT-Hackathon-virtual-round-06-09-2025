# SynergySphere Frontend

A modern, responsive React frontend for the SynergySphere team collaboration platform.

## Features

- 🔐 **Authentication System** - Login, register, forgot password, and profile management
- 📊 **Dashboard** - Overview of projects, tasks, and team activity
- 📁 **Project Management** - Create, manage, and collaborate on projects
- ✅ **Task Management** - Kanban board with drag-and-drop functionality
- 👥 **Team Collaboration** - Member management and real-time updates
- 📱 **Mobile Responsive** - Optimized for both desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- ⚡ **Real-time Updates** - Socket.IO integration for live collaboration

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- SynergySphere backend running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   cd synergy-sphere-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_APP_NAME=SynergySphere
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared/reusable components
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components
│   ├── projects/        # Project management components
│   ├── tasks/           # Task management components
│   └── profile/         # User profile components
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── stores/              # Zustand state stores
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Key Components

### Authentication
- **Login/Register** - User authentication with form validation
- **Forgot Password** - Password reset functionality
- **Protected Routes** - Route protection for authenticated users

### Dashboard
- **Project Overview** - Recent projects and statistics
- **Task Summary** - Personal task overview
- **Quick Actions** - Fast access to common actions

### Project Management
- **Project List** - Grid view of all projects
- **Project Detail** - Comprehensive project view with tabs
- **Member Management** - Add/remove team members
- **Project Stats** - Progress tracking and analytics

### Task Management
- **Kanban Board** - Drag-and-drop task management
- **Task Cards** - Detailed task information
- **Task Creation** - Modal for creating new tasks
- **Task Detail** - Full task view and editing

## Mobile Responsiveness

The application is built with a mobile-first approach:

- **Responsive Grid** - Adapts to different screen sizes
- **Mobile Navigation** - Collapsible sidebar for mobile
- **Touch Optimized** - Touch-friendly interactions
- **Progressive Enhancement** - Works on all devices

## Real-time Features

- **Live Task Updates** - See changes as they happen
- **Project Notifications** - Real-time project updates
- **Team Collaboration** - Live member activity
- **Socket.IO Integration** - Reliable real-time communication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the SynergySphere backend API:

- **Authentication** - JWT-based authentication
- **Projects** - CRUD operations for projects
- **Tasks** - Task management and updates
- **Users** - User profile and team management
- **Real-time** - Socket.IO for live updates

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Configure environment variables** for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
