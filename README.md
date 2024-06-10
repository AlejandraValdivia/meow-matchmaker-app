# Meow Matchmaker Full Stack App

## Project Description

The Meow Matchmaker App is a web application designed to connect users who are interested in adopting, fostering, volunteering to care for cats, and looking for renting cats for events or special needs such as birthdays. Additionally, users can join a fan club to post and delete content, comment on posts, and make friends with other cat lovers.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [User Stories](#user-stories)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with secure password hashing
- Volunteer, foster, and adopt cats
- Join the fan club to post, delete, and comment
- Make friends with other cat lovers
- Responsive design for various screen sizes
- Error handling for broken links and server issues

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/AlejandraValdivia/meow-matchmaker-app
   cd cat-adoption-app
   ```

## User Stories

- The users can sign up and log in, so they can access the app's features.
- As an admin, the user can browse cat listings, so they can apply to adopt, foster,volunteer or rent a cat they find.
- As an admin, the user can delete posts, so they can remove unwanted content.
- Join the fan club, so they can post and share content about cats.
- As an admin, the user can delete comments, so they can remove unwanted content.
- Make friends with other users, so they can connect with fellow cat lovers. 
- Contact the shelter with any questions or concerns. 🥰😻

## Technologies Used

Backend: Node.js, Express
Frontend: EJS, CSS, HTML, JavaScript
Database: MongoDB, Mongoose
Authentication: Passport.js, bcrypt
APIs: The Cat API 

## Contributing
Fork the repository.
Create your feature branch: git checkout -b feature/YourFeature
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin feature/YourFeature
Open a pull request.

## Installation Instructions

1.- Fork the repository
2.- Clone the repository to your local machine
3.- Install the following packages:

- npm install
- npm install express
- npm install express-session
- npm install method-override
- npm install axios
- npm install mongoose
- npm install mongodb
- npm install ejs
- npm install dotenv
- npm install express-ejs-layouts
- npm install passport
- npm install passport-local
- npm install bcrypt
- npm install connect-flash

Go to http://localhost:3000/ and browse the app!

## Wireframe

![wireframe](public/assets/img/meow-matchmaker-wireframe-v2.jpg)

## ERD - Database Schemas

### User 👧🏽 👦🏻

- id
- name
- email
- username
- password
- phone number (optional)

### Cat 🐱

- id
- name
- image
- description
- age (life span)
- origin (country of origin)
- afectionLevel

### Post

- id
- username
- title
- content

### Comment

- id
- content
- username

### Application Form

- id
- user_id
- name
- email
- phone number
- origin (country of origin)
- services

### Contact Form

- id
- name
- email
- message

![erd-diagram](public/assets/img/erd-meow-matchmaker-databases.jpeg)
