import React, { useState } from "react";

export default function CommissionStatement() {
  const [agentFilter, setAgentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div>
      <div className="agent-page-header">
        <h2>Commission Statement</h2>

      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Gross Commission", value: "₹0", color: "#1e3a5f" },
          { label: "Total TDS Deducted", value: "₹0", color: "#b45309" },
          { label: "Total Net Payable", value: "₹0", color: "#16a34a" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select
          style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }}
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
        >
          <option value="All">All Agents</option>
        </select>
        <select
          style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Paid">Paid</option>
        </select>
        <button className="agent-btn-primary" style={{ margin: 0 }} onClick={() => alert("Action")}>Filter</button>
        <button className="agent-btn-secondary" style={{ margin: 0 }} onClick={() => alert("Action")}>Export Excel</button>
        <button className="agent-btn-secondary" style={{ margin: 0 }} onClick={() => alert("Action")}>Generate Form 16A</button>
      </div>

      {/* Table */}
      <div className="agent-table-wrapper">
        <table className="agent-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Agent ID</th>
              <th>Agent Name</th>
              <th>Student</th>
              <th>Enroll Date</th>
              <th>Programme</th>
              <th>Gross (₹)</th>
              <th>TDS (₹)</th>
              <th>Net Payable (₹)</th>
              <th>Payment Date</th>
              <th>UTR Ref</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={12} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                No commission records found.
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ background: "#1e3a5f", color: "#fff", fontWeight: 700 }}>
              <td colSpan={6} style={{ padding: "10px 12px" }}>Total</td>
              <td style={{ padding: "10px 12px" }}>0</td>
              <td style={{ padding: "10px 12px" }}>0</td>
              <td style={{ padding: "10px 12px" }}>0</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
