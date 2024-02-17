# EdTech Project - Full Stack MERN

Welcome to the repository for the EdTech Project, a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to provide an educational platform for both students and instructors. This project includes features such as user authentication, profile management, course enrollment, instructor dashboard, and more.

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Project Functionalities](#2-project-functionalities)
- [3. Technologies Used](#3-technologies-used)
- [4. Installation](#4-installation)
- [5. Usage](#5-usage)
- [6. Live Demo](#6-live-demo)
- [7. Contributing](#7-contributing)

## 1. Introduction

The EdTech project aims to provide a comprehensive online learning platform where users can sign up as students or instructors, enroll in courses, manage their profiles, and interact with course content. It includes functionalities such as OTP-based registration, password reset, course purchase, and instructor dashboard for course management.

## 2. Project Functionalities

**User Authentication:**

- Users can sign up as either students or instructors.
- Upon filling in the signup details and clicking "create account," an OTP is sent to the user's email.
- Users must enter the OTP to successfully sign up. They can request a resend if the OTP expires or doesn't match.

**Password Management:**

- Users who forget their passwords can reset them by clicking the "forgot password" button on the login page.
- A password reset link is sent to the user's registered email.

**User Profile Management:**

- Upon login, users are directed to their profile page.
- Users can edit their details by clicking the edit button, redirecting them to the settings route.

**Student Dashboard:**

- Students can view their enrolled courses and cart on the dashboard sidebar.
- Enrolled courses display duration and progress.

**Instructor Dashboard:**

- Instructors can view their total number of courses, income, and how many students have purchased their courses.
- Course analytics include the number of enrolled students and revenue generated.
- They can add new courses by following a three-step process:
  1. Fill in course details such as name, description, price, thumbnail, instruction, what will you learn, category, and tags.
  2. Build the course by adding sections and subsections. Each subsection contains a single video, and each section can have any number of subsections.
  3. Click on the checkbox to make the course public.

**Admin Features:**

- Admins can create categories for courses.

## 3. Technologies Used

The project is built using the following technologies:

- **Frontend**:
  - React.js: For building the user interface.
  - HTML and CSS: For structuring and styling the application.
- **Backend**:
  - Node.js: For server-side logic.
  - Express.js: As the web application framework.
  - MongoDB: For database management.
- **Authentication and Email**:
  - JWT (JSON Web Tokens): For user authentication.
  - Nodemailer: For sending emails for password reset, OTP, and course purchase.
  - Bcrypt: For password hashing and encryption.
  - otp-generator: For generating OTP (One-Time Passwords).
- **Image and Video Management**:
  - Cloudinary: For storing video lectures, thumbnails, and user profile pictures.
- **Payment Gateway**:
  - Razorpay: For test payment processing.
- **Other Dependencies**:
  - Mongoose: For MongoDB object modeling.
  - Axios: For making HTTP requests.
  - React Router: For client-side routing.

## 4. Installation

To run the project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/SaranshKhandelwal977/StudyNotion-EdTech.git
```
2. Navigate to the project directory:
```bash
cd StudyNotion-EdTech
```
3. Install the dependencies for both the frontend and backend:
```bash
npm install
cd backend
npm install
```
4. Set up your MongoDB database and update the connection string in the backend `.env` file.

5. Start the backend server:
```bash
npm start
```
6. Start the frontend development server:
```bash
npm start
```
7. Open your browser and go to `http://localhost:3000` to access the application.

## 5. Usage

1. Sign up as a student or instructor and verify your account using the OTP sent to your email.
2. Log in with your credentials.
3. Explore the course catalog, enroll in courses, and manage your profile.
4. If you're an instructor, access the instructor dashboard to manage your courses and view statistics.

## 6. Live Demo

Check out the live demo of the EdTech Project [here](https://study-notion-ed-tech-eight.vercel.app/).

## 7. Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to submit a pull request.
1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

