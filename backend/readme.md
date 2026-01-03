# HRMS Backend API

A comprehensive Human Resource Management System (HRMS) backend built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- ✅ Secure user registration with email verification
- ✅ JWT-based authentication
- ✅ Role-based access control (Employee, HR, Admin)
- ✅ Password reset functionality
- ✅ Rate limiting on authentication endpoints

### Employee Management
- ✅ Complete employee profile management
- ✅ Personal and job details
- ✅ Document upload and management
- ✅ Profile picture support
- ✅ Employee activation/deactivation

### Attendance Management
- ✅ Daily check-in/check-out system
- ✅ Attendance status tracking (Present, Absent, Half-day, Leave)
- ✅ Automatic working hours calculation
- ✅ Daily and weekly attendance views
- ✅ Manual attendance marking by HR/Admin
- ✅ Attendance reports and summaries

### Leave Management
- ✅ Leave application with multiple types (Paid, Sick, Unpaid, Casual, Maternity, Paternity)
- ✅ Leave approval/rejection workflow
- ✅ Leave balance tracking
- ✅ Email notifications for leave status
- ✅ Leave history and reporting
- ✅ Automatic attendance marking for approved leaves

### Payroll Management
- ✅ Comprehensive salary structure (Basic + Allowances - Deductions)
- ✅ Salary history tracking
- ✅ Bank details management
- ✅ Salary slip generation
- ✅ Payroll reports and analytics

### Admin Dashboard
- ✅ Employee management
- ✅ Attendance reports
- ✅ Leave approvals
- ✅ Payroll overview
- ✅ Analytics and statistics
- ✅ Bulk operations support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hrms-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## 📁 Project Structure

```
hrms-backend/
│
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── multer.js            # File upload configuration
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Employee.model.js
│   │   ├── Attendance.model.js
│   │   ├── Leave.model.js
│   │   └── Payroll.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── attendance.controller.js
│   │   ├── leave.controller.js
│   │   ├── payroll.controller.js
│   │   └── admin.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── employee.routes.js
│   │   ├── attendance.routes.js
│   │   ├── leave.routes.js
│   │   ├── payroll.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── employee.service.js
│   │   ├── attendance.service.js
│   │   ├── leave.service.js
│   │   └── payroll.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── employee.validator.js
│   │   ├── attendance.validator.js
│   │   ├── leave.validator.js
│   │   └── payroll.validator.js
│   │
│   ├── utils/
│   │   ├── tokenUtils.js
│   │   ├── passwordUtils.js
│   │   ├── emailService.js
│   │   ├── responseHandler.js
│   │   └── constants.js
│   │
│   └── app.js
│
├── uploads/                     # Uploaded files
├── tests/                       # Test files
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup              - Register new user
POST   /api/auth/signin              - Login user
GET    /api/auth/verify-email/:token - Verify email
POST   /api/auth/resend-verification - Resend verification email
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/logout              - Logout user
```

### Employee
```
GET    /api/employee/profile          - Get own profile
PUT    /api/employee/profile          - Update own profile
PUT    /api/employee/profile-picture  - Update profile picture
POST   /api/employee/documents        - Upload document
DELETE /api/employee/documents/:id    - Delete document
GET    /api/employee/dashboard        - Get dashboard data
```

### Attendance
```
POST   /api/attendance/check-in       - Check in
POST   /api/attendance/check-out      - Check out
GET    /api/attendance/my-attendance  - Get own attendance
GET    /api/attendance/today          - Get today's attendance
GET    /api/attendance/all            - Get all attendance (HR/Admin)
POST   /api/attendance/mark           - Mark attendance (HR/Admin)
```

### Leave
```
POST   /api/leave/apply               - Apply for leave
GET    /api/leave/my-leaves           - Get own leaves
GET    /api/leave/balance             - Get leave balance
GET    /api/leave/all                 - Get all leaves (HR/Admin)
GET    /api/leave/pending             - Get pending leaves (HR/Admin)
PUT    /api/leave/:id/approve         - Approve leave (HR/Admin)
PUT    /api/leave/:id/reject          - Reject leave (HR/Admin)
```

### Payroll
```
GET    /api/payroll/my-salary         - Get own salary
GET    /api/payroll/my-salary/history - Get salary history
GET    /api/payroll/all               - Get all payroll (HR/Admin)
POST   /api/payroll/create            - Create payroll (HR/Admin)
PUT    /api/payroll/employee/:id      - Update payroll (HR/Admin)
```

### Admin
```
GET    /api/admin/dashboard           - Get admin dashboard
GET    /api/admin/employees           - Get all employees
POST   /api/admin/employees           - Create employee
PUT    /api/admin/employees/:id       - Update employee
DELETE /api/admin/employees/:id       - Delete employee
GET    /api/admin/reports/attendance  - Attendance report
GET    /api/admin/reports/leave       - Leave report
GET    /api/admin/reports/payroll     - Payroll report
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

1. **Employee**
   - View own profile and documents
   - Check-in/check-out
   - Apply for leave
   - View own attendance and leave records
   - View own salary (read-only)

2. **HR**
   - All Employee permissions
   - View all employees
   - Manage attendance
   - Approve/reject leaves
   - Manage payroll
   - Generate reports

3. **Admin**
   - All HR permissions
   - Create/update/delete employees
   - Change user roles
   - Full system access
   - Bulk operations

## 📧 Email Notifications

The system sends automated emails for:
- Email verification
- Password reset
- Leave approval/rejection
- Welcome emails for new employees

Configure SMTP settings in `.env` file.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation with Joi
- MongoDB injection prevention
- CORS protection
- Helmet security headers
- XSS protection

## 📊 Database Schema

### User
- Employee ID, Email, Password
- Role, Email verification status
- Timestamps

### Employee
- Personal details (name, DOB, gender, contact)
- Job details (designation, department, joining date)
- Profile picture and documents

### Attendance
- Employee reference
- Date, Status, Check-in/Check-out times
- Working hours (auto-calculated)

### Leave
- Employee reference
- Leave type, Start/End dates, Total days
- Status (Pending/Approved/Rejected)
- Admin comments

### Payroll
- Employee reference
- Salary structure (basic, allowances, deductions)
- Calculated fields (gross, net salary)
- Bank details and salary history

## 🚧 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## 📝 Environment Variables

Refer to `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Express.js
- MongoDB
- JWT
- Joi Validation
- Nodemailer

## 📞 Support

For support, email support@hrms.com or create an issue in the repository.

---

**Happy Coding! 🚀**