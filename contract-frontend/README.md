# ConTract Frontend

A React-based frontend application for the ConTract platform - connecting clients with trusted contractors.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Navbar, Footer, etc.)
│   ├── contractor/     # Contractor-specific components
│   ├── client/         # Client-specific components
│   ├── dashboard/      # Dashboard components
│   └── ui/            # Basic UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── styles/             # CSS and styling files
└── utils/              # Utility functions and constants
```

## 🛠 Tech Stack

- **React 18** - UI Framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **React Hook Form** - Form handling

## 🔐 Authentication

The app uses JWT-based authentication with protected routes. The AuthContext manages user state across the application.

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS components** in `src/styles/index.css`
- **Responsive design** for mobile and desktop
- **Dark mode support** (via ThemeContext)

## 📱 Features

- User authentication (login/register/logout)
- Role-based routing (Client/Contractor/Admin)
- Profile management
- Booking system
- Real-time chat
- Review and rating system
- Responsive design
- Error handling and loading states

## 🔧 Configuration

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=ConTract
```

## 🚦 Development Guidelines

1. **Components** - Keep components small and focused
2. **State Management** - Use Context for global state, local state for component-specific data
3. **API Calls** - Use the `apiClient` service for all HTTP requests
4. **Error Handling** - Implement proper error boundaries and user feedback
5. **Accessibility** - Follow WCAG guidelines for accessible UI

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the ConTract platform.
