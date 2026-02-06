// Function to initialize login fields
function InitLogin() {
    SaveLogin();
    CleanUpLogin();
}

// Function to clear login fields
function CleanUpLogin() {

    Setter({
        Username: "",
        Password: "",
        
    });
}

// Setter function to set login data
function Setter(data) {
    $("#userName").val(data.Username);
    $("#password").val(data.Password);
}

// Getter function to retrieve login data
function Getter() {
    return {
        Username: $("#userName").val(),
        Password: $("#password").val()
    };
}


// Function to handle login form submission and send data to the server via AJAX
function SaveLogin() {
    // Collect login data from the form using the Getter function
    var loginData = Getter();
    // Send an AJAX POST request to the server with the login data in JSON format
    $.ajax({
        url: '/User_Authentication/Login',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(loginData),
        // On successful login, redirect the user to the home page
        success: function (response) {
            // Cookie already created on server
            window.location.href = '/Home/Index';
        },
        // On error, display an error message to the user
        error: function (xhr) {
            let msg = "Invalid username or password";

            if (xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }
            // Display the error message in the loginError element with red color
            $("#loginError")
                .text(msg)
                .css("color", "red")
                .show();
        }
    });
}
