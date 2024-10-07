
# Blogster - Frontend   
## Live Link :- 
```bash 
https://blogster-v1.vercel.app/signup
```

## Overview

This is the frontend for **Blogster**, a blogging platform where users can sign up, create blog posts, like, comment, and explore various blogs. The frontend is built using **React** and **Tailwind CSS**, featuring various UI enhancements and functionalities such as search, sorting, pagination, and form validation.

### Key Features

-   **Sign-up and Sign-in**: Users can register or login with an email and password that follow specific security rules.
-   **Email Validation**: Email format is validated using Zod. If an invalid email or password is entered, the user is shown an appropriate warning message.
-   **Password Validation**: Passwords must include at least 6 characters, with 1 capital letter, 1 special character, and 1 numeric digit.
-   **Search Functionality**: Search through the blogs based on title and content.
-   **Sorting Options**: Sort blogs by Date, Likes, or Comments.
-   **Pagination**: Blog posts are displayed with pagination, loading a fixed number of posts per page.
-   **Comment and Like System**: Logged-in users can like blog posts and add comments.
-   **Related Posts**: Display related blog posts below the author section in each blog.
-   **Responsive Design**: The platform is fully responsive and mobile-friendly, optimized for all screen sizes.

## Getting Started

### Prerequisites

-   Node.js (v14 or above)
-   npm (v6 or above)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Shrike0p/Blogster-Frontend
    ``` 
    
3.  Navigate to the project directory:
    
    ```bash
    cd frontend
    ```
    
4.  Install the dependencies:
    
    ```bash
    npm install
    ``` 
    
5.  Create a `.env` file at the root of the project and add the following environment variable:
    
    ```bash
    BACKEND_URL=http://localhost:3000
    ``` 
    
    Replace the backend URL if your backend is running on a different port or domain.
    
6.  Start the development server:
    
    ```bash
    npm start
    ``` 
    
    The application will start at `http://localhost:5173` (or any other port Vite chooses).
    

### New Features Added:

1.  **Form Validation**: Added Zod for validating email and password during sign-up and sign-in. The system ensures that email is correctly formatted and that passwords contain at least one capital letter, one special character, and one number.
2.  **Error Messaging**: Display appropriate error messages if the user inputs an incorrect email or password format or if an existing email is used during registration.
3.  **Related Blog Posts**: Display related blog posts below the author section, allowing users to explore more content on the website.
4.  **Responsive UI**: Improved the responsiveness and overall look-and-feel of the blog cards and blog pages, including pagination, sorting, and searching.
