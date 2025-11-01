import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Briefcase, Filter, Search, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { generateRecommendations, generateMockInteractions } from "../utils/recommendationEngine";

const TalentSeekerDashboard = () => {
  const { userData, userRole, userProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "UI/UX Designer for Campus App",
      type: "Academic Project",
      postedBy: "Prof. Johnson",
      department: "Computer Science",
      skills: ["UI Design", "Figma", "User Research"],
      matchScore: 92,
      bookmarked: false,
      status: "pending"
    },
    {
      id: 2,
      title: "Backend Developer for Hackathon",
      type: "Competition/Hackathon",
      postedBy: "Tech Club",
      department: "Engineering",
      skills: ["Node.js", "MongoDB", "Express"],
      matchScore: 78,
      bookmarked: true,
      status: "shortlisted"
    },
    {
      id: 3,
      title: "Marketing Assistant for Student Startup",
      type: "Startup/Collaboration",
      postedBy: "EcoTech Startup",
      department: "Business School",
      skills: ["Social Media", "Content Creation", "Analytics"],
      matchScore: 65,
      bookmarked: false,
      status: "pending"
    },
    {
      id: 4,
      title: "Research Assistant - AI Project",
      type: "Academic Project",
      postedBy: "Dr. Smith",
      department: "Computer Science",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      matchScore: 88,
      bookmarked: false,
      status: "pending"
    },
    {
      id: 5,
      title: "Campus Ambassador",
      type: "Part-time Job",
      postedBy: "TechCorp",
      department: "Marketing",
      skills: ["Communication", "Event Management", "Leadership"],
      matchScore: 70,
      bookmarked: true,
      status: "accepted"
    }
  ]);
  
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  
  // Generate recommendations when component mounts
  useEffect(() => {
    // Generate mock interactions for demo purposes
    const mockInteractions = generateMockInteractions("user123", jobs);
    
    // Generate recommendations based on user profile and interactions
    const recommendations = generateRecommendations(jobs, userProfile, mockInteractions);
    
    // Update jobs with recommendation scores
    setRecommendedJobs(recommendations);
    
    toast.success("Personalized recommendations generated based on your profile!");
  }, [userProfile]);

  // Redirect if not in seeker role
  if (userRole !== "seeker") {
    navigate("/");
    toast.error("Please switch to Talent Seeker role to access this page");
    return null;
  }

  const toggleBookmark = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? {...job, bookmarked: !job.bookmarked} : job
    ));
    const job = jobs.find(job => job.id === id);
    toast.success(`${job.bookmarked ? 'Removed from' : 'Added to'} bookmarks`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "shortlisted":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Shortlisted</span>;
      case "accepted":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Accepted</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  // Get jobs based on whether to show recommendations or regular jobs
  const jobsToFilter = showRecommended && activeTab === "browse" ? recommendedJobs : jobs;
  
  const filteredJobs = jobsToFilter.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType ? job.type === filterType : true;
    
    if (activeTab === "bookmarks") {
      return job.bookmarked && matchesSearch && matchesFilter;
    } else if (activeTab === "applications") {
      return ["pending", "shortlisted", "accepted", "rejected"].includes(job.status) && matchesSearch && matchesFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Seeker Dashboard</h1>
          <p className="text-gray-600 mt-1">Find and apply for opportunities that match your skills</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "browse"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Browse Opportunities
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "bookmarks"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bookmarks
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "applications"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Applications
            </button>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by title or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Academic Project">Academic Project</option>
                  <option value="Startup/Collaboration">Startup/Collaboration</option>
                  <option value="Part-time Job">Part-time Job</option>
                  <option value="Competition/Hackathon">Competition/Hackathon</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <button
                onClick={() => setShowRecommended(!showRecommended)}
                className={`w-full px-4 py-2 border rounded-md text-sm font-medium ${
                  showRecommended
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {showRecommended ? "Show All Jobs" : "Show Recommended"}
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "bookmarks" 
                  ? "You haven't bookmarked any opportunities yet." 
                  : activeTab === "applications"
                  ? "You haven't applied to any opportunities yet."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{job.title}</h3>
                      <button 
                        onClick={() => toggleBookmark(job.id)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        {job.bookmarked ? (
                          <BookmarkCheck size={20} className="text-blue-500" />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Posted by {job.postedBy} • {job.department}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {job.type}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {job.matchScore || job.recommendationScore || 70}% Match
                          </span>
                        </div>
                      </div>
                      
                      {activeTab === "applications" ? (
                        getStatusBadge(job.status)
                      ) : (
                        <Link
                          to={`/apply-job/${job.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Apply Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentSeekerDashboard;