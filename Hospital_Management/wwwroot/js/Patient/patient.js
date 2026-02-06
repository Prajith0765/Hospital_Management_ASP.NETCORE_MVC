$(document).ready(function () {
    loadPatients();
});

let allPatients = [];
let currentPage = 1;
const pageSize = 5;


function loadPatients() {
    $.ajax({
        url: '/Admin/GetPatients',
        type: 'GET',
        success: function (data) {
            allPatients = data;
            currentPage = 1;
            renderPage();
            renderPagination();
        },
        error: function () {
            alert('Failed to load patient data');
        }
    });
}


function renderPage() {
    let tbody = $("#patientTableBody");
    tbody.empty();

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = allPatients.slice(start, end);

    if (pageData.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="10" class="text-danger fw-bold">
                    No patient data available
                </td>
            </tr>
        `);
        return;
    }

    let count = start + 1;

    $.each(pageData, function (index, patient) {
        tbody.append(`
            <tr>
                <td>${count++}</td>
                <td>${patient.patientId}</td>
                <td>${patient.name}</td>
                <td>${formatDate(patient.dateOfBirth)}</td>
                <td>${patient.gender}</td>
                <td>${patient.nationality}</td>
                <td>${patient.city}</td>
                <td>${patient.phoneNumber}</td>
                <td>${patient.bloodGroup}</td>
                <td>${formatDate(patient.visitDate)}</td>
                <td>
                    <a href="/Admin/CreatePatient/${patient.patientId}"
                       class="btn btn-sm btn-warning me-1">Edit</a>

                       <button type="button"
                        class="btn btn-sm btn-danger me-1"
                        onclick="deletePatient(${patient.patientId})">
                        Delete
                        </button>
                </td>
            </tr>
        `);
    });
}


function renderPagination() {
    let totalPages = Math.ceil(allPatients.length / pageSize);
    let pagination = $("#pagination");
    pagination.empty();

    // Previous
    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Prev</a>
        </li>
    `);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `);
    }

    // Next
    pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `);
}


function changePage(page) {
    let totalPages = Math.ceil(allPatients.length / pageSize);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderPage();
    renderPagination();
}


function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
}


function deletePatient(id) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    $.ajax({
        url: '/Admin/DeletePatient',
        type: 'POST',
        data: { id: id },
        success: function (res) {
            if (res.success) {
                loadPatients(); // refresh table
            } else {
                alert(res.message);
            }
        },
        error: function () {
            alert('Delete failed');
        }
    });
}
