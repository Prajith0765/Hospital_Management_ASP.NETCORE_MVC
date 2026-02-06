function InitPatient() {
    InitValidation();
    SavePatient();
}
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

function InitValidation() {
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
function SavePatient() {

    var patientData = Getter();

    // basic validation
    if (!patientData.DateOfBirth || !patientData.VisitDate) {
        alert("Date fields are required");
        return;
    }

    $.ajax({
        url: '/Admin/CreatePatient',
        type: 'POST',
        data: JSON.stringify(patientData),
        contentType: 'application/json; charset=utf-8',

        success: function (response) {
            if (response.success) {
                window.location.href = '/Admin/Details';
            } else {
                alert(response.message);
            }
        },

        error: function (xhr) {
            alert(xhr.responseText);
        }
    });
}
