
// JavaScript code for managing patient data with pagination and AJAX
// This script handles loading patient data, rendering it in a table with pagination,
$(document).ready(function () {
    loadPatients();
});

// Global variables to store patient data and pagination state
// Store all patient data in memory for pagination
let allPatients = [];
// Pagination state
let currentPage = 1;
// Number of records per page
const pageSize = 5;
// Assuming userRole is set globally, e.g., from a Razor view


// Load patient data from the server using AJAX
function loadPatients() {
    // Make an AJAX GET request to fetch patient data
    $.ajax({
        url: '/Patient/GetPatients',
        type: 'GET',
        // On success, store the data and render the first page
        success: function (data) {
            // Store the fetched patient data in the global variable
            allPatients = data;
            // Reset to the first page and render the table and pagination controls
            currentPage = 1;
            // Render the patient data for the current page
            renderPage();
            // Render the pagination controls based on the total number of patients
            renderPagination();
        },
        // On error, display an alert to the user
        error: function () {
            alert('Failed to load patient data');
        }
    });
}

// Render the patient data for the current page in the table
function renderPage() {
    // Get the table body element and clear any existing rows
    let tbody = $("#patientTableBody");
    // Clear existing table rows before rendering new data
    tbody.empty();
    // Calculate the start and end indices for slicing the patient data based on the current page and page size
    let start = (currentPage - 1) * pageSize;
    // Calculate the end index for slicing the patient data
    let end = start + pageSize;
    // Slice the patient data array to get only the records for the current page
    let pageData = allPatients.slice(start, end);
    // If there are no records for the current page, display a message in the table
    if (pageData.length === 0) {
        // If no data is available, show a message in the table
        tbody.append(`
            <tr>
                <td colspan="10" class="text-danger fw-bold">
                    No patient data available
                </td>
            </tr>
        `);
        
        return;
    }
    // Initialize a counter for the serial number column, starting from the correct number based on the current page
    let count = start + 1;
    // Iterate over the patient data for the current page and append rows to the table body
    $.each(pageData, function (index, patient) {
        // Append a new row to the table body with patient details and action buttons
        // Action buttons for editing and deleting the patient record
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

// Render pagination controls based on the total number of patients and the current page
// This function calculates the total number of pages and dynamically generates pagination controls
function renderPagination() {
    // Calculate the total number of pages based on the total number of patients and the page size
    let totalPages = Math.ceil(allPatients.length / pageSize);
    // Get the pagination container element and clear any existing pagination controls
    let pagination = $("#pagination");
    // Clear existing pagination controls before rendering new ones
    pagination.empty();

    // Previous
    // Append a "Prev" button to the pagination controls, disabling it if the current page is the first page
    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Prev</a>
        </li>
    `);

    // Page numbers
    // Loop through the total number of pages and append a page number button for each page, highlighting the current page
    for (let i = 1; i <= totalPages; i++) {
        // Append a page number button to the pagination controls, adding an "active" class to the current page
        pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `);
    }

    // Next
    // Append a "Next" button to the pagination controls, disabling it if the current page is the last page
    pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `);
}

// Handle page change when a pagination button is clicked
function changePage(page) {
    // Calculate the total number of pages to validate the requested page number
    let totalPages = Math.ceil(allPatients.length / pageSize);
    // Validate the requested page number to ensure it is within the valid range
    if (page < 1 || page > totalPages) return;
    // Update the current page and re-render the patient data and pagination controls
    currentPage = page;
    // Render the patient data for the new current page
    renderPage();
    // Re-render the pagination controls to reflect the new current page
    renderPagination();
}

// Utility function to format date in a readable format (e.g., "dd/mm/yyyy")
function formatDate(date) {
    // Check if the date is valid before formatting
    if (!date) return '';
    // Use toLocaleDateString to format the date in "en-GB" locale for "dd/mm/yyyy" format
    return new Date(date).toLocaleDateString('en-GB');
}
// Handle patient deletion with confirmation and AJAX request
function deletePatient(id) {
    // Check user role before allowing deletion
    // Redirect to AccessDenied if NOT Admin
    if (userRole !== "Admin") {
        window.location.href = '/User_Authentication/AccessDenied';
        return;
    }
    // SweetAlert confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: 'This patient record will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {

        // If user cancels, stop here
        if (!result.isConfirmed) return;

        // Make an AJAX POST request to delete the patient record on the server
        $.ajax({
            url: '/Admin/DeletePatient',
            type: 'POST',
            data: { id: id },
            // On success, check the response and refresh the patient data if deletion was successful, or show an alert with the error message
            success: function (res) {
                if (res.success) {

                    //SUCCESS SweetAlert
                    Swal.fire({
                        title: "Deleted!",
                        text: "Patient record deleted successfully.",
                        icon: "success",
                        draggable: true,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    loadPatients(); // refresh table
                } else {
                    alert(res.message);
                }
            },
            // On error, display an alert indicating that the deletion failed, and redirect to AccessDenied if the error status is 403 (Forbidden)
            error: function (xhr) {
                alert('Delete failed');
                if (xhr.status === 403) {
                    window.location.href = '/User_Authentication/AccessDenied';
                }
            }
        });
    });
}
