# IT Asset & Equipment Tracker — Frontend

A web-based dashboard for managing an organization's IT assets, equipment, categories, and employee assignments.

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide Icons
- Node.js and npm

## Main Features

- Admin dashboard with asset statistics
- Asset management interface
- Category management interface
- Employee management interface
- Asset assignment overview
- Recent activity dashboard
- Responsive user interface

## Getting Started

### Requirements

- Node.js (LTS version recommended)
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/selamawit23-13/it-asset-tracker-frontend.git
```

Navigate to the project folder:

```bash
cd it-asset-tracker-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

http://localhost:3000

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
├── package.json
├── package-lock.json
├── next.config.ts
└── tsconfig.json
```

## Backend Integration

The frontend is designed to work with the IT Asset Tracker REST API built using Java Spring Boot.

Backend repository:

https://github.com/selamawit23-13/it-asset-tracker-backend

The backend provides authentication, asset management, category management, employee assignments, and role-based access control.

## Development

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```
    
## Repository

https://github.com/selamawit23-13/it-asset-tracker-frontend