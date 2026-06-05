# 06-DEVELOPMENT-RULES.md

# Project Rules

This document is mandatory for all developers and AI coding agents.

---

# Architecture Rules

1. Frontend and Backend remain separate applications.

2. Business logic never belongs in UI components.

3. Database access only through service layer.

4. Controllers must remain thin.

5. Services contain business logic.

6. Validation happens before service execution.

---

# API Rules

1. Every endpoint must exist in API-CONTRACT.md.

2. No undocumented endpoints.

3. No breaking API changes.

4. Standard response format required.

5. Proper HTTP status codes required.

---

# Database Rules

1. No schema changes without approval.

2. No direct database calls from controllers.

3. Always use indexes where required.

4. Soft-delete preferred over hard-delete where applicable.

---

# Authentication Rules

1. Passwords must be hashed.

2. JWT required for protected routes.

3. Admin routes require role verification.

4. Never trust client role values.

---

# Payment Rules

1. Frontend payment success is never trusted.

2. Razorpay signature verification mandatory.

3. Orders created only after verification.

4. Inventory reduced only after verification.

---

# Pull Request Rules

Every PR must contain:

* Description
* Screenshots (frontend)
* Testing notes
* API updates

Must pass:

* Build
* Type check
* ESLint
* CodeRabbit review

---

# AI Agent Rules

1. Never invent schemas.

2. Never invent APIs.

3. Never skip validation.

4. Never write mock production code.

5. Follow:

Schema
→ API
→ Backend
→ Frontend
→ Testing
