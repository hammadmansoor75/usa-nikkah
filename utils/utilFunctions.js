export function calculateAge(dobString) {
    // Parse the date of birth string
    const dob = new Date(dobString);
    
    // Get today's date
    const today = new Date();
    
    // Calculate the difference in years
    let age = today.getFullYear() - dob.getFullYear();
    
    // Adjust the age if the birthday hasn't occurred yet this year
    const isBirthdayPassed = (
        today.getMonth() > dob.getMonth() || 
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
    );

    if (!isBirthdayPassed) {
        age--;
    }
    
    return age;
}

