# TaskFlow - Modern Task Management App

A beautiful, modern task management application built with React, TypeScript, Node.js, and real-time features using Socket.IO.

![TaskFlow Demo](https://github.com/user-attachments/assets/8264a19d-11a0-4b1a-9fd3-73e8727a106f)

## ✨ Features

- **🎨 Modern UI/UX**: Beautiful, responsive design with smooth animations using Framer Motion
- **🔐 Authentication**: Secure user registration and login system with JWT tokens
- **📋 Task Management**: Create, edit, delete, and organize tasks with different statuses
- **🏷️ Task Organization**: Priority levels, tags, due dates, and status tracking
- **⚡ Real-time Updates**: Live updates using Socket.IO for collaborative features
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🎯 Drag & Drop**: Intuitive task management with visual feedback
- **🌈 Beautiful Animations**: Smooth transitions and micro-interactions

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.IO Client** for real-time features
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **JSON file-based database** for simplicity

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd modern-task-app
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install
```

### 3. Start the development servers
```bash
# From the root directory, start both frontend and backend
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### 4. Open your browser
Navigate to `http://localhost:3000` to see the application.

## 📁 Project Structure

```
modern-task-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types.ts        # TypeScript types
│   │   └── App.tsx         # Main App component
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/              # JSON database files
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── package.json           # Root package.json
└── README.md
```

## 🎯 Usage

### Getting Started
1. **Sign Up**: Create a new account or sign in with existing credentials
2. **Create Tasks**: Click "New Task" to create your first task
3. **Organize**: Use the kanban board to move tasks between "To Do", "In Progress", and "Completed"
4. **Customize**: Add priorities, tags, due dates, and descriptions to your tasks

### Task Management
- **Create**: Click the "New Task" button to add a new task
- **Edit**: Click the edit icon on any task card to modify it
- **Delete**: Click the delete icon to remove a task
- **Status**: Use the dropdown or drag tasks between columns to change status
- **Priority**: Set task priorities (Low, Medium, High) with color coding
- **Tags**: Add custom tags to categorize your tasks
- **Due Dates**: Set deadlines for better time management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for custom configuration:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure the `data` directory is writable
3. Run `npm start` to start the production server

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Serve the `build` directory using a static file server
3. Update the API URL in the environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- UI components inspired by modern design systems
- Built with ❤️ using React and Node.js

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Task Managing! 🎉**