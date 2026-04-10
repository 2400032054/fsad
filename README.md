# VridhiHome India 🏡

VridhiHome India is a modern full-stack web application dedicated to improving the value of Indian middle-class residential properties using AI scoring and tailored architectural guidelines.

## Project Structure

- `backend/`: Node.js & Express REST API using PostgreSQL (`pg`) for secure data handling.
- `frontend/`: React SPA built with Vite containing modern glassmorphism UI.

## Features

- **Authentication System**: Secure user registration, login, and Multi-Factor Authentication (MFA) validation.
- **Intake Engine**: Multi-step AI routing parameter form for homeowners.
- **Dynamic Enhancement Blueprint**: Users receive categorized upgrades calculated dynamically via Postgres, complete with ROI mappings, budget analysis, and actionable Next Steps.
- **AI Property Scoring Engine**: Dynamically calculates "Ghar-Score" and potential valuation increases.

## Stack

- **Frontend**: React.js, Vite, React Router DOM, Vanilla CSS, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: PostgreSQL (Neon.tech)

## Getting Started

To run the entire application smoothly for full-stack review:

### Prerequisites
1. Ensure Node.js (`v18+`) is installed.
2. If executing on Windows, simply double-click the `run.bat` file in the root directory!

### Manual Execution
If you prefer the command line:

```bash
# 1. Install root dependencies
npm install

# 2. Run the concurrent startup script (Starts Backend config & Frontend dev server)
npm start
```

The application will be accessible at: `http://localhost:5173`
