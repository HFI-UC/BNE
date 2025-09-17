# Architecture Overview

## Overview
- React single-page application in `frontend` built with Vite + TypeScript
- Slim 4 PHP backend in `backend`
- MySQL 5.6 for persistence
- Tencent Cloud COS for file storage using `qcloud/cos-sdk-v5`
- Audit and error logging via Monolog to separate log files
- ACL-based account system with roles: guest, student, mentor, admin

## Modules
### Backend (`backend`)
- `public/index.php` entrypoint for Slim
- Middleware pipeline: session, JSON parsing, error handler, audit logging, ACL enforcement
- Controllers for auth, articles, bookings, resources, admin
- Services for business logic and integrations
- Repositories for database access (PDO)
- Migrations under `database/migrations`
- Configuration via `.env` loaded using `vlucas/phpdotenv`

### Frontend (`frontend`)
- React + TypeScript via Vite
- React Router for pages (home, archive, login, bookings, resources, admin)
- React Query for data fetching and caching
- Tailwind CSS for styling
- Axios-based API client with auth token management

## Database Schema (MySQL 5.6)
- `users`: user accounts with roles
- `mentors`: mentor profiles linked to users
- `articles`: content for homepage
- `announcements`: announcements feed
- `bookings`: mentor appointment records
- `resources`: uploaded study materials
- `audit_logs`: structured audit trail
- `error_logs`: persisted errors

All timestamps stored as `TIMESTAMP` or `DATETIME` compatible with MySQL 5.6. JSON data stored in TEXT columns as serialized JSON strings.

## Logging
- Error log: `logs/error.log` rotated via Monolog `RotatingFileHandler`
- Audit log: `logs/audit.log` capturing every request
- `DatabaseErrorHandler` persists critical errors into `error_logs`

## ACL & Authentication
- Session-based auth with HTTP-only cookies
- Roles: guest, student, mentor, admin
- `AclMiddleware` protects routes through allowlists per endpoint

## COS Integration
- `ResourceService` uploads files to COS bucket and stores metadata
- Downloads provided via time-limited pre-signed URLs

## Deployment Notes
- Provide docker-compose for PHP-FPM, Nginx, MySQL 5.6, and frontend dev server
- CI should run PHP/JS unit tests and linting
