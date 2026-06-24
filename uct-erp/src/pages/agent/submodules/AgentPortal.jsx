import React, { useState } from "react";

export default function AgentPortal() {
  const [tab, setTab] = useState("students");

  return (
    <div>
      <div className="agent-page-header">
        <h2>Agent Portal</h2>

      </div>

      <div style={{
        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6,
        padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#1e40af",
      }}>
        <strong>Portal Info:</strong> Agents get a limited login to the ERP portal. They can view their referred students, application/enrollment status, commission statements, upload invoices, and receive notifications.
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Referred", value: "—" },
          { label: "Enrolled Students", value: "—" },
          { label: "Commission Earned", value: "—" },
          { label: "Commission Pending", value: "—" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { key: "students", label: "Referred Students" },
          { key: "commission", label: "Commission Statement" },
          { key: "invoice", label: "Upload Invoice" },
          { key: "notifications", label: "Notifications" },
        ].map((t) => (
          <button
            key={t.key}
            className={`agent-tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "students" && (
        <div className="agent-table-wrapper">
          <table className="agent-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Programme</th>
                <th>Application Status</th>
                <th>Enrollment Status</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                  No referred students found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "commission" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button className="agent-btn-primary" style={{ margin: 0 }} onClick={() => alert("Action")}>Download PDF</button>
          </div>
          <div className="agent-table-wrapper">
            <table className="agent-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Commission Earned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                    No commission records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "invoice" && (
        <div style={{ maxWidth: 480 }}>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Select Student</label>
            <select>
              <option>-- Select Referred Student --</option>
            </select>
          </div>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Invoice Number *</label>
            <input type="text" placeholder="Enter invoice number" />
          </div>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Invoice Date *</label>
            <input type="date" />
          </div>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Invoice Amount (₹) *</label>
            <input type="number" placeholder="Enter invoice amount" />
          </div>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Upload Invoice (PDF) *</label>
            <input type="file" accept=".pdf" />
          </div>
          <div className="agent-form-group" style={{ marginBottom: 16 }}>
            <label>Remarks</label>
            <textarea placeholder="Optional remarks" />
          </div>
          <button className="agent-btn-primary" style={{ margin: 0 }} onClick={() => alert("Action")}>Submit Invoice</button>
        </div>
      )}

      {tab === "notifications" && (
        <div style={{ textAlign: "center", padding: 32, color: "#9ca3af", fontSize: 13 }}>
          No notifications at this time.
        </div>
      )}
    </div>
  );
}
