# 05-EVENT-FLOWS.md

# User Registration Flow

User
↓
Register Form
↓
Backend Validation
↓
Hash Password
↓
Create User
↓
Generate JWT
↓
Return User Session

Failure Cases

* Email already exists
* Invalid email
* Weak password

---

# Google Login Flow

User
↓
Google OAuth
↓
Google Returns Token
↓
Backend Verify Token
↓
Create User (if not exists)
↓
Generate JWT
↓
Login Success

---

# Product Browsing Flow

User
↓
Collections Page
↓
Filter/Search
↓
GET /products
↓
Display Products

---

# Product Detail Flow

User
↓
Product Page
↓
GET /products/:slug
↓
Display Product

---

# Add To Cart Flow

User
↓
Select Size
↓
Add To Cart
↓
Validate Product Exists
↓
Validate Stock Exists
↓
Update Cart Collection
↓
Return Updated Cart

---

# Checkout Flow

User
↓
Cart Review
↓
Select Address
↓
Apply Coupon
↓
Checkout

---

# Razorpay Payment Flow

User
↓
Checkout
↓
POST /payments/create-order
↓
Backend Calculates Amount
↓
Create Razorpay Order
↓
Return Razorpay Order ID
↓
Frontend Opens Razorpay
↓
Payment Success
↓
POST /payments/verify
↓
Backend Verifies Signature

If Valid
↓
Create Order
↓
Reduce Inventory
↓
Send Confirmation Email
↓
Return Success

If Invalid
↓
Reject Request

---

# Order Fulfillment Flow

Pending
↓
Confirmed
↓
Packed
↓
Shipped
↓
Delivered

---

# Product Review Flow

Delivered Order
↓
Customer Reviews Product
↓
Backend Verifies Purchase
↓
Create Review
↓
Update Product Rating

---

# Refund Flow

Customer Requests Refund
↓
Admin Review
↓
Approve Refund
↓
Update Order
↓
Restore Inventory
↓
Initiate Razorpay Refund
↓
Notify Customer
