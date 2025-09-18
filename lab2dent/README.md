# Lab2Dent - Dental Lab Management System

A comprehensive web application built with Next.js 14 that connects dental clinics with laboratories through a unified platform. The system provides role-based authentication and specialized dashboards for different user types.

## 🏗️ Architecture Overview

Lab2Dent is designed as a multi-tenant platform supporting three distinct user roles:
- **Clinic**: Manage patient cases and orders with lab partners
- **Lab**: Track work queue and manage production workflow  
- **Admin**: System oversight and performance monitoring

## 🚀 Features

### Authentication System
- **Role-based Authentication**: Three pre-defined user roles with specific access levels
- **Local Storage Session Management**: Persistent login sessions using browser storage
- **Protected Routes**: Route-level security with automatic redirects
- **Test Accounts**: Pre-configured demo accounts for immediate testing

### User Dashboards

#### Clinic Dashboard
- Patient management overview
- Active cases tracking
- Pending orders monitoring
- Recent orders history with lab partners

#### Lab Dashboard  
- Work queue management with priority levels
- Production status tracking (Queue → In Progress → Completed → Ready for Pickup)
- Clinic relationship management
- Workload distribution analytics

#### Admin Dashboard
- System-wide statistics and metrics
- User activity monitoring  
- Platform health status
- Revenue and performance tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom implementation with localStorage
- **Development**: Turbopack for fast development builds

## 📦 Project Structure

```
lab2dent/
├── src/
│   ├── app/
│   │   ├── admin/dashboard/         # Admin dashboard page
│   │   ├── clinic/dashboard/        # Clinic dashboard page
│   │   ├── lab/dashboard/           # Lab dashboard page
│   │   ├── login/                   # Login page
│   │   ├── unauthorized/            # Unauthorized access page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout with AuthProvider
│   │   └── page.tsx                 # Landing page
│   ├── assets/                      # Static assets (images, icons)
│   │   ├── Banner-Clear.png
│   │   ├── Banner.png
│   │   ├── Logo.png
│   │   └── favicon files
│   ├── components/
│   │   ├── AdminAnalytics.tsx       # Admin analytics component
│   │   ├── AdminOrderManagement.tsx # Admin order management
│   │   ├── AdminUserManagement.tsx  # Admin user management
│   │   ├── DashboardLayout.tsx      # Shared dashboard layout
│   │   ├── LabOrderManagement.tsx   # Lab order management
│   │   ├── OrderDetailsModal.tsx    # Order details modal
│   │   ├── OrderProgressBar.tsx     # Order progress indicator
│   │   ├── OrderTrackingInterface.tsx # Order tracking interface
│   │   └── ProtectedRoute.tsx       # Route protection wrapper
│   ├── context/
│   │   ├── AdminContext.tsx         # Admin context provider
│   │   ├── AuthContext.tsx          # Authentication context provider
│   │   └── OrderContext.tsx         # Order context provider
│   ├── lib/
│   │   └── auth.ts                  # Authentication utilities
│   └── types/
│       ├── auth.ts                  # Authentication types
│       ├── order.ts                 # Order types
│       └── user.ts                  # User types
├── public/                          # Public assets
│   ├── assets/                      # Additional public assets
│   └── favicon files
├── CLAUDE.md                        # Project documentation
├── dev-record.md                    # Development record
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Project dependencies
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── wsl2-setup.ps1                   # WSL2 setup script
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lab2dent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Click "Sign In" to access the login page

## 🔐 Test Accounts

The application includes three pre-configured test accounts for demonstration:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Clinic** | `clinic@test.com` | `test123` | Clinic dashboard, patient/order management |
| **Lab** | `lab@test.com` | `test123` | Lab dashboard, work queue management |
| **Admin** | `admin@test.com` | `test123` | Admin dashboard, system oversight |

### Testing Authentication Flow

1. Visit the login page (`/login`)
2. Click on any test account button to auto-fill credentials
3. Click "Sign in" to authenticate
4. You'll be automatically redirected to the appropriate dashboard based on your role
5. Test role-based access by trying to visit other dashboard URLs

## 🏛️ System Architecture

### Authentication Flow
```
Landing Page → Login Page → Role-based Redirect → Protected Dashboard
     ↓              ↓              ↓                    ↓
Auto-redirect   Test accounts   AuthContext        ProtectedRoute
if logged in    available      manages state       validates access
```

### Component Hierarchy
```
App Layout (AuthProvider)
├── Landing Page
├── Login Page  
├── Protected Dashboards
│   ├── Clinic Dashboard
│   ├── Lab Dashboard
│   └── Admin Dashboard
└── Unauthorized Page
```

## 🔒 Security Features

- **Route Protection**: All dashboard routes require authentication
- **Role-based Access Control**: Users can only access their designated dashboard
- **Session Management**: Automatic login persistence and cleanup
- **Secure Authentication**: Password removal from client-side user objects
- **Unauthorized Access Handling**: Graceful error pages for invalid access attempts

## 🎨 UI/UX Design

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Consistent Branding**: Unified color scheme and typography
- **Intuitive Navigation**: Clear user role indication and easy logout
- **Loading States**: Smooth transitions and loading indicators
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📊 Dashboard Features

### Shared Features
- User identification in navigation
- Secure logout functionality  
- Responsive card-based layouts
- Real-time status indicators

### Role-specific Content
- **Clinic**: Patient-centric metrics and order tracking
- **Lab**: Production-focused workflow and queue management
- **Admin**: System-wide analytics and health monitoring

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

### Code Organization

- **Types**: Centralized TypeScript interfaces in `/types`
- **Authentication Logic**: Separated into `/lib/auth.ts` for reusability
- **Context Management**: React Context for global state management
- **Component Isolation**: Reusable components with clear interfaces
- **Page Structure**: App Router structure for optimal SEO and performance

## 🔧 Customization

### Adding New User Roles
1. Update `UserRole` type in `/src/types/auth.ts`
2. Add test user to `TEST_USERS` in `/src/lib/auth.ts`  
3. Create dashboard route in `/src/app/[role]/dashboard/`
4. Update `getRedirectPath()` function for new role routing

### Extending Dashboards
- Each dashboard is a separate page component
- Use the `DashboardLayout` component for consistency
- Wrap with `ProtectedRoute` and specify `allowedRoles`
- Add role-specific content and functionality

## 📈 Future Enhancements

### Planned Features
- Real database integration (PostgreSQL/MongoDB)
- Advanced user management and permissions
- Real-time notifications and messaging
- File upload and document management
- API integration for external lab systems
- Advanced reporting and analytics
- Multi-language support

### Technical Improvements
- Server-side session management
- API rate limiting and security headers
- Comprehensive test coverage
- Production deployment configuration
- CI/CD pipeline setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes with descriptive messages
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For questions, issues, or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Review the documentation and code comments

---

**Lab2Dent** - Connecting dental professionals through technology 🦷✨
