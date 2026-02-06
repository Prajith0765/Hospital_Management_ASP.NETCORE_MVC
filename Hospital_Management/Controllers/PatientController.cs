using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management.DAL;
using Microsoft.AspNetCore.Authorization;

namespace Hospital_Management.Controllers
{
    [Authorize (Roles = "Admin,Doctor")] // Only users with Admin, Doctor, or Nurse roles can access this controller
    // This controller manages patient-related actions in the hospital management system.
    public class PatientController : Controller
    {
        // The AppDbContext is used to interact with the database for patient-related operations.
        private AppDbContext _dbContext;
        // Constructor to initialize the AppDbContext through dependency injection.
        public PatientController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: Patient/Details
        // This action method returns the details view for patients.

        [HttpGet]
        public IActionResult Details()
        {
            return View();
        }

        //Get Patient List
        // This action method retrieves a list of non-deleted patients from the database and returns it as JSON.

        [HttpGet]
        public IActionResult GetPatients()
        {
            // Fetch non-deleted patient records from the database
            try
            {
                // LINQ query to select specific fields from non-deleted patients
                var patients = _dbContext.PatientDetails
                    .Where(p => !p.IsDeleted)
                    .Select(p => new
                    {
                        p.PatientId,
                        p.Name,
                        p.DateOfBirth,
                        p.Gender,
                        p.Nationality,
                        p.City,
                        p.PhoneNumber,
                        p.bloodGroup,
                        p.VisitDate
                    })
                    .ToList();  // Convert the result to a list

                // Return the patient list as JSON
                return Json(patients);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return a bad request response
                return BadRequest(new
                {
                    // Indicate that the operation was unsuccessful and include the error message
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
