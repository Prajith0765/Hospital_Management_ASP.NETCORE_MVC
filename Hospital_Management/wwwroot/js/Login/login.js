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

// Function to send login data
//function SaveLogin() {

//    var loginData = Getter();

//    $.ajax({
//        url: '/User_Authentication/Login',
//        type: 'POST',
//        //Sending data as JSON Object
//        data: JSON.stringify(loginData),
//        //Specifying content type as JSON for proper parsing on server side
//        contentType: 'application/json; charset=utf-8',
//        success: function (response) {
//            if (response.success) {
//                window.location.href = '/Home/Index';
//            } else {
//                alert('Login failed: ' + response.message);
//            }
//        },
//        error: function (xhr) {
//            $("#loginError").text(xhr.responseText || "Invalid username or password");
//        }

//    });
//}


function SaveLogin() {

    var loginData = Getter();

    $.ajax({
        url: '/User_Authentication/Login',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(loginData),

        success: function (response) {
            // Cookie already created on server
            window.location.href = '/Home/Index';
        },

        error: function (xhr) {
            let msg = "Invalid username or password";

            if (xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }

            $("#loginError")
                .text(msg)
                .css("color", "red")
                .show();
        }
    });
}
