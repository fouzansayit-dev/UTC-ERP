import React, { useState } from "react";

export default function AgentList({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div>
      <div className="agent-page-header">
        <h2>View Agents</h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13, width: 220 }}
          placeholder="Search by Agent ID / Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Agreement Expired</option>
          <option>Blacklisted</option>
        </select>
        <button className="agent-btn-primary" style={{ margin: 0 }} onClick={() => alert("Action")}>Search</button>
        <button
          className="agent-btn-primary"
          style={{ margin: 0, marginLeft: "auto", background: "#16a34a" }}
          onClick={() => onNavigate('agent-add', 'Add Agent')}
        >
          + Add Agent
        </button>
      </div>

      <div className="agent-table-wrapper">
        <table className="agent-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent ID</th>
              <th>Agent / Firm Name</th>
              <th>Contact Person</th>
              <th>Mobile</th>
              <th>Type</th>
              <th>Countries</th>
              <th>Programmes</th>
              <th>Referred</th>
              <th>Commission Paid</th>
              <th>Commission Pending</th>
              <th>Agreement Expiry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={14} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                No agents found. Add your first agent to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}