using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management.DAL;
using Microsoft.AspNetCore.Authorization;

namespace Hospital_Management.Controllers
{
    [Authorize (Roles = "Admin,Doctor")] // Only users with Admin, Doctor, or Nurse roles can access this controller
    public class PatientController : Controller
    {
        private AppDbContext _dbContext;
        public PatientController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }



        [HttpGet]
        public IActionResult Details()
        {
            return View();
        }

        //Get Patient List

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
                    .ToList();
                // Return the patient list as JSON
                return Json(patients);
            }
            catch (Exception ex)
            {
                // Handle exceptions and return a bad request response
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}
