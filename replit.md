# Replit.md - Hindi Motivational Blog

## Overview

This is a modern Hindi motivational blog website built with React and TypeScript. The platform allows only admin users to create and manage content (text, images, videos) while providing public users with the ability to view and filter content. The design emphasizes simplicity, accessibility, and cultural relevance with support for Hindi content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React Context API for theme and authentication
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom color scheme and shadcn/ui components
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: Firebase Auth with Google OAuth
- **File Storage**: Firebase Storage for media uploads
- **Database Schema**: Drizzle with Zod validation

### Key Components

1. **Authentication System**
   - Firebase Auth integration with Google sign-in
   - Role-based access control (admin vs public users)
   - Context-based authentication state management

2. **Content Management**
   - Post creation with multiple content types (text, image, video)
   - Media upload and storage via Firebase Storage
   - CRUD operations for admin users

3. **User Interface**
   - Responsive design with mobile-first approach
   - Dark/light theme support with persistent preferences
   - Hindi font support (Noto Sans Devanagari)
   - Clean, distraction-free layout

4. **Data Layer**
   - PostgreSQL database with two main tables: users and posts
   - Drizzle ORM for type-safe database operations
   - Zod schemas for runtime validation

## Data Flow

1. **Content Creation**: Admin users authenticate via Firebase → Create posts with text/media → Data stored in PostgreSQL via Drizzle ORM
2. **Content Consumption**: Public users browse posts → Data fetched via React Query → Rendered with filtering and theming support
3. **Media Handling**: Files uploaded to Firebase Storage → URLs stored in database → Displayed in optimized components

## External Dependencies

### Core Dependencies
- **Firebase**: Authentication, file storage, and real-time features
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **shadcn/ui**: Accessible component library
- **TanStack Query**: Server state management

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations in `migrations/` directory

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Firebase configuration via environment variables
- Production server runs on Node.js with bundled Express app

### Key Features
- **Multilingual Support**: Primary Hindi content with English UI elements
- **Content Filtering**: Filter by author and content type
- **Responsive Design**: Works across all device sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized images, lazy loading, and efficient queries

The architecture prioritizes simplicity and maintainability while providing a robust foundation for a content-focused application with clear separation between public and admin functionalities.