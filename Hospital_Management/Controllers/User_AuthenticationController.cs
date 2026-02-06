using Hospital_Management.DAL;
using Hospital_Management.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Hospital_Management.Controllers
{
    // This controller handles user authentication (login/logout) using cookie-based authentication.
    
    public class User_AuthenticationController : Controller
    {
        // Dependency injection of the AppDbContext to access the database for user authentication.
        private AppDbContext _dbContext;
        // Constructor to initialize the AppDbContext.
        public User_AuthenticationController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: /User_Authentication/Login
        // This action method returns the login view where users can enter their credentials.
        public IActionResult Login()
        {
            return View();
        }
        //Mapping the incoming JSON to Logins model by using
        //[FromBody] which is used to bind the request body to a model.


        // POST: /User_Authentication/Login
        // This action method processes the login request. It validates the user credentials against the database,
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Logins loginData)
        {
            // Validate incoming data
            if (loginData == null)
                return BadRequest(new { success = false, message = "Invalid data" });
            // Fetch user from DB
            var user = _dbContext.Logins
                .FirstOrDefault(u => u.Username == loginData.Username);
            // Validate credentials
            if (user == null || user.Password != loginData.Password)
                return Unauthorized(new { success = false, message = "Invalid credentials" });

            // CLAIMS (ROLE-BASED)
            // Claims are used to store user information (like username and role) in the authentication cookie.
            var claims = new List<Claim>
            {
                // Store the username and role in claims
                new Claim(ClaimTypes.Name, user.Username),
                // The role claim is used for role-based authorization. It indicates the user's role (e.g., Admin, Doctor, Patient).
                new Claim(ClaimTypes.Role, user.Role) // Admin / Doctor / Patient
            };
            // Create a ClaimsIdentity with the specified claims and authentication scheme (cookie-based).
            var identity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);
            // Create a ClaimsPrincipal from the ClaimsIdentity. The ClaimsPrincipal represents the authenticated user and their claims.
            var principal = new ClaimsPrincipal(identity);

            // CREATE COOKIE
            // Sign in the user by creating an authentication cookie.
            // This cookie will be sent to the client and used for subsequent requests to identify the user.
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal
            );
            // Login success
            return Ok(new
            {
                success = true,
                role = user.Role
            });
        }

        // GET: /User_Authentication/Logout
        // This action method logs out the user by clearing the authentication cookie.
        public async Task<IActionResult> Logout()
        {
            //Clears the authentication cookie
            // Sign out the user by removing the authentication cookie.
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            // Redirect to Login page
            return RedirectToAction("Login", "User_Authentication");
        }

        // GET: /User_Authentication/AccessDenied
        // This action method returns the Access Denied view when a user tries to access a resource they are not authorized for.
        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
