import React, { useState } from "react";

const stages = [
  { step: 1, stage: "Student Referral Logged", details: "Enquiry form captures Agent ID. Agent credited for lead. Agent's Referred Students count incremented.", color: "#2563eb" },
  { step: 2, stage: "Enrollment Confirmation", details: "Student enrolls and pays admission fee. Commission becomes payable (as per agreement trigger condition). Commission payable entry auto-created in accounts module.", color: "#16a34a" },
  { step: 3, stage: "Commission Calculation", details: "ERP calculates: Agreed rate × qualifying fee amount = Gross Commission. TDS deducted @ applicable rate (if Indian agent). Net payable shown.", color: "#0891b2" },
  { step: 4, stage: "Invoice from Agent", details: "Agent submits invoice (uploaded in DMS). Accounts verifies invoice amount against ERP calculation.", color: "#7c3aed" },
  { step: 5, stage: "Approval Workflow", details: "Accounts Head approves amounts within limit. Above limit: Principal / Management approval required. Approval recorded with date and approver name.", color: "#ea580c" },
  { step: 6, stage: "Payment Processing", details: "NEFT transfer initiated. Payment date, UTR/transaction reference, bank name logged.", color: "#0f766e" },
  { step: 7, stage: "Ledger & TDS Update", details: "Commission marked as Paid. TDS challan details recorded for quarterly TDS filing (26Q). Agent receives payment advice.", color: "#b45309" },
  { step: 8, stage: "Annual Statement", details: "Year-end: Agent-wise commission statement generated. Form 16A issued to eligible agents for TDS.", color: "#1e3a5f" },
];

export default function AgentCommissionFlow() {
  const [activeTab, setActiveTab] = useState("flow");

  return (
    <div>
      <div className="agent-page-header">
        <h2>Agent Commission Flow</h2>

      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          className={`agent-tab-btn ${activeTab === "flow" ? "active" : ""}`}
          onClick={() => setActiveTab("flow")}
        >
          Stage Flow
        </button>
        <button
          className={`agent-tab-btn ${activeTab === "tracker" ? "active" : ""}`}
          onClick={() => setActiveTab("tracker")}
        >
          Commission Tracker
        </button>
      </div>

      {activeTab === "flow" && (
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
            8-stage workflow from student referral to annual TDS statement.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stages.map((s) => (
              <div
                key={s.step}
                style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderLeft: `4px solid ${s.color}`, borderRadius: 6, padding: "12px 16px",
                }}
              >
                <div style={{
                  minWidth: 32, height: 32, borderRadius: "50%", background: s.color,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 14,
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1e3a5f", marginBottom: 4 }}>{s.stage}</div>
                  <div style={{ fontSize: 13, color: "#4b5563" }}>{s.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tracker" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <select style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }}>
              <option>All Agents</option>
            </select>
            <select style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 13 }}>
              <option>All Stages</option>
              {stages.map(s => <option key={s.step}>{s.stage}</option>)}
            </select>
            <button className="agent-btn-primary" style={{ margin: 0 }} onClick={() => alert("Action")}>Filter</button>
          </div>

          <div className="agent-table-wrapper">
            <table className="agent-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Agent ID</th>
                  <th>Agent Name</th>
                  <th>Student</th>
                  <th>Current Stage</th>
                  <th>Gross Amount</th>
                  <th>TDS</th>
                  <th>Net Payable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                    No commission records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
