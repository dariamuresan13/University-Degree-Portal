# University Degree Management (REST Client Web App)

Web application for browsing and managing a university degree catalog via a REST API.
Includes authentication, protected pages, and CRUD-style actions for titles and subjects.

- Token-based login (JWT stored in sessionStorage)
- Protected navigation (redirects to login when unauthenticated)
- Browse available degrees (“titulos”) in a responsive Bootstrap table
- View subjects for a selected degree (“asignaturas”) with session-based selection
- Create new degrees and subjects via Bootstrap modal forms (POST requests)
- Logout endpoint call and session cleanup
- Animated login background using HTML5 Canvas (moving shapes)

## Technologies

- HTML5 / CSS3
- JavaScript (Fetch API, DOM manipulation)
- Bootstrap 5 (tables, modals, responsive UI)
- REST API integration (Bearer token authentication)
- Session Storage (state management between pages)
- HTML5 Canvas (login background animation)
