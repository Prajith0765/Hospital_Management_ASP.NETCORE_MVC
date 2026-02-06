using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hospital_Management.Models
{
    public class PatientDetails
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int PatientId { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public DateTime? DateOfBirth { get; set; }
        [Required]
        public string? Gender { get; set; }

        [Required]
        public string? Nationality { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public string? City { get; set; }
        [Phone]
        [Required]
        public string? PhoneNumber { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? bloodGroup { get; set; }
        public string? Allergies { get; set; }
        [Required]
        public string? ExistingConditions { get; set; }
        [Required]
        public DateTime? VisitDate { get; set; }
        public bool IsDeleted { get; set; } = false;


    }
}
