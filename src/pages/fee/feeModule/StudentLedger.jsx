import React, { useState, useEffect } from 'react';
import '../../student/Student.css';

export default function StudentLedger() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedStudent(data[0].id.toString());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    setLoading(true);

    // Fetch fee transactions and details for this student
    Promise.all([
      fetch(`/api/students`).then(res => res.json()),
      fetch(`/api/fees/transactions?student_id=${selectedStudent}`).catch(() => []), 
      fetch(`/api/generic/fees/transactions`).then(res => res.json()).catch(() => [])
    ])
      .then(([studentsList, apiTrans, genericTrans]) => {
        const list = Array.isArray(studentsList) ? studentsList : [];
        const studentObj = list.find(s => s.id === Number(selectedStudent));
        if (!studentObj) {
          setLedger([]);
          setLoading(false);
          return;
        }

        const items = [];
        let balance = 0;

        // 1. Initial Course Fee Demand (Debit)
        const baseFee = studentObj.due_fee + (studentObj.paid_fee || 0) || 150000;
        balance += baseFee;
        items.push({
          date: studentObj.admission_date || '01-Apr-2026',
          particulars: `Tuition Fee Demand allocated for ${studentObj.course} - ${studentObj.batch}`,
          debit: baseFee,
          credit: 0,
          balance: balance
        });

        // 2. Payments (Credit)
        // Check if there are generic stored transactions
        const genList = Array.isArray(genericTrans) ? genericTrans : [];
        const studentPayments = genList.filter(t => Number(t.student_id) === Number(selectedStudent));
        
        studentPayments.forEach(p => {
          balance -= p.amount;
          items.push({
            date: p.date,
            particulars: `Fee Receipt Entry (Receipt No: ${p.receipt_no || 'REC-' + p.id})`,
            debit: 0,
            credit: p.amount,
            balance: balance
          });
        });

        // 3. Discount adjustments if any (Credit)
        if (studentObj.discount_availed) {
          balance -= studentObj.discount_availed;
          items.push({
            date: studentObj.admission_date || '01-Apr-2026',
            particulars: 'Scholarship / Discount Credit adjustment',
            debit: 0,
            credit: studentObj.discount_availed,
            balance: balance
          });
        }

        setLedger(items);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [selectedStudent]);

  return (
    <div>
      <div className="stu-filter-card">
        <div className="stu-filter-header">Student Personal Fee Ledger</div>
        <div className="stu-filter-body" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div className="stu-field" style={{ margin: 0, minWidth: 320 }}>
            <label>Select Student to View Ledger</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.scholar_no}) - {s.course}</option>)}
            </select>
          </div>
          {loading && <span style={{ fontSize: 13, color: '#64748b' }}>Recalculating statement...</span>}
        </div>
      </div>

      <div className="stu-table-wrap" style={{ marginTop: 20 }}>
        <div className="stu-table-title">Fee Demand & Payment Statement Ledger</div>
        <table className="stu-table">
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Particulars</th>
              <th>Debit (Charges)</th>
              <th>Credit (Payments)</th>
              <th>Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No fee activities logged for this student.</td></tr>
            ) : (
              ledger.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td style={{ fontWeight: 500 }}>{item.particulars}</td>
                  <td style={{ color: item.debit > 0 ? '#ef4444' : '#333', fontWeight: item.debit > 0 ? 'bold' : 'normal' }}>
                    {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ color: item.credit > 0 ? '#10b981' : '#333', fontWeight: item.credit > 0 ? 'bold' : 'normal' }}>
                    {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>₹{item.balance.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
