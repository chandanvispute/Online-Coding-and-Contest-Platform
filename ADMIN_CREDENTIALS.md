# 🔐 CodePlatform Admin Credentials

## 👤 **Admin User Accounts**

Your CodePlatform now has **3 admin accounts** with full administrative privileges:

### **Primary Admin Account**
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: admin@codeplatform.com
- **Role**: Administrator
- **User ID**: 1

### **Super Admin Account**
- **Username**: `superadmin`
- **Password**: `admin123`
- **Email**: superadmin@codeplatform.com
- **Role**: Administrator
- **User ID**: 9

### **Code Admin Account**
- **Username**: `codeadmin`
- **Password**: `admin123`
- **Email**: codeadmin@codeplatform.com
- **Role**: Administrator
- **User ID**: 10

## 🎯 **How to Use Admin Accounts**

### **Login to Frontend**
1. Open: http://localhost:5173
2. Use any of the admin credentials above
3. Access admin panel and all administrative features

### **API Access**
All admin accounts have access to:
- User management endpoints
- Problem creation and management
- Contest administration
- Platform statistics and analytics

### **Database Access**
- **pgAdmin URL**: http://localhost:5050
- **Email**: admin@codeplatform.com
- **Password**: password

**Database Connection Details:**
- **Host**: localhost (or postgres from Docker)
- **Port**: 5432
- **Database**: codeplatform
- **Username**: admin
- **Password**: password

## 🛠️ **Admin Capabilities**

With these admin accounts, you can:

### **User Management**
- View all registered users
- Promote users to admin role
- Manage user accounts and permissions
- View user statistics and activity

### **Problem Management**
- Create new coding problems
- Edit existing problems
- Add test cases and boilerplate code
- Set difficulty levels and constraints

### **Contest Management**
- Create new coding contests
- Add problems to contests
- Manage contest schedules
- View contest leaderboards and results

### **Platform Analytics**
- View platform usage statistics
- Monitor submission trends
- Track user engagement metrics
- Generate reports

## 🔒 **Security Notes**

- All passwords are BCrypt hashed in the database
- The password `admin123` is used for all admin accounts for simplicity
- In production, use strong, unique passwords for each admin account
- Consider implementing 2FA for enhanced security

## 📊 **Current Database Status**

**Total Users**: 10 (3 admins, 7 regular users)
**Total Problems**: 6 coding challenges
**Total Contests**: 3 (past, ongoing, upcoming)
**Total Submissions**: 20+ realistic submissions

## 🚀 **Quick Access Links**

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database Admin**: http://localhost:5050
- **API Documentation**: http://localhost:8080/api/problems

## ✅ **Verification**

All admin accounts have been verified and are working correctly:
- ✅ Database entries created
- ✅ API endpoints accessible
- ✅ Admin role permissions active
- ✅ Frontend login ready

**Your CodePlatform is ready for full administrative use! 🎉**