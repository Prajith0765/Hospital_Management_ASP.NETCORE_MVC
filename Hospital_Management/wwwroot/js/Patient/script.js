// JavaScript code for patient form handling
// This script initializes form validation, handles form submission via AJAX, and manages form state
// Initialize the patient form when the document is ready
function InitPatient() {
    InitValidation();
    SavePatient();
}
// Reset the form fields to their default state
function CleanUp() {
    Setter({
        Name: "",
        DateofBirth: "",
        Gender: "",
        BloodGroup: "",
        PhoneNumber: "",
        Email: "",
        Address: "",
        City: "",
        Nationality: "",
        ExistingConditions: "",
        Allergies: "",
        VisitDate: ""
    });
}
// Collect form data into an object for submission
// The Getter function collects values from the form fields and returns an object representing the patient data
function Getter() {
    return {
        PatientId: $("#PatientId").val() || 0,
        Name: $("#Name").val(),
        DateOfBirth: $("#DateOfBirth").val(),
        Gender: $("#Gender").val(),
        bloodGroup: $("#bloodGroup").val(),
        PhoneNumber: $("#PhoneNumber").val(),
        Email: $("#Email").val(),
        Address: $("#Address").val(),
        City: $("#City").val(),
        Nationality: $("#Nationality").val(),
        ExistingConditions: $("#ExistingConditions").val(),
        Allergies: $("#Allergies").val(),
        VisitDate: $("#VisitDate").val()
    };
}

// Initialize form validation rules and messages using jQuery Validation plugin
function InitValidation() {
    // Set up validation rules and messages for the patient form using jQuery Validation plugin
    $("#patientForm").validate({
        rules: {
            Name: {
                required: true,
                minlength: 3
            },
            DateOfBirth: {
                required: true
            },
            Gender: {
                required: true
            },
            bloodGroup: {
                required: true
            },
            PhoneNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            Email: {
                required: true,
                email: true
            },
            VisitDate: {
                required: true
            }
        },
        messages: {
            Name: "Enter patient name",
            PhoneNumber: "Enter valid 10-digit phone number"
        },
        errorClass: "text-danger",
        errorElement: "small"
    });
}

// Populate form fields with data for editing an existing patient record
// The Setter function takes a patient data object and populates the form fields with the corresponding values for editing
function Setter(data) {
    $("#Name").val(data.Name);
    $("#DateOfBirth").val(data.DateofBirth);
    $("#Gender").val(data.Gender);
    $("#bloodGroup").val(data.BloodGroup);
    $("#PhoneNumber").val(data.PhoneNumber);
    $("#Email").val(data.Email);
    $("#Address").val(data.Address);
    $("#City").val(data.City);
    $("#Nationality").val(data.Nationality);
    $("#ExistingConditions").val(data.ExistingConditions);
    $("#Allergies").val(data.Allergies);
    $("#VisitDate").val(data.VisitDate);
}

// Handle form submission to save patient data via AJAX
// The SavePatient function collects form data, performs basic validation, and sends an AJAX POST request to save the patient data on the server

function SavePatient() {
    // Collect form data into an object using the Getter function
    var patientData = Getter();

    //Ajax call to save patient data to the server
    //Post the patient data to the server using AJAX and handle the response to provide feedback to the user
    $.ajax({
        url: '/Admin/CreatePatient',
        type: 'POST',
        data: patientData,
        // On success, check the response and redirect or show an alert based on the success status
        success: function (response) {
            if (response.success) {
                window.location.href = '/Patient/Details';
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: response.message
                });
            }
        },
        // On error, display an alert with the error message from the server response
        error: function (xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: xhr.responseText
            });
        }
    });
}
