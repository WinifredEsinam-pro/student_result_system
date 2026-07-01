# 🎓 Student Result Management System

A full-stack web application that allows schools or institutions to manage student results efficiently. Admins can manage students, subjects, and academic results, while the system automatically calculates GPA and generates transcripts.

---

## 🚀 Features

- 🔐 JWT Authentication (login/register with role-based access)
- 🛡️ Admin secret key protection on registration
- 👨‍🎓 Student Management (add, edit, delete, search)
- 📚 Subject Management (add, edit, delete with credit hours)
- 📝 Result Entry (enter scores per student per semester)
- 📊 Automatic GPA Calculation per semester
- 📄 Student Transcript with CGPA across all semesters
- 🔒 Admin-only protected routes
- 🌐 RESTful API built with Express.js

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- helmet (security headers)
- express-rate-limit (brute force protection)

**Frontend:**
- HTML, CSS, JavaScript (vanilla)

---

## 🔒 Security
- Passwords hashed with bcryptjs
- JWT tokens
- Admin secret key required for registration
- Rate limiting on all routes (100 req/15min)
- Strict rate limiting on auth routes (10 req/15min)
- Secure HTTP headers via helmet
- Request payload size limited to 10kb
- Role-based route protection (admin only)
- Environment variables for all secrets
