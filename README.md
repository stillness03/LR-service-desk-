# LR-service-desk-
# 📘 Adaptive Web Interface (HTML + CSS + JavaScript)

## 🎯 Goal of the Work
The goal of this project is to **consolidate knowledge of adaptive interface development using pure HTML, CSS, and JavaScript (without frameworks)**.

You will:
- Develop an **interactive adaptive interface**.
- Implement **JavaScript interactivity**: events, validation, dynamic DOM manipulation, working with `fetch()` and `localStorage`.
- Prepare a **project structure** that can be easily connected to a REST API in future labs.

---

## 🧠 Required Knowledge
To successfully complete this project, you should be proficient in:

1. **HTML5** — semantic tags, forms, labels.
2. **CSS3** — Flexbox, Grid, media queries, responsive design.
3. **JavaScript (ES6+)** — modules, events, async/await, fetch API.

---

## 🧩 Task Description
Create a **small one-page** or **mini-SPA** application **without frameworks** (pure HTML/CSS/JS) that meets the following requirements:

### 🏗 HTML
- Use **semantic tags** (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`).
- Use **proper labels** for all form elements.

### 🎨 CSS
- Layout implemented using **Flexbox** or **Grid**.
- Include **responsive media queries** for different screen sizes.
- Define **CSS variables** for colors and consistent styling.
- Ensure visible **`:focus`** states for interactive elements.

### ⚙️ JavaScript Functionality
- Implement **forms** for creating and editing data with **client-side validation**.
- Provide **client-side filtering and searching**.
- Load initial data from `/public/data.json` using `fetch()` (HTTP GET).
- Support **responsive design and interactivity**.
- Ensure **basic accessibility** (labels, focus states, error messages).

---

## 🗂 Project Structure
```bash
/project-root
│
├── /public
│   ├── index.html
│   ├── styles.css
│   └── /assets
│       └── data.json    # initial data
│
└── /src
    └── app.js
```

## My option: 14

Service desk manager. Fields: title, requester, priority, status (open/in progress/done), createdAt. Queue with sorting; status change; filters.

## How to Run the Project
1. Clone the project:
    ```bash
       git clone https://github.com/username/project.git
    ```
2. Open the terminal in the folder:
    ```bash
    cd project-root
    ```
3. Start the local server:
    ```bash
    python -m http.server 8000
    ```
4. Open your browser and go to:
    http://localhost:8000/public/index.html
    
