# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Application Architecture

This is a Next.js 15 application for One Way Electric, an electrical services company. The application serves as both a customer-facing website and admin dashboard for managing service requests.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Framework**: Tailwind CSS v4 with shadcn/ui components
- **Icons**: Lucide React and Tabler Icons
- **Theme**: next-themes for dark/light mode support
- **Data Tables**: @tanstack/react-table
- **Charts**: Recharts
- **Validation**: Zod

### Key Application Areas

#### Customer Frontend (`app/page.tsx`)
- Landing page with service information, hero section, and contact details
- Service request modal for customers to submit requests
- Company phone: (773) 710-9794
- Services: Residential, Commercial, Emergency, Maintenance

#### Admin Dashboard (`app/admin/page.tsx`)
- Protected admin interface for managing service requests
- Request filtering by service type and status
- Status management: Pending, In Progress, Scheduled, Completed, Denied
- Dark/light theme toggle functionality
- Request cards with customer details and action buttons

#### API Routes (`app/api/`)
- All API routes proxy to AWS API Gateway using `API_HOST` and `API_KEY` environment variables
- Service request management endpoints
- Admin authentication (currently middleware is commented out)

### Component Structure

#### UI Components (`components/ui/`)
- Follows shadcn/ui patterns with Tailwind CSS
- Uses class-variance-authority (cva) for component variants
- Supports dark mode with CSS variables
- Focus management and accessibility features built-in

#### Custom Components
- `ServiceRequestModal`: Customer service request form
- `RequestCard`: Admin dashboard request display
- `NavBar`: Site navigation with dark mode support
- `ThemeProvider`: Wraps app for theme management

### Data Flow

#### Service Request Lifecycle
1. Customer submits request via modal on homepage
2. Request sent to `/api/service-request`
3. Admin views requests in dashboard via `/api/get-service-requests`
4. Admin can update status, send quotes, and manage requests
5. Status updates flow through `/api/approve-service-request` and related endpoints

#### Type Definitions
Key types defined in admin dashboard:
- `ServiceRequest`: Frontend service request structure
- `ApiServiceRequest`: Backend API response structure
- `Status`: Request status enum

### Environment Variables Required
- `API_HOST`: AWS API Gateway base URL
- `API_KEY`: API Gateway authentication key

### Styling Approach
- Tailwind CSS v4 with PostCSS plugin
- CSS variables for theme colors
- Dark mode support throughout
- Custom chart colors defined as `chart-1`, `chart-2`, etc.
- Component styling follows shadcn/ui patterns

### Authentication
- Admin routes intended to be protected (middleware exists but currently disabled)
- Cookie-based admin authentication system ready for implementation

### Path Aliases
- `@/*`: Root directory
- `@/components`: Components directory
- `@/lib`: Utility functions
- `@/hooks`: Custom React hooks