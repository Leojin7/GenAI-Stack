# GenAI Stack - Setup Guide

This guide will help you set up the development environment for the GenAI Stack application.

## Prerequisites

1. **Python 3.8 or later**
   - Download from: https://www.python.org/downloads/
   - During installation, make sure to check "Add Python to PATH"

2. **Node.js (LTS version)**
   - Download from: https://nodejs.org/
   - This will also install npm (Node Package Manager)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GenAI-Stack
```

### 2. Set Up the Backend
1. Open a command prompt in the project directory
2. Run the setup script:
   ```
   .\setup_backend.bat
   ```
3. Start the backend server:
   ```
   .\start_backend.bat
   ```
   The backend will be available at: http://localhost:8000

### 3. Set Up the Frontend
1. Open a new command prompt in the project directory
2. Run the setup script:
   ```
   .\setup_frontend.bat
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at: http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Troubleshooting

### Backend Issues
- If you get Python-related errors, make sure Python is installed correctly and in your PATH
- Check the `backend.log` file for any error messages

### Frontend Issues
- If you get Node.js/npm errors, try deleting the `node_modules` folder and running `npm install` again
- Check the browser's developer console for any errors (F12)

## Project Structure

- `/backend` - Python FastAPI backend
- `/components` - React components
- `/contexts` - React context providers
- `/services` - API service layer
- `/views` - Main application views
- `App.tsx` - Main application component
- `Root.tsx` - Root component with providers
