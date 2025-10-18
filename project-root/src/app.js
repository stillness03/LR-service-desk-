// --- Global state ---
let requests = [];
let filteredRequests = [];
let categories = new Set();
let editingId = null;

// ---------- DOM elements ----------
const form = document.getElementById('serviceForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const searchInput = document.querySelector('.hero-search input');
const categoryContainer = document.querySelector('.categories');

// --- Local Storage Key ---
const STORAGE_KEY = 'service_requests';

// --- Create container for list dynamically ---
const listContainer = document.createElement('section');
listContainer.classList.add('requests-list');
listContainer.innerHTML = `
  <h2>My request</h2>
  <div id="requestsContainer" class="requests-container"></div>
`;
document.querySelector('main').appendChild(listContainer);
const requestsContainer = document.getElementById('requestsContainer');

// --- Load requests ---
async function loadRequests() {
    try {
        const response = await fetch('../assets/data.json');
        const data = await response.json();
        requests = data.requests || [];
        saveTolocal(); 
    } catch (error) {
        const local = localStorage.getItem(STORAGE_KEY);
        requests = local ? JSON.parse(local) : [];
    }
    renderRequests();
}

// --- Save state to LocalStorage ---
function saveTolocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}


// --- Render requests to the DOM ---
function renderRequests(filtered = null) {
    const list = filtered || requests;
    requestsContainer.innerHTML = '';
    
    if (list.length === 0) {
    requestsContainer.innerHTML = '<p class="no-requests">Немає створених запитів.</p>';
    return;
    }

    list.forEach((req) => {
        const card = document.createElement('div');
        card.classList.add('request-card');
        card.innerHTML = `
            <div class="request-header">
                <h3>${req.category}</h3>
                <small>${new Date(req.created).toLocaleDateString()}</small>
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

    document.querySelectorAll('.edit-btn').forEach((btn) =>
        btn.addEventListener('click', () => editRequest(btn.dataset.id))
    );

    document.querySelectorAll('.delete-btn').forEach((btn) =>
        btn.addEventListener('click', () => deleteRequest(btn.dataset.id))
    );
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- Validate fields ---
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        alert('Nmae must be at least 3 characters long.');
        nameInput.focus();
        return;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    if (!categorySelect.value) {
        alert('Please select a category.');
        categorySelect.focus();
        return;
    }

    if (!descriptionInput.value.trim()) {
        alert('Description cannot be empty.');
        descriptionInput.focus();
        return;
    }


    // --- Create or update request ---
    const newRequest = {
        id: editingId || Date.now().toString(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        category: categorySelect.value,
        description: descriptionInput.value.trim(),
        created: new Date().toISOString(),
    };

    if (editingId) {
        const index = requests.findIndex(r => r.id === editingId);
        requests[index] = newRequest;
        alert('Request updated successfully!');
        editingId = null;
    } else {
        requests.push(newRequest);
        alert('Request submitted successfully!');
    }

    saveTolocal();
    renderRequests();
    form.reset();
});

// --- Email validation ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


// --- Search functionality ---
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = requests.filter((r) =>
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
    renderRequests(filtered);
});

// --- Filter by category when clicking category icons ---
categoryContainer.addEventListener('click', (e) => {
    const category = e.target.closest('.category');
    if (category) return; {
        const title = category.querySelector('h3').textContent;
        if (!title) return;

        const filtered = requests.filter((r) => r.category === title);
        renderRequests(filtered);
        alert(`Filtered by category: ${title}`);
    }
});

// --- Edit mode (example: triggered by console for demo) ---
function editRequest(id) {
    const req = requests.find((r) => r.id === id);
    if (!req) return alert('Request not found.');

    nameInput.value = req.name;
    emailInput.value = req.email;
    categorySelect.value = req.category;
    descriptionInput.value = req.description;

    editingId = id;
    window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
    alert('Edit mode activated. Make changes and submit the form.');
}

// --- Delete request  ---
function deleteRequest(id) {
    requests = requests.filter((r) => r.id !== id);
    saveTolocal();
    renderRequests();
    alert('Request deleted successfully.');
}

// ---  Accessibility ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('show-focus');
  }
});

loadRequests();
