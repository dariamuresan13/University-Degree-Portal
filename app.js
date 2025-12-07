document.addEventListener("DOMContentLoaded", function () {
    const token = sessionStorage.getItem("token");
    const titleList = document.getElementById("title-list");
    const subjectList = document.getElementById("subject-list");

    if (!token && (titleList || subjectList)) {
        window.location.href = "index.html";
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            try {
                const response = await fetch("https://lablsi1.upct.es:8080/apirest/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem("token", data.token);
                    window.location.href = "titulos.html";
                } else {
                    document.getElementById("error-message").textContent = "Invalid credentials";
                }
            } catch (error) {
                console.error("Login failed", error);
            }
        });
    }

    // Fetch titles
    async function fetchTitles() {
        const titleList = document.getElementById("title-list");
        titleList.innerHTML = ""; // Clear old content
        const response = await fetch("https://lablsi1.upct.es:8080/apirest/titulos", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        const table = document.createElement("table");
        table.classList.add("table", "table-striped");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = ["ID", "Degree Name", "University", "Acronym", "Level", "Select"];
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        data.titulos.forEach(title => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${title.id_titulo}</td>
                <td>${title.denominacion}</td>
                <td>${title.centro}</td>
                <td>${title.acronimo_centro}</td>
                <td>${title.nivel}</td>
                <td><button class="btn btn-green-custom btn-sm">View Subjects</button></td>

            `;

            row.querySelector("button").addEventListener("click", function () {
                sessionStorage.setItem("selectedTitleId", title.id_titulo);
                window.location.href = "asignaturas.html";
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        titleList.appendChild(table);
    }

    if (titleList) {
        fetchTitles();
    }

    // Fetch subjects
    async function fetchSubjects() {
        const subjectList = document.getElementById("subject-list");
        subjectList.innerHTML = ""; // Clear old content
        const titleId = sessionStorage.getItem("selectedTitleId");

        const response = await fetch(`https://lablsi1.upct.es:8080/apirest/titulo/${titleId}/asignaturas`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        const table = document.createElement("table");
        table.classList.add("table", "table-striped");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = ["Subject", "Course", "ECTS", "ID Subject", "ID Title", "Typology"];
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        data.asignaturas.forEach(subject => {
            const row = document.createElement("tr");

            const cells = [
                subject.asignatura,
                subject.curso,
                subject.ects,
                subject.id_asignatura,
                subject.id_titulo,
                subject.tipologia
            ];

            cells.forEach(cellText => {
                const td = document.createElement("td");
                td.textContent = cellText;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        subjectList.appendChild(table);
    }

    if (subjectList) {
        fetchSubjects();
    }

    // Create Title
    const createTitleForm = document.getElementById("create-title-form");
    if (createTitleForm) {
        createTitleForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id_titulo = document.getElementById("id_titulo").value;
            const name = document.getElementById("name").value;
            const level = document.getElementById("level").value;
            const acronimo_centro = document.getElementById("acronimo_centro").value;
            const center = document.getElementById("center").value;

            const data = {
                id_titulo,
                denominacion: name,
                nivel: level,
                acronimo_centro,
                centro: center
            };

            try {
                const response = await fetch("https://lablsi1.upct.es:8080/apirest/titulo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById("form-success").textContent = "Title added to the title catalog";
                    document.getElementById("form-error").textContent = "";
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('createTitleModal'));
                        modal.hide();
                        fetchTitles();
                    }, 1000);
                } else {
                    const errorData = await response.json();
                    document.getElementById("form-error").textContent = errorData.message || "Failed to add title.";
                    document.getElementById("form-success").textContent = "";
                }
            } catch (error) {
                document.getElementById("form-error").textContent = "Error connecting to server.";
            }
        });
    }

    // Create Subject
    const createSubjectForm = document.getElementById("create-subject-form");
    if (createSubjectForm) {
        createSubjectForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id_asignatura = document.getElementById("id_asignatura").value;
            const subject = document.getElementById("subject").value;
            const course = document.getElementById("course").value;
            const typology = document.getElementById("typology").value;
            const ects = document.getElementById("ects").value;

            const idTitulo = sessionStorage.getItem("selectedTitleId");

            const data = {
                id_asignatura,
                asignatura: subject,
                curso: course,
                tipologia: typology,
                ects: ects,
                id_titulo: idTitulo
            };

            try {
                const response = await fetch(`https://lablsi1.upct.es:8080/apirest/titulo/${idTitulo}/asignatura`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById("subject-form-success").textContent = "Subject added to the subject catalog of the title";
                    document.getElementById("subject-form-error").textContent = "";
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('createSubjectModal'));
                        modal.hide();
                        fetchSubjects();
                    }, 1000);
                } else {
                    const errorData = await response.json();
                    document.getElementById("subject-form-error").textContent = errorData.message || "Failed to add subject.";
                    document.getElementById("subject-form-success").textContent = "";
                }
            } catch (error) {
                document.getElementById("subject-form-error").textContent = "Error connecting to server.";
            }
        });
    }

    document.getElementById("logout")?.addEventListener("click", function () {
        sessionStorage.clear();
        fetch("https://lablsi1.upct.es:8080/apirest/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        window.location.href = "index.html";
    });

    document.getElementById("back")?.addEventListener("click", function () {
        window.location.href = "titulos.html";
    });
});

//animations login
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Shape {
    constructor(x, y, radius, dx, dy, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.type = type; // "circle" sau "triangle"
    }

    draw() {
        ctx.beginPath();
        if (this.type === "circle") {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        } else {
            ctx.moveTo(this.x, this.y - this.radius);
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            ctx.closePath();
        }
        ctx.strokeStyle = 'rgba(5, 47, 7, 0.7)';
        ctx.stroke();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

const shapes = [];

for (let i = 0; i < 50; i++) {
    let radius = Math.random() * 20 + 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 1;
    let dy = (Math.random() - 0.5) * 1;
    let type = Math.random() > 0.5 ? "circle" : "triangle";
    shapes.push(new Shape(x, y, radius, dx, dy, type));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        shape.update();
    });
}

animate();
