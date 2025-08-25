# Overview

This is a full-stack web application built with a modern tech stack featuring Express.js backend, React frontend, and PostgreSQL database. The project is structured as a monorepo with shared TypeScript types and utilities. It uses Vite for frontend build tooling, Drizzle ORM for database management, and shadcn/ui for UI components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build Tool**: Fast development server and optimized production builds
- **shadcn/ui Components**: Pre-built, accessible UI components based on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and dark mode support
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with custom query client configuration
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing and request logging
- **TypeScript**: Full type safety across the backend
- **Modular Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)
- **Route Registration**: Centralized route handling through registerRoutes function
- **Error Handling**: Global error middleware for consistent error responses
- **Development Integration**: Vite middleware integration for seamless full-stack development

## Database Design
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Schema Definition**: Centralized schema in shared directory with Zod validation
- **Database Migrations**: Automated migration system with drizzle-kit
- **User Model**: Basic user entity with username/password authentication structure

## Shared Resources
- **Type Definitions**: Shared TypeScript interfaces and types between frontend and backend
- **Schema Validation**: Zod schemas for runtime validation and TypeScript type inference
- **Database Models**: Unified data models accessible to both client and server

## Development Workflow
- **Monorepo Structure**: Single repository with client, server, and shared code
- **Hot Module Replacement**: Vite HMR for instant frontend updates
- **TypeScript Compilation**: Shared tsconfig with path mapping for clean imports
- **Code Quality**: ESLint and Prettier integration for consistent code formatting

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Connection Pooling**: Built-in connection management through Neon serverless adapter

## UI Framework
- **Radix UI**: Headless, accessible component primitives
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide Icons**: Consistent icon library throughout the application
- **shadcn/ui**: Pre-configured component library with design system integration

## Development Tools
- **Vite**: Frontend build tool with plugin ecosystem
- **TypeScript**: Language support with strict type checking
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins
- **ESBuild**: Fast JavaScript bundler for production builds

## Runtime Dependencies
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation support
- **Zod**: Schema validation for runtime type safety
- **Wouter**: Lightweight routing library for React

## Hosting Platform
- **Replit Integration**: Development environment with runtime error overlay and cartographer plugin for enhanced debugging