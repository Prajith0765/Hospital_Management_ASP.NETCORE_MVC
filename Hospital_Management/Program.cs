using Hospital_Management.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
//  Configure Entity Framework Core with SQL Server
builder.Services.AddDbContext<AppDbContext>(options => 
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//  AUTHENTICATION (COOKIE)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        //  Configure cookie settings
        //  Redirect to login page on unauthorized access
        options.LoginPath = "/User_Authentication/Login";
        //  Redirect to logout page on sign out
        options.LogoutPath = "/User_Authentication/Logout";
        //  Redirect to login page if access is denied
        options.AccessDeniedPath = "/User_Authentication/Login";
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
builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

//app.UseAuthorization();

app.MapStaticAssets();
//  Enable Authentication
app.UseAuthentication();

//  Enable Authorization
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=User_Authentication}/{action=Login}/{id?}")
    .WithStaticAssets();


app.Run();
