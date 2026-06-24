import React, { useState, useEffect } from 'react';
import FeeForm from '../common/FeeForm.jsx';
import FeeTable from '../common/FeeTable.jsx';
import { courses, branches, batches, paymentModes } from '../feeConfig.js';

const fields = [
  { name: 'course', label: 'Course', type: 'select', options: courses, required: true },
  { name: 'branch', label: 'Branch Name', type: 'select', options: branches, required: true },
  { name: 'batch', label: 'Batch', type: 'select', options: batches, required: true },
  { name: 'studentId', label: 'Student ID (Scholar No / Roll No)', type: 'text', placeholder: 'Enter Student ID', required: true },
  { name: 'studentName', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
  { name: 'searchType', label: 'Select Search Type', type: 'select', options: ['Roll Number', 'Student Name', 'Admission Number'], required: true },
  { name: 'feeHead', label: 'Fee Head', type: 'text', placeholder: 'Enter fee head name', required: true },
  { name: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD'], required: true },
  { name: 'amountINR', label: 'Amount (INR)', type: 'text', placeholder: 'Enter INR amount' },
  { name: 'amountUSD', label: 'Amount (USD)', type: 'text', placeholder: 'Enter USD amount' },
  { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: paymentModes, required: true },
  { name: 'date', label: 'Receipt Date', type: 'date', required: true },
];

export default function FeeReceipt() {
  const [receipts, setReceipts] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const loadReceipts = () => {
    fetch('/api/fees')
      .then(res => res.json())
      .then(data => {
        // Map backend returned receipt properties
        const mapped = data.map((r, i) => ({
          ...r,
          sno: i + 1,
          receiptNo: r.receipt_no,
          studentId: r.scholar_no || r.student_id,
          studentName: r.student_name,
          feeHead: r.head_wise_details?.feeHead || 'Tuition Fee',
          currency: r.head_wise_details?.currency || 'INR',
          amountINR: (r.head_wise_details?.currency || 'INR') === 'INR' ? r.amount : 0,
          amountUSD: (r.head_wise_details?.currency || 'INR') === 'USD' ? r.amount : 0,
          paymentMode: r.payment_mode
        }));
        setReceipts(mapped);
      })
      .catch(err => console.error('Error loading receipts:', err));
  };

  useEffect(() => {
    loadReceipts();
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(err => console.error('Error loading students:', err));
  }, []);

  const handleSubmit = (values) => {
    // Resolve student
    const match = allStudents.find(s => 
      s.scholar_no === values.studentId || 
      s.roll_no === values.studentId || 
      s.id === Number(values.studentId) ||
      s.name.toLowerCase() === values.studentName.toLowerCase()
    );

    if (!match) {
      alert('Student not found in database. Please verify the Scholar No / Roll No / Name or add the student first.');
      return;
    }

    const amtStr = values.currency === 'INR' ? values.amountINR : values.amountUSD;
    const amount = parseFloat(amtStr || 0);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const requestBody = {
      student_id: match.id,
      amount: amount,
      payment_mode: values.paymentMode,
      date: values.date,
      head_wise_details: {
        feeHead: values.feeHead,
        currency: values.currency
      }
    };

    fetch('/api/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to save fee collection');
        alert(`Fee receipt generated and saved successfully! Receipt No: ${body.receipt_no}`);
        loadReceipts();
      })
      .catch(err => alert(err.message));
  };

  const columns = [
    { key: 'sno', label: 'SNo' },
    { key: 'receiptNo', label: 'Receipt No' },
    { key: 'studentId', label: 'Student ID' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'feeHead', label: 'Fee Head' },
    { key: 'currency', label: 'Currency' },
    { key: 'amountINR', label: 'Amount (INR)', render: (v) => v > 0 ? `₹${Number(v).toLocaleString('en-IN')}` : '—' },
    { key: 'amountUSD', label: 'Amount (USD)', render: (v) => v > 0 ? `$${Number(v).toLocaleString()}` : '—' },
    { key: 'paymentMode', label: 'Payment Mode' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2236' }}>Fee Receipt</div>
        <div style={{ fontSize: 12, color: '#6b7fa3', marginTop: 2 }}>Fee Module &gt; Fee Receipt</div>
      </div>
      <FeeForm title="Fee Receipt Entry" fields={fields} onSubmit={handleSubmit} submitLabel="Generate Receipt" />
      <div className="erp-card">
        <div className="erp-card-header">Fee Receipts</div>
        <div className="erp-card-body">
          <FeeTable columns={columns} data={receipts} />
        </div>
      </div>
    </div>
  );
}
