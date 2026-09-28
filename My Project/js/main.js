



const STORAGE_KEY = "contactHub_contacts";


const AVATAR_COLORS = ["bg-danger", "bg-primary", "bg-success", "bg-warning", "bg-info", "bg-secondary", "bg-dark"];


let editingContactId = null;




function getContacts() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
        return JSON.parse(stored);
    }


    const seedContacts = [
        {
            id: 1,
            name: "Alyssa Larsen",
            phone: "01050079305",
            email: "hevufohejy@mailinator.com",
            address: "Possimus veniam co",
            group: "other",
            notes: "",
            isFavorite: false,
            isEmergency: false,
            avatarColor: "bg-danger"
        },
        {
            id: 2,
            name: "Uta Salas",
            phone: "01050079307",
            email: "damuluvuca@mailinator.com",
            address: "Architecto omnis qui",
            group: "family",
            notes: "",
            isFavorite: true,
            isEmergency: true,
            avatarColor: "bg-primary"
        }
    ];

    saveContacts(seedContacts);
    return seedContacts;
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}





function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
}


function getNextId(contacts) {
    if (contacts.length === 0) return 1;
    return Math.max(...contacts.map(c => c.id)) + 1;
}





function buildContactCardHTML(contact) {

    const avatarClasses = [
        "contact-avatar",
        contact.avatarColor,
        contact.isFavorite ? "favorite" : "",
        contact.isEmergency ? "emergency" : ""
    ].filter(Boolean).join(" ");

    const groupTagHTML = contact.group
        ? `<span class="tag ${contact.group}">${contact.group.charAt(0).toUpperCase() + contact.group.slice(1)}</span>`
        : "";

    const emergencyTagHTML = contact.isEmergency
        ? `<span class="tag emergency"><i class="fas fa-heartbeat"></i> Emergency</span>`
        : "";

    const favoriteIconClass = contact.isFavorite ? "fas fa-star" : "far fa-star";
    const emergencyIconClass = contact.isEmergency ? "fas fa-heart" : "far fa-heart";

    return `
        <div class="col-md-6">
            <div class="contact-card">
                <div class="contact-header">
                    <div class="${avatarClasses}">${getInitials(contact.name)}</div>
                    <div class="contact-info">
                        <h4>${contact.name}</h4>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="contact-detail phone">
                        <i class="fas fa-phone"></i>
                        <span>${contact.phone}</span>
                    </div>
                    ${contact.email ? `
                    <div class="contact-detail email">
                        <i class="fas fa-envelope"></i>
                        <span>${contact.email}</span>
                    </div>` : ""}
                    ${contact.address ? `
                    <div class="contact-detail address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${contact.address}</span>
                    </div>` : ""}
                </div>
                <div class="contact-tags">
                    ${groupTagHTML}
                    ${emergencyTagHTML}
                </div>
                <div class="contact-actions">
                    <a class="contact-action call" title="Call" href="tel:${contact.phone}">
                        <i class="fas fa-phone"></i>
                    </a>
                    <a class="contact-action email" title="Email" href="mailto:${contact.email || ''}">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <button class="contact-action favorite ${contact.isFavorite ? 'active' : ''}" title="Favorite" data-action="favorite" data-id="${contact.id}">
                        <i class="${favoriteIconClass}"></i>
                    </button>
                    <button class="contact-action emergency ${contact.isEmergency ? 'active' : ''}" title="Emergency" data-action="emergency" data-id="${contact.id}">
                        <i class="${emergencyIconClass}"></i>
                    </button>
                    <button class="contact-action" title="Edit" data-action="edit" data-id="${contact.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="contact-action delete" title="Delete" data-action="delete" data-id="${contact.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}





function renderContacts(list) {
    const container = document.getElementById("rowData");

    if (list.length === 0) {
        container.innerHTML = `<p class="alert alert-danger text-center">No contacts found</p>`;
        return;
    }

    container.innerHTML = list.map(buildContactCardHTML).join("");
}


function renderFavoritesSidebar(allContacts) {
    const container = document.getElementById("favoritesList");
    const favorites = allContacts.filter(c => c.isFavorite);

    if (favorites.length === 0) {
        container.innerHTML = `<p class="text-muted small">No favorites yet</p>`;
        return;
    }

    container.innerHTML = favorites.map(contact => `
        <div class="sidebar-contact-card">
            <div class="sidebar-contact-avatar" style="background: #3b82f6">${getInitials(contact.name)}</div>
            <div class="sidebar-contact-info">
                <h5>${contact.name}</h5>
                <p>${contact.phone}</p>
            </div>
            <a class="sidebar-call-btn favorites-call" href="tel:${contact.phone}">
                <i class="fas fa-phone"></i>
            </a>
        </div>
    `).join("");
}


function renderEmergencySidebar(allContacts) {
    const container = document.getElementById("emergencyList");
    const emergencyContacts = allContacts.filter(c => c.isEmergency);

    if (emergencyContacts.length === 0) {
        container.innerHTML = `<p class="text-muted small">No emergency contacts yet</p>`;
        return;
    }

    container.innerHTML = emergencyContacts.map(contact => `
        <div class="sidebar-contact-card">
            <div class="sidebar-contact-avatar" style="background: #ef4444">${getInitials(contact.name)}</div>
            <div class="sidebar-contact-info">
                <h5>${contact.name}</h5>
                <p>${contact.phone}</p>
            </div>
            <a class="sidebar-call-btn favorites-call" href="tel:${contact.phone}">
                <i class="fas fa-phone"></i>
            </a>
        </div>
    `).join("");
}


function updateStats(allContacts) {
    document.getElementById("totalContacts").textContent = allContacts.length;
    document.getElementById("favoritesCount").textContent = allContacts.filter(c => c.isFavorite).length;
    document.getElementById("emergencyCount").textContent = allContacts.filter(c => c.isEmergency).length;
    document.getElementById("contactsCount").textContent = allContacts.length;
}


function renderAll() {
    const contacts = getContacts();
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();

    const visibleContacts = searchValue ? filterContacts(contacts, searchValue) : contacts;

    renderContacts(visibleContacts);
    renderFavoritesSidebar(contacts);
    renderEmergencySidebar(contacts);
    updateStats(contacts);
}





function filterContacts(contacts, query) {
    return contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(query))
    );
}





function resetForm() {
    document.getElementById("contactForm").reset();
    editingContactId = null;

    document.getElementById("saveContactBtn").classList.remove("d-none");
    document.getElementById("updateContactBtn").classList.add("d-none");
    document.getElementById("addContactModalLabel").textContent = "Add New Contact";
}


function fillFormForEdit(contact) {
    document.getElementById("fullName").value = contact.name;
    document.getElementById("phoneNumber").value = contact.phone;
    document.getElementById("emailAddress").value = contact.email || "";
    document.getElementById("address").value = contact.address || "";
    document.getElementById("group").value = contact.group || "";
    document.getElementById("notes").value = contact.notes || "";
    document.getElementById("isFavorite").checked = contact.isFavorite;
    document.getElementById("isEmergency").checked = contact.isEmergency;

    editingContactId = contact.id;

    document.getElementById("saveContactBtn").classList.add("d-none");
    document.getElementById("updateContactBtn").classList.remove("d-none");
    document.getElementById("addContactModalLabel").textContent = "Edit Contact";
}


function validateContactForm() {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("emailAddress").value.trim();

    if (name.length < 3) {
        return { valid: false, message: "Full name must be at least 3 characters" };
    }

    const phonePattern = /^[0-9+\-\s()]{7,15}$/;
    if (!phonePattern.test(phone)) {
        return { valid: false, message: "Please enter a valid phone number" };
    }

    if (email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return { valid: false, message: "Please enter a valid email address" };
        }
    }

    return { valid: true };
}


function readFormData() {
    return {
        name: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phoneNumber").value.trim(),
        email: document.getElementById("emailAddress").value.trim(),
        address: document.getElementById("address").value.trim(),
        group: document.getElementById("group").value,
        notes: document.getElementById("notes").value.trim(),
        isFavorite: document.getElementById("isFavorite").checked,
        isEmergency: document.getElementById("isEmergency").checked
    };
}


function closeAddContactModal() {
    const modalEl = document.getElementById("addContactModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
}





function handleSaveContact() {
    const validation = validateContactForm();
    if (!validation.valid) {
        Swal.fire({ icon: "warning", title: "Check your input", text: validation.message });
        return;
    }

    const contacts = getContacts();
    const formData = readFormData();

    const newContact = {
        id: getNextId(contacts),
        ...formData,
        avatarColor: AVATAR_COLORS[contacts.length % AVATAR_COLORS.length]
    };

    contacts.push(newContact);
    saveContacts(contacts);
    renderAll();
    closeAddContactModal();

    Swal.fire({ icon: "success", title: "Contact added!", timer: 1500, showConfirmButton: false });
}


function handleUpdateContact() {
    const validation = validateContactForm();
    if (!validation.valid) {
        Swal.fire({ icon: "warning", title: "Check your input", text: validation.message });
        return;
    }

    const contacts = getContacts();
    const index = contacts.findIndex(c => c.id === editingContactId);
    if (index === -1) return;

    const formData = readFormData();
    contacts[index] = { ...contacts[index], ...formData };

    saveContacts(contacts);
    renderAll();
    closeAddContactModal();

    Swal.fire({ icon: "success", title: "Contact updated!", timer: 1500, showConfirmButton: false });
}


function handleDeleteContact(id) {
    Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "Do you really want to delete this contact?",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#ef4444",
        cancelButtonText: "Cancel"
    }).then(result => {
        if (result.isConfirmed) {
            const contacts = getContacts().filter(c => c.id !== id);
            saveContacts(contacts);
            renderAll();
            Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
        }
    });
}


function toggleFavorite(id) {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    contact.isFavorite = !contact.isFavorite;
    saveContacts(contacts);
    renderAll();
}


function toggleEmergency(id) {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    contact.isEmergency = !contact.isEmergency;
    saveContacts(contacts);
    renderAll();
}


function startEditContact(id) {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    fillFormForEdit(contact);

    const modalEl = document.getElementById("addContactModal");
    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
}




document.addEventListener("DOMContentLoaded", () => {

    renderAll();


    document.getElementById("addContactBtn").addEventListener("click", resetForm);


    document.getElementById("addContactModal").addEventListener("hidden.bs.modal", resetForm);

    document.getElementById("saveContactBtn").addEventListener("click", handleSaveContact);
    document.getElementById("updateContactBtn").addEventListener("click", handleUpdateContact);


    document.getElementById("searchInput").addEventListener("input", renderAll);


    document.getElementById("rowData").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === "favorite") toggleFavorite(id);
        if (action === "emergency") toggleEmergency(id);
        if (action === "edit") startEditContact(id);
        if (action === "delete") handleDeleteContact(id);
    });

});