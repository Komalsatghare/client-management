import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const projectsData = [
  {
    name: "Skyline Apartments",
    client: "ABC Developers",
    status: "Active",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    budget: "₹5,00,00,000",
  },
  {
    name: "Bridge Renovation",
    client: "City Infrastructure",
    status: "Completed",
    startDate: "01 Mar 2025",
    endDate: "30 Sep 2025",
    budget: "₹2,50,00,000",
  },
  {
    name: "Industrial Complex",
    client: "XYZ Industries",
    status: "Active",
    startDate: "01 May 2026",
    endDate: "30 Mar 2027",
    budget: "₹8,00,00,000",
  },
];

function ProjectDetails({ project, goBack }) {
  return (
    <div className="details-container">
      <button className="back-btn" onClick={goBack}>
        ← Back to Projects
      </button>
      <h2>Project Details</h2>
      <p>
        <strong>Project Name:</strong> {project.name}
      </p>
      <p>
        <strong>Client/Company:</strong> {project.client}
      </p>
      <p>
        <strong>Status:</strong> {project.status}
      </p>
      <p>
        <strong>Start Date:</strong> {project.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {project.endDate}
      </p>
      <p>
        <strong>Budget:</strong> {project.budget}
      </p>
    </div>
  );
}

function AdminProjects({ setSelectedProject }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredProjects = projectsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? p.status === filterStatus : true)
  );

  // Summary stats
  const totalProjects = projectsData.length;
  const activeProjects = projectsData.filter((p) => p.status === "Active")
    .length;
  const completedProjects = projectsData.filter((p) => p.status === "Completed")
    .length;
  const pendingApprovals = 0; // Can customize if needed

  return (
    <div className="container">
      {/* Inline CSS */}
      <style>{`
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .summary-cards {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .card {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 8px;
          flex: 1;
          text-align: center;
          box-shadow: 1px 1px 5px #ccc;
        }
        .actions {
          margin-bottom: 15px;
        }
        .actions button {
          margin-right: 10px;
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }
        .actions button:hover {
          background-color: #0056b3;
        }
        .filters {
          margin-bottom: 15px;
        }
        .filters input, .filters select {
          margin-right: 10px;
          padding: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th, table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        table th {
          background-color: #f4f4f4;
        }
        table button {
          margin-right: 5px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        table button:hover {
          opacity: 0.8;
        }
        .details-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .back-btn {
          margin-bottom: 15px;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          background-color: #6c757d;
          color: white;
          cursor: pointer;
        }
        .back-btn:hover {
          background-color: #5a6268;
        }
        h2 {
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          margin: 5px 0;
        }
      `}</style>

      <h1>{t('admin_projects_dashboard') || "Admin Projects Dashboard"}</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>{t('total_projects') || "Total Projects"}</h3>
          <p>{totalProjects}</p>
        </div>
        <div className="card">
          <h3>{t('active_projects_stat') || "Active Projects"}</h3>
          <p>{activeProjects}</p>
        </div>
        <div className="card">
          <h3>{t('completed_projects') || "Completed Projects"}</h3>
          <p>{completedProjects}</p>
        </div>
        <div className="card">
          <h3>{t('pending_approvals') || "Pending Approvals"}</h3>
          <p>{pendingApprovals}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button>{t('add_new_project_btn') || "Add New Project"}</button>
        <button>{t('export_projects') || "Export Projects"}</button>
        <button>{t('mark_completed') || "Mark Selected Completed"}</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder={t('search_by_name') || "Search by project name"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">{t('all_status') || "All Status"}</option>
          <option value="Active">{t('active') || "Active"}</option>
          <option value="Completed">{t('completed') || "Completed"}</option>
        </select>
      </div>

      {/* Projects Table */}
      <table>
        <thead>
          <tr>
            <th>{t('project_name') || "Project Name"}</th>
            <th>{t('client_company') || "Client/Company"}</th>
            <th>{t('status') || "Status"}</th>
            <th>{t('start_date') || "Start Date"}</th>
            <th>{t('end_date') || "End Date"}</th>
            <th>{t('budget') || "Budget"}</th>
            <th>{t('actions') || "Actions"}</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr key={index}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.status}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.budget}</td>
              <td>
                <button onClick={() => setSelectedProject(project)}>{t('view') || "View"}</button>
                <button>{t('edit') || "Edit"}</button>
                <button>{t('delete') || "Delete"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProjects;
