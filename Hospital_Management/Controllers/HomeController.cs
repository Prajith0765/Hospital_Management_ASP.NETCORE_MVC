using Hospital_Management.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Hospital_Management.Controllers
{
    // This controller manages the home page and related views for the hospital management system.
    [Authorize]
    public class HomeController : Controller
    {
        // This action method returns the index view for the home page.
        public IActionResult Index()
        {
            return View();
        }


        // This action method returns the privacy view for the home page.
        // The privacy view typically contains information about the privacy policy of the hospital management system.
        public IActionResult Error()
        {
            // This action method returns the error view when an error occurs in the application.
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
