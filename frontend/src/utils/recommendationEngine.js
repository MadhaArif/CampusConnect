/**
 * Advanced recommendation engine for CampusConnect
 * This implements a content-based filtering algorithm to recommend jobs to users
 * based on their skills, interests, and past interactions
 */

import { calculateMatchScore } from './matchScoreCalculator';

/**
 * Generates personalized job recommendations for a user
 * @param {Array} allJobs - All available jobs in the system
 * @param {Object} userProfile - The user's profile with skills and preferences
 * @param {Array} userInteractions - User's past interactions (views, applications, etc.)
 * @returns {Array} - Sorted array of recommended jobs with scores
 */
export const generateRecommendations = (allJobs, userProfile, userInteractions = []) => {
  if (!allJobs || !userProfile) return [];
  
  // Step 1: Calculate base match scores for all jobs
  const scoredJobs = allJobs.map(job => {
    const baseMatchScore = calculateMatchScore(job, userProfile);
    return { ...job, baseMatchScore };
  });
  
  // Step 2: Apply interaction boosting
  const boostedJobs = applyInteractionBoosting(scoredJobs, userInteractions);
  
  // Step 3: Apply collaborative filtering signals (simulated)
  const finalRecommendations = applyCollaborativeSignals(boostedJobs, userProfile);
  
  // Step 4: Sort by final score and return
  return finalRecommendations
    .sort((a, b) => b.finalScore - a.finalScore)
    .map(job => ({
      ...job,
      recommendationScore: job.finalScore,
      matchScore: job.baseMatchScore
    }));
};

/**
 * Boosts job scores based on user's past interactions
 * @param {Array} scoredJobs - Jobs with base match scores
 * @param {Array} interactions - User's past interactions
 * @returns {Array} - Jobs with boosted scores
 */
const applyInteractionBoosting = (scoredJobs, interactions) => {
  if (!interactions || interactions.length === 0) return scoredJobs;
  
  // Create a map of interaction types and their boost values
  const boostValues = {
    view: 2,        // User viewed the job
    bookmark: 5,     // User bookmarked the job
    application: 0,  // No boost for jobs user already applied to
    similar_view: 1  // User viewed similar jobs
  };
  
  // Track categories and skills the user has shown interest in
  const interestedCategories = new Set();
  const interestedSkills = new Set();
  
  // Extract interests from interactions
  interactions.forEach(interaction => {
    if (interaction.job && interaction.type !== 'application') {
      if (interaction.job.type) interestedCategories.add(interaction.job.type);
      if (interaction.job.skills) {
        interaction.job.skills.forEach(skill => interestedSkills.add(skill));
      }
    }
  });
  
  // Apply boosts to each job
  return scoredJobs.map(job => {
    let interactionBoost = 0;
    
    // Direct interaction boosts
    const directInteractions = interactions.filter(i => i.job && i.job.id === job.id);
    directInteractions.forEach(interaction => {
      interactionBoost += boostValues[interaction.type] || 0;
    });
    
    // Category interest boost
    if (job.type && interestedCategories.has(job.type)) {
      interactionBoost += 3;
    }
    
    // Skill interest boost
    if (job.skills) {
      const skillOverlap = job.skills.filter(skill => interestedSkills.has(skill)).length;
      interactionBoost += skillOverlap * 1;
    }
    
    // Calculate boosted score (base score + interaction boost)
    const boostedScore = job.baseMatchScore + interactionBoost;
    
    return {
      ...job,
      boostedScore,
      interactionBoost
    };
  });
};

/**
 * Applies collaborative filtering signals to recommendations
 * In a real system, this would use data from similar users
 * Here we simulate this with some randomness and trending factors
 * @param {Array} boostedJobs - Jobs with boosted scores
 * @param {Object} userProfile - The user's profile
 * @returns {Array} - Jobs with final recommendation scores
 */
const applyCollaborativeSignals = (boostedJobs, userProfile) => {
  // Simulate trending jobs (in a real system, this would be based on actual data)
  const trendingFactor = job => {
    // Simulate some jobs being more popular among similar users
    const baseTrending = Math.random() * 5;
    
    // Jobs matching user's department get a trending boost
    const departmentBoost = job.department === userProfile.department ? 3 : 0;
    
    // Recent jobs get a recency boost (simulated with random ID - higher ID = newer)
    const recencyBoost = (job.id / 100) % 5;
    
    return baseTrending + departmentBoost + recencyBoost;
  };
  
  // Apply the collaborative signals
  return boostedJobs.map(job => {
    const trending = trendingFactor(job);
    
    // Final score combines base match, interaction boosts, and collaborative signals
    const finalScore = Math.min(100, job.boostedScore + trending);
    
    return {
      ...job,
      trending,
      finalScore
    };
  });
};

/**
 * Generates mock user interactions for testing
 * @param {String} userId - User ID
 * @param {Array} jobs - Available jobs
 * @returns {Array} - Mock interactions
 */
export const generateMockInteractions = (userId, jobs) => {
  if (!jobs || jobs.length === 0) return [];
  
  const interactions = [];
  const interactionTypes = ['view', 'bookmark', 'application'];
  
  // Generate random interactions with some of the jobs
  jobs.forEach(job => {
    if (Math.random() > 0.6) {
      const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
      interactions.push({
        userId,
        jobId: job.id,
        job,
        type,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return interactions;
};