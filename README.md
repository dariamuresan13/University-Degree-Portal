# University Degree Management (REST Client Web App)

Client-side web application for browsing and managing a university degree catalog through a REST API.  
The application implements authentication, protected navigation, and dynamic data visualization for degrees and their associated subjects.

---

## Purpose

This project demonstrates how a client-side web application can interact with a REST API to authenticate users, retrieve structured data, and dynamically render it in a modern web interface.  
It highlights practical use of JavaScript for asynchronous API communication, state management, and responsive UI development.

---

## Features

- Token-based authentication with JWT stored in `sessionStorage`
- Protected pages with automatic redirection to login when unauthenticated
- Dynamic retrieval and display of available degrees (“titulos”)
- Navigation to subjects associated with a selected degree
- Creation of new degrees and subjects via Bootstrap modal forms
- Logout functionality with session cleanup
- Interactive login page with animated HTML5 Canvas background

---

## Application Flow

1. User logs in using credentials via a REST API endpoint.
2. The authentication token is stored in `sessionStorage`.
3. Authorized requests retrieve the list of available degrees.
4. Selecting a degree loads its associated subjects.
5. Users can create new degrees or subjects using modal forms.
6. Logout clears the session and returns to the login page.

---

## Technologies

- HTML5
- CSS3
- JavaScript (DOM manipulation, Fetch API)
- Bootstrap 5
- REST API integration (Bearer token authentication)
- Session Storage
- HTML5 Canvas animations


