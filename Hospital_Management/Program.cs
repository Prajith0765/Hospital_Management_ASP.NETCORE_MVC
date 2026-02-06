using Hospital_Management.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
// The Program class is the entry point of the ASP.NET Core application.
// It configures services and the HTTP request pipeline.
// The WebApplication.CreateBuilder method initializes a new instance of the WebApplicationBuilder class,
// which is used to configure the application.
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
//  Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options => 
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//  AUTHENTICATION (COOKIE)
//  Add authentication services to the container and configure cookie-based authentication.
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        //  Configure cookie settings
        //  Redirect to login page on unauthorized access
        options.LoginPath = "/User_Authentication/Login";
        //  Redirect to logout page on sign out
        options.LogoutPath = "/User_Authentication/Logout";
        //  Redirect to Access Denied page if access is denied
        options.AccessDeniedPath = "/User_Authentication/AccessDenied";
        //  Set cookie expiration time and sliding expiration
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        //  Enable sliding expiration to refresh the cookie on each request
        options.SlidingExpiration = true;
        //  Set cookie name and other properties as needed
        options.Cookie.Name = "HospitalAuth";
        //  Set HttpOnly to true to prevent client-side scripts from accessing the cookie
        options.Cookie.HttpOnly = true;
    });

//  AUTHORIZATION
//  Add authorization services to the container.
//  This allows you to use the [Authorize] attribute in your controllers and actions to restrict access based on user roles or policies.
builder.Services.AddAuthorization();

//  Build the application.
var app = builder.Build();

// Configure the HTTP request pipeline.
//  If the application is not in development mode,
//  use the exception handler and HSTS middleware for better error handling and security.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
//  Redirect HTTP requests to HTTPS for secure communication.
app.UseHttpsRedirection();
//Routing middleware is responsible for matching incoming HTTP requests to the appropriate route handlers (controllers and actions) based on the URL and HTTP method.
//It processes the request and determines which controller action should handle it.
app.UseRouting();

//app.UseAuthorization();
//  Serve static files (like CSS, JavaScript, images) from the wwwroot folder.
app.MapStaticAssets();
//  Enable Authentication
app.UseAuthentication();

//  Enable Authorization
app.UseAuthorization();
//  Define the default route for the application.
//  This route pattern specifies that if no controller or action is specified in the URL,
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=User_Authentication}/{action=Login}/{id?}")
    .WithStaticAssets();

//  Run the application.
app.Run();
