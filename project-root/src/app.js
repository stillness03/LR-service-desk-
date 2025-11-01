// --- Global state ---
let requests = [];
let categories = [];
let editingId = null;

// ---------- DOM elements ----------
const form = document.getElementById('serviceForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const searchInput = document.querySelector('.hero-search input');
const categoryContainer = document.querySelector('.categories');

// --- Create container for list dynamically ---
const listContainer = document.createElement('section');
listContainer.classList.add('requests-list');
listContainer.innerHTML = `
  <h2>My requests</h2>
  <div id="requestsContainer" class="requests-container"></div>
`;
document.querySelector('main').appendChild(listContainer);
const requestsContainer = document.getElementById('requestsContainer');

// --- Backend API URLs ---
const API_URL = "http://localhost:8000/support-requests/";
const CATEGORY_URL = "http://localhost:8000/support-requests/categories/";

// --- Load categories from backend ---
async function loadCategories() {
    try {
        if (categories.length) return;

        const response = await fetch(CATEGORY_URL);
        if (!response.ok) throw new Error("Failed to fetch categories");

        categories = await response.json();

        categorySelect.innerHTML = '<option value="">Choose...</option>';
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.title;
            categorySelect.appendChild(option);
        });

        categorySelect.disabled = false;
    } catch (error) {
        console.error("Failed to load categories:", error);
        categorySelect.innerHTML = '<option value="">⚠️ Failed to load categories</option>';
        categorySelect.disabled = true;
    }
}

// --- Load requests from API ---
async function loadRequests() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch requests");
        requests = await response.json();
    } catch (error) {
        console.error(error);
        requests = [];
    }
    renderRequests();
}

// --- Render requests ---
function renderRequests(filtered = null) {
    const list = filtered || requests;
    requestsContainer.innerHTML = '';

    if (!list.length) {
        requestsContainer.innerHTML = '<p class="no-requests">No requests found.</p>';
        return;
    }

    list.forEach(req => {
        const card = document.createElement('div');
        card.classList.add('request-card');

        const categoryName = req.category?.title || categories.find(c => c.id === req.category_id)?.title || "Unknown";

        card.innerHTML = `
            <div class="request-header">
                <h3>${categoryName}</h3>
                <small>${new Date(req.created_at || req.created).toLocaleDateString()}</small>
            </div>
            <p><strong>Name:</strong> ${req.name}</p>
            <p><strong>Email:</strong> ${req.email}</p>
            <p><strong>Description:</strong> ${req.description}</p>
            <div class="request-actions">
                <button class="edit-btn" data-id="${req.id}">Edit</button>
                <button class="delete-btn" data-id="${req.id}">Delete</button>
            </div>
        `;
        requestsContainer.appendChild(card);
    });

    document.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => editRequest(btn.dataset.id))
    );

    document.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', () => deleteRequest(btn.dataset.id))
    );
}

// --- Submit form ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        alert('Name must be at least 3 characters');
        nameInput.focus();
        return;
    }
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        alert('Enter a valid email');
        emailInput.focus();
        return;
    }
    if (!categorySelect.value) {
        alert('Select a category');
        categorySelect.focus();
        return;
    }
    if (!descriptionInput.value.trim()) {
        alert('Description cannot be empty');
        descriptionInput.focus();
        return;
    }

    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        category_id: parseInt(categorySelect.value),
        description: descriptionInput.value.trim(),
    };

    try {
        let response;
        if (editingId) {
            response = await fetch(`${API_URL}${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            editingId = null;
            alert("Request updated successfully");
        } else {
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            alert("Request created successfully");
        }
        if (!response.ok) throw new Error("API error");
        await loadRequests();
        form.reset();
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Check console.");
    }
});

// --- Email validation ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// --- Search requests ---
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = requests.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
    renderRequests(filtered);
});

// --- Edit request ---
function editRequest(id) {
    const req = requests.find(r => r.id == id);
    if (!req) return alert("Request not found");

    nameInput.value = req.name;
    emailInput.value = req.email;
    categorySelect.value = req.category?.id || req.category_id;
    descriptionInput.value = req.description;

    editingId = id;
    window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
    alert('Edit mode activated. Submit to save changes.');
}

// --- Delete request ---
async function deleteRequest(id) {
    try {
        const response = await fetch(`${API_URL}${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete failed");
        alert("Request deleted successfully");
        await loadRequests();
    } catch (error) {
        console.error(error);
        alert("Delete failed. Check console.");
    }
}

// --- Init ---
(async function init() {
    await loadCategories();
    await loadRequests();
})();
