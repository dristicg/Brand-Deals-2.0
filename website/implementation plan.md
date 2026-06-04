# IMPLEMENTATION ROADMAP (AI AGENT SAFE)

## Sprint 0

Project Setup

Create repositories

/frontend
/backend
/docs

Setup:

TypeScript
ESLint
Prettier
GitHub Actions
CodeRabbit

Deliverable:
Monorepo ready

---

## Sprint 1

Authentication

User Schema

Register

Login

Google OAuth

JWT

Forgot Password

Deliverable:
Working Auth System

---

## Sprint 2

Product Module

Product Schema

CRUD

Image Upload

Cloudinary Integration

Search

Filters

Pagination

Deliverable:
Admin can manage products

---

## Sprint 3

Catalog Frontend

Home Page

Collections Page

Product Detail Page

SEO Metadata

Deliverable:
Customers can browse products

---

## Sprint 4

Cart & Wishlist

Cart APIs

Wishlist APIs

Cart UI

Wishlist UI

Deliverable:
Shopping flow operational

---

## Sprint 5

Checkout & Payments

Address Management

Razorpay Integration

Payment Verification

Order Creation

Deliverable:
Customer can purchase products

---

## Sprint 6

Order Management

Order APIs

Order Tracking UI

Admin Order Dashboard

Status Updates

Deliverable:
Order lifecycle operational

---

## Sprint 7

Reviews & Ratings

Review APIs

Review UI

Verified Purchase Logic

Deliverable:
Trust-building system

---

## Sprint 8

Coupons

Coupon Engine

Admin Coupon Management

Coupon Validation

Deliverable:
Marketing features

---

## Sprint 9

Admin Dashboard

Revenue Metrics

Orders Metrics

Customer Metrics

Inventory Metrics

Deliverable:
Business management dashboard

---

## Sprint 10

Production Hardening

Security Audit

Performance Audit

Lighthouse Audit

Load Testing

Error Monitoring

Deliverable:
Launch Ready

---

# AI AGENT RULES

1. Never create undocumented APIs.

2. Never modify schema without approval.

3. Never write frontend before backend contract exists.

4. Never trust frontend data.

5. Every feature requires:

   * Schema
   * API
   * Validation
   * Error Handling
   * Authorization

6. Every pull request must pass:

   * Build
   * ESLint
   * Type Check
   * CodeRabbit Review

7. Follow order:

Schema
→ API Contract
→ Backend
→ Frontend
→ Testing
→ Merge

8. No mock code in production branches.
