/**
 * Calculates a match score between a job's requirements and a user's profile
 * @param {Object} job - The job posting with required skills and other criteria
 * @param {Object} userProfile - The user's profile with skills and other attributes
 * @returns {Number} - A match score between 0-100
 */
export const calculateMatchScore = (job, userProfile) => {
  // If either input is missing, return a default low score
  if (!job || !userProfile) return 30;
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Skills match (highest weight - 50%)
  if (job.skills && userProfile.skills) {
    const skillsWeight = 50;
    maxPossibleScore += skillsWeight;
    
    // Count matching skills
    const matchingSkills = job.skills.filter(skill => 
      userProfile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    // Calculate percentage of matching skills
    const skillMatchPercentage = job.skills.length > 0 
      ? (matchingSkills.length / job.skills.length) 
      : 0;
      
    totalScore += skillMatchPercentage * skillsWeight;
  }
  
  // Department/Field match (20%)
  if (job.department && userProfile.department) {
    const departmentWeight = 20;
    maxPossibleScore += departmentWeight;
    
    if (job.department.toLowerCase() === userProfile.department.toLowerCase()) {
      totalScore += departmentWeight;
    }
  }
  
  // Experience level match (15%)
  if (job.experienceLevel && userProfile.experienceLevel) {
    const experienceWeight = 15;
    maxPossibleScore += experienceWeight;
    
    // Simple matching for now
    if (job.experienceLevel === userProfile.experienceLevel) {
      totalScore += experienceWeight;
    } else {
      // Partial match for adjacent experience levels
      const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const jobIndex = levels.indexOf(job.experienceLevel);
      const userIndex = levels.indexOf(userProfile.experienceLevel);
      
      if (jobIndex !== -1 && userIndex !== -1) {
        const distance = Math.abs(jobIndex - userIndex);
        if (distance === 1) {
          // Adjacent level - partial match
          totalScore += experienceWeight * 0.5;
        }
      }
    }
  }
  
  // Interest match (15%)
  if (job.type && userProfile.interests) {
    const interestWeight = 15;
    maxPossibleScore += interestWeight;
    
    const matchingInterests = userProfile.interests.filter(interest =>
      job.type.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(job.type.toLowerCase())
    );
    
    if (matchingInterests.length > 0) {
      totalScore += interestWeight;
    }
  }
  
  // Calculate final percentage
  const finalScore = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 50; // Default to 50% if no criteria available
  
  // Ensure score is between 30-100 (even poor matches get 30%)
  return Math.max(30, Math.min(100, finalScore));
};

/**
 * Generates a mock user profile for testing match scores
 * @returns {Object} - A mock user profile
 */
export const generateMockUserProfile = () => {
  return {
    id: "user123",
    name: "Student User",
    department: "Computer Science",
    skills: ["React", "JavaScript", "UI Design", "Node.js", "Python"],
    experienceLevel: "intermediate",
    interests: ["Academic Project", "Hackathon", "Startup"],
    education: "B.Tech Computer Science"
  };
};