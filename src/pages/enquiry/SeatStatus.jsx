import React from 'react';
import './Enquiry.css';

const SectionTitle = ({ title }) => <div className="section-title">{title}</div>;

export default function SeatStatus() {
  return (
    <div className="hr-form">

      {/* ── LEGEND ── */}
      <SectionTitle title="Seat Availability Legend" />
      <div className="seat-legend">
        <div className="seat-legend-item">
          <div className="seat-legend-dot" style={{ background: '#16a34a' }} />
          <span>Good availability (&lt; 60% filled)</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-dot" style={{ background: '#d97706' }} />
          <span>Filling fast (60–89% filled)</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-dot" style={{ background: '#dc2626' }} />
          <span>Almost full (&#8805; 90% filled)</span>
        </div>
      </div>

      {/* ── DOMESTIC SEATS ── */}
      <SectionTitle title="Domestic Seat Availability" />
      <div className="table-wrap" style={{ marginBottom: 32 }}>
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course</th>
              <th>Category</th>
              <th>Total Seats</th>
              <th>Filled Seats</th>
              <th>Available Seats</th>
              <th>Availability Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="empty-table-msg">
                No seat data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── ABROAD SEATS ── */}
      <SectionTitle title="Abroad University Seat Availability" />
      <div className="table-wrap">
        <table className="hr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>University</th>
              <th>Country</th>
              <th>Course</th>
              <th>Total Seats</th>
              <th>Filled Seats</th>
              <th>Available Seats</th>
              <th>Availability Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="empty-table-msg">
                No seat data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
