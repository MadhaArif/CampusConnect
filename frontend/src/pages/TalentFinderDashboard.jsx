import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Edit, Eye, Plus, Trash2, Users } from "lucide-react";
import { toast } from "react-hot-toast";

const TalentFinderDashboard = () => {
  const { userData, userRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "UI/UX Designer for Campus App",
      type: "Academic Project",
      status: "active",
      applicants: 5,
      views: 28,
      createdAt: "2023-05-15"
    },
    {
      id: 2,
      title: "Backend Developer for Hackathon",
      type: "Competition/Hackathon",
      status: "draft",
      applicants: 0,
      views: 0,
      createdAt: "2023-05-18"
    },
    {
      id: 3,
      title: "Marketing Assistant for Student Startup",
      type: "Startup/Collaboration",
      status: "filled",
      applicants: 12,
      views: 45,
      createdAt: "2023-05-10"
    }
  ]);

  // Redirect if not in finder role
  if (userRole !== "finder") {
    navigate("/");
    toast.error("Please switch to Talent Finder role to access this page");
    return null;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
      case "draft":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case "filled":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Filled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Finder Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your opportunities and connect with talent</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => setActiveTab("create")}
          >
            <Plus size={18} />
            Create New Opportunity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Opportunities
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "create"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setActiveTab("applicants")}
              className={`px-4 py-4 text-sm font-medium ${
                activeTab === "applicants"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Applicants
            </button>
          </nav>
        </div>

        {activeTab === "posts" && (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">Created on {post.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          {post.applicants}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {post.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Opportunity</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. UI Designer for Campus App"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Opportunity Type
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a type</option>
                  <option value="academic">Academic Project</option>
                  <option value="startup">Startup/Collaboration</option>
                  <option value="part-time">Part-time Job</option>
                  <option value="competition">Competition/Hackathon</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe the opportunity, requirements, and what you're looking for..."
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. React, UI Design, Figma"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Applicants</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">UI/UX Designer for Campus App</h3>
                <p className="text-sm text-gray-500 mb-4">5 applicants</p>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((applicant) => (
                    <div key={applicant} className="bg-white p-4 rounded-md shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserRound size={20} className="text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Applicant {applicant}</h4>
                            <p className="text-sm text-gray-500">Applied on May 16, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Match Score: 85%
                          </span>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentFinderDashboard;