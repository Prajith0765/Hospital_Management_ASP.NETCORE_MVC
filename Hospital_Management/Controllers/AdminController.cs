using Hospital_Management.DAL;
using Hospital_Management.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hospital_Management.Controllers
{
    // This controller manages administrative functions related to patient details.
    // The [Authorize] attribute ensures that only authenticated users can access its actions.
    [Authorize]
    public class AdminController : Controller
    {
        // Dependency injection of the AppDbContext to access the database.
        private AppDbContext _dbContext;
        // Constructor to initialize the AppDbContext.
        public AdminController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }



        //public IActionResult Details()
        //{
        //    var patients = _dbContext.PatientDetails.ToList();
        //    return View(patients);
        //}

        // Get Patient Details

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



        //Get CreatePatient and Edit Patient Load Existing Data
        [HttpGet]
        public IActionResult CreatePatient(int? id)
        {
            // ADD NEW PATIENT
            if (id == null || id == 0)
            {
                // ADD
                // Return an empty PatientDetails model to the view for adding a new patient
                return View(new PatientDetails());
            }

            // EDIT
            // Fetch existing patient details from the database for editing
            var patient = _dbContext.PatientDetails
                                    .FirstOrDefault(p => p.PatientId == id);
            // If patient not found, return 404
            if (patient == null)
                return NotFound();
            // Return the existing patient details to the view for editing
            return View(patient);
        }

        //Post CreatePatient
        [HttpPost]
        public IActionResult CreatePatient([FromBody] PatientDetails patient)
        {
            try
            {
                // Validate the incoming patient data
                if (patient == null)
                {
                    //  Invalid data
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid patient data"
                    });
                }
                // Check if it's an ADD or EDIT operation
               
                if (patient.PatientId == 0)
                {
                    //  ADD
                    // Ensure the new patient is marked as not deleted
                    patient.IsDeleted = false;
                    // Add the new patient record to the database
                    _dbContext.PatientDetails.Add(patient);
                }
                else
                {
                    // EDIT
                    //Modify existing patient record
                    _dbContext.Entry(patient).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    
                }
                // Save changes to the database
                _dbContext.SaveChanges();
                // Return success response
                return Ok(new
                {
                    success = true
                });
            }
            catch (Exception ex)
            {
                // Handle exceptions and return a bad request response with error details
                return BadRequest(new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message,
                    stack = ex.InnerException?.StackTrace
                });
            }
        }
        //Delete Patient - Soft Delete
        [HttpPost]   
        public IActionResult DeletePatient(int id)
        {
            try
            {
                // Fetch the patient record to be deleted
                var patient = _dbContext.PatientDetails
                                        .FirstOrDefault(p => p.PatientId == id && !p.IsDeleted);
                // If patient not found, return 404
                if (patient == null)
                {
                    // Patient not found
                    return NotFound(new
                    {
                        success = false,
                        message = "Patient not found"
                    });
                }

                // SOFT DELETE
                patient.IsDeleted = true;
                // Update the patient record in the database
                _dbContext.SaveChanges();
                // Return success response
                return Ok(new
                {
                    success = true,
                    message = "Patient deleted successfully"
                });
            }
            catch (Exception ex)
            {
                // Handle exceptions and return a bad request response with error details
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }
}
