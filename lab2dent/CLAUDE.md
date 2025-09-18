# Lab2Dent Project

## Project Overview
Lab2Dent is a Next.js-based web application for dental lab management, built with React 19 and TypeScript. The application provides different dashboards for admins, clinics, and labs.

## Tech Stack
- **Framework**: Next.js 15.3.4 with Turbopack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tools**: ESLint, PostCSS

## Project Structure
```
src/
├── app/
│   ├── admin/dashboard/
│   ├── clinic/dashboard/
│   ├── lab/dashboard/
│   ├── login/
│   └── unauthorized/
├── components/
│   ├── AdminAnalytics.tsx
│   ├── AdminOrderManagement.tsx
│   ├── AdminUserManagement.tsx
│   ├── DashboardLayout.tsx
│   ├── LabOrderManagement.tsx
│   ├── OrderDetailsModal.tsx
│   ├── OrderProgressBar.tsx
│   ├── OrderTrackingInterface.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── AdminContext.tsx
│   ├── AuthContext.tsx
│   └── OrderContext.tsx
├── lib/
│   └── auth.ts
└── types/
    ├── auth.ts
    ├── order.ts
    └── user.ts
```

## Key Features
- Multi-role authentication system (Admin, Clinic, Lab)
- Dashboard interfaces for different user types
- Order management and tracking
- Protected routes with authentication
- Analytics for admins
- User management capabilities

## Development Commands
- `npm run dev` - Start development server (configured for network access with -H 0.0.0.0)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Network Access Configuration
The dev server is configured to bind to all network interfaces (0.0.0.0), allowing teammates on the same network to access the application using the host machine's IP address.

## Recent Issues Resolved
- Fixed network access issue by adding `-H 0.0.0.0` flag to the dev script
- Server now accessible via IP address for team collaboration

## Development Notes
- Uses Turbopack for faster development builds
- Configured with TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Protected routes ensure proper authentication flow

## Important Instructions for Future Development
- **Always record fixes and requests in dev-record.md**
- When fixing issues or fulfilling requests, update dev-record.md with:
  - Date and problem description
  - Solution implemented
  - Files modified
  - Results/outcome
- This maintains project history and context for future development sessions