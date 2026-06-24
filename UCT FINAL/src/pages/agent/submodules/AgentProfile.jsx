import React, { useState } from "react";

const initialForm = {
  agentId: "",
  agentFirmName: "",
  contactPerson: "",
  mobile: "",
  email: "",
  address: "",
  agentType: "",
  countriesCovered: "",
  programmesHandled: "",
  agreementDate: "",
  agreementExpiry: "",
  commissionStructure: "",
  commissionTrigger: "",
  paymentTerms: "",
  bankAccount: "",
  ifscCode: "",
  bankName: "",
  branch: "",
  panGst: "",
  agreementCopy: null,
  status: "Active",
};

export default function AgentProfile() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert("Agent profile saved successfully!");
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  return (
    <div>
      <div className="agent-page-header">
        <h2>Agent Profile — Add / Edit</h2>

      </div>

      <p className="agent-section-title">Basic Information</p>
      <div className="agent-form-grid">
        <div className="agent-form-group">
          <label>Agent ID (Auto-generated)</label>
          <input name="agentId" value={form.agentId} readOnly placeholder="Auto-generated on save" style={{ background: "#f3f4f6" }} />
        </div>
        <div className="agent-form-group">
          <label>Agent / Firm Name *</label>
          <input name="agentFirmName" value={form.agentFirmName} onChange={handleChange} placeholder="Individual or registered firm name" />
        </div>
        <div className="agent-form-group">
          <label>Contact Person</label>
          <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Primary contact at the firm" />
        </div>
        <div className="agent-form-group">
          <label>Mobile *</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 / International" />
        </div>
        <div className="agent-form-group">
          <label>Email *</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
        </div>
        <div className="agent-form-group">
          <label>Agent Type *</label>
          <select name="agentType" value={form.agentType} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Individual">Individual</option>
            <option value="Firm">Firm</option>
            <option value="Sub-Agent">Sub-Agent</option>
            <option value="Master Agent">Master Agent</option>
          </select>
        </div>
        <div className="agent-form-group" style={{ gridColumn: "1 / -1" }}>
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Office address — city, state, country (for international agents)" />
        </div>
      </div>

      <p className="agent-section-title">Programme & Coverage</p>
      <div className="agent-form-grid">
        <div className="agent-form-group">
          <label>Countries Covered</label>
          <input name="countriesCovered" value={form.countriesCovered} onChange={handleChange} placeholder="e.g. Russia, Kazakhstan, Philippines" />
        </div>
        <div className="agent-form-group">
          <label>Programmes Handled</label>
          <select name="programmesHandled" value={form.programmesHandled} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Domestic MBBS">Domestic MBBS</option>
            <option value="Abroad MBBS">Abroad MBBS</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      <p className="agent-section-title">Agreement Details</p>
      <div className="agent-form-grid">
        <div className="agent-form-group">
          <label>Agreement Date</label>
          <input type="date" name="agreementDate" value={form.agreementDate} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>Agreement Expiry</label>
          <input type="date" name="agreementExpiry" value={form.agreementExpiry} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>Commission Structure</label>
          <select name="commissionStructure" value={form.commissionStructure} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Flat per student (INR)">Flat per student (INR)</option>
            <option value="Flat per student (USD)">Flat per student (USD)</option>
            <option value="% of first year fee">% of first year fee</option>
            <option value="Tiered slab">Tiered slab</option>
          </select>
        </div>
        <div className="agent-form-group">
          <label>Commission Trigger</label>
          <select name="commissionTrigger" value={form.commissionTrigger} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="On Enrollment">On Enrollment</option>
            <option value="On Visa Approved">On Visa Approved</option>
            <option value="On Departure">On Departure</option>
            <option value="On Year-end">On Year-end</option>
          </select>
        </div>
        <div className="agent-form-group">
          <label>Payment Terms (days)</label>
          <input name="paymentTerms" value={form.paymentTerms} onChange={handleChange} placeholder="e.g. 30" />
        </div>
        <div className="agent-form-group">
          <label>Agreement Copy (DMS)</label>
          <input type="file" name="agreementCopy" onChange={(e) => setForm(prev => ({ ...prev, agreementCopy: e.target.files[0] }))} />
        </div>
      </div>

      <p className="agent-section-title">Bank Details (for NEFT Payment)</p>
      <div className="agent-form-grid">
        <div className="agent-form-group">
          <label>Account Number</label>
          <input name="bankAccount" value={form.bankAccount} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>IFSC Code</label>
          <input name="ifscCode" value={form.ifscCode} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>Bank Name</label>
          <input name="bankName" value={form.bankName} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>Branch</label>
          <input name="branch" value={form.branch} onChange={handleChange} />
        </div>
        <div className="agent-form-group">
          <label>PAN / GST Number (Indian agents)</label>
          <input name="panGst" value={form.panGst} onChange={handleChange} placeholder="For TDS deduction and invoice verification" />
        </div>
        <div className="agent-form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Agreement Expired">Agreement Expired</option>
            <option value="Blacklisted">Blacklisted</option>
          </select>
        </div>
      </div>

      <p className="agent-section-title">Live Statistics (Auto-populated)</p>
      <div className="agent-form-grid">
        <div className="agent-form-group">
          <label>Referred Students Count</label>
          <input
            value=""
            readOnly
            placeholder="Live count linked from enquiry / admission module"
            style={{ background: "#f3f4f6", color: "#6b7280" }}
          />
        </div>
        <div className="agent-form-group">
          <label>Total Commission Paid</label>
          <input
            value=""
            readOnly
            placeholder="Cumulative from accounts module"
            style={{ background: "#f3f4f6", color: "#6b7280" }}
          />
        </div>
        <div className="agent-form-group">
          <label>Total Commission Pending</label>
          <input
            value=""
            readOnly
            placeholder="Payable but not yet disbursed"
            style={{ background: "#f3f4f6", color: "#6b7280" }}
          />
        </div>
      </div>

      <div>
        <button className="agent-btn-primary" onClick={handleSubmit}>Save Agent</button>
        <button className="agent-btn-secondary" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
