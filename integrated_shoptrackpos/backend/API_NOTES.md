# ShopTrackPOS Backend API Documentation Notes

This document provides a brief overview of the Django backend API developed for the ShopTrackPOS management system.

## Project Structure

The project follows a standard Django structure:

- `/home/ubuntu/shoptrackpos_project/`
  - `src/`: Contains the main Django project (`shoptrackpos`) and individual apps (`accounts`, `pos`, `activity_logs`, `tickets`, `website`, `blog`, `reports`).
  - `venv/`: Python virtual environment.
  - `requirements.txt`: Lists project dependencies.
  - `todo.md`: Task checklist used during development.

## Core Apps

- **accounts**: Manages users (`CustomUser` model) and permissions.
- **pos**: Handles Point of Sale related data: `Business`, `Transaction`, `Complaint`.
- **activity_logs**: Logs user actions (`ActivityLog` model).
- **tickets**: Manages support tickets (`Ticket`, `TicketComment` models).
- **website**: Manages static website content (`Page` model).
- **blog**: Manages blog content (`Category`, `Tag`, `Post` models).
- **reports**: Provides API endpoints for dashboard statistics and sales overview.

## Authentication

- **JWT (JSON Web Tokens)**: Implemented using `djangorestframework-simplejwt`.
- **Endpoints**:
  - `/api/token/`: Obtain JWT token pair (access and refresh) using username and password.
  - `/api/token/refresh/`: Refresh the access token using a valid refresh token.
  - `/api/token/verify/`: Verify an access token.
- **Usage**: Include the access token in the `Authorization` header as `Bearer <token>` for authenticated requests.

## Key API Endpoints Overview

Base URL: `/api/`

- **Accounts**: `/accounts/users/` (Admin only)
- **POS**:
  - `/pos/businesses/` (Staff manage, Authenticated read)
  - `/pos/transactions/` (Admin read-only - creation/modification intended via specific business logic)
  - `/pos/complaints/` (Reporter/Admin manage, Authenticated read)
- **Activity Logs**: `/activity_logs/logs/` (Admin read-only)
- **Tickets**:
  - `/tickets/tickets/` (Authenticated create/view own/assigned, Staff manage all)
  - `/tickets/tickets/{pk}/assign/` (POST, Staff assign)
  - `/tickets/tickets/{pk}/update_status/` (POST, Staff update status)
  - `/tickets/tickets/{pk}/comments/` (GET/POST, Authenticated view/comment on accessible tickets)
  - `/tickets/comments/{pk}/` (GET/PUT/PATCH/DELETE, Comment Author/Staff manage)
- **Website**: `/website/pages/` (Admin manage, Public read published), `/website/pages/{slug}/`
- **Blog**:
  - `/blog/categories/` (Admin manage, Public read), `/blog/categories/{slug}/`
  - `/blog/tags/` (Admin manage, Public read), `/blog/tags/{slug}/`
  - `/blog/posts/` (Admin manage, Public read published), `/blog/posts/{slug}/`
- **Reports**:
  - `/reports/dashboard-stats/` (GET, Admin only)
  - `/reports/sales-overview/` (GET, Admin only, accepts `?period=week|month|year`)

**Note**: Permissions are enforced. Refer to the `permissions.py` files and viewset configurations for specific rules.

## Running the Backend

1.  Navigate to `/home/ubuntu/shoptrackpos_project/`.
2.  Activate the virtual environment: `source venv/bin/activate`.
3.  Navigate to the source directory: `cd src`.
4.  Run migrations (if needed): `python manage.py migrate`.
5.  Create a superuser (if needed): `python manage.py createsuperuser`.
6.  Start the development server: `python manage.py runserver 0.0.0.0:8000`.

The API will be accessible, typically at `http://<your-ip>:8000/api/`.

## Further Development

- Implement more comprehensive API tests using `APIClient`.
- Refine permissions based on specific user roles (e.g., Business Owner).
- Develop the frontend application to interact with this API.
- Configure for production deployment (DEBUG=False, ALLOWED_HOSTS, static files, WSGI server, etc.).

