# AI Financial Wealth Planner

## Project Introduction
This is a full-stack GenAI web application designed to act as a personalized financial advisor. Users can create an account, securely log in, and input their financial metrics to generate a customized, AI-driven financial plan and asset allocation strategy.

## Features
* **Secure Authentication:** User sign-up and sign-in functionality with hashed passwords.
* **Protected Routes:** The main financial dashboard is only accessible to authenticated users.
* **AI Financial Advisor:** Integrates Google's Gemini API to generate custom financial roadmaps based on user income, savings, risk tolerance, and goals.
* **Persistent Storage:** User credentials are saved securely in a MongoDB database.

## Technologies Used
* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ORM)
* **AI API:** Google Gemini API (`gemini-1.5-flash`)
* **Hosting:** Render

## Database Schema
The database consists of a `User` collection with the following schema:
* `username`: String, required, unique
* `email`: String, required, unique
* `password`: String, required (hashed via bcrypt)

## How to Run Locally
1. Clone the repository: `git clone [Your GitHub Link]`
2. Navigate to the directory: `cd financial-planner-app`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add the following:
   * `PORT=3000`
   * `MONGO_URI=your_mongodb_connection_string`
   * `GEMINI_API_KEY=your_gemini_api_key`
   * `SESSION_SECRET=any_random_string`
5. Start the server: `npm start`
6. Open your browser and navigate to `http://localhost:3000`

## Submission Details
* **GitHub Repository:** [Insert Link]
* **Deployed Web App:** [Insert Render Link]
* **Test Credentials:** * Username: `ProfessorTest`
    * Password: `GradeMe123!`