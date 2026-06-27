import React, { useState, useEffect } from 'react';
import { COLLEGE, TODAY, iS, lbS, rS, TableToolbar } from './accountsConfig.jsx';

export default function BalanceSheet() {
  const [filter, setFilter] = useState({ college:'All', start:TODAY, end:TODAY });
  const [shown,  setShown]  = useState(false);
  const [banks, setBanks] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [financials, setFinancials] = useState({
    openingCapital: 0,
    netSurplus: 0,
    cashInHand: 0,
    bankBalances: 0,
    totalLiabilities: 0,
    totalAssets: 0
  });

  const sf = k => e => setFilter(p => ({ ...p, [k]: e.target.value }));

  const loadData = () => {
    // Load banks
    const fetchBanks = fetch('/api/generic/accounts/banks').then(res => res.json());
    // Load cashbook
    const fetchCashbook = fetch('/api/generic/accounts/cashbook').then(res => res.json());

    Promise.all([fetchBanks, fetchCashbook])
      .then(([banksData, cashbookData]) => {
        const validBanks = Array.isArray(banksData) ? banksData : [];
        const validCashbook = Array.isArray(cashbookData) ? cashbookData : [];
        setBanks(validBanks);
        setCashbook(validCashbook);
        calculateFinancials(validBanks, validCashbook);
      })
      .catch(err => console.error('Error loading balance sheet data:', err));
  };

  const calculateFinancials = (bankList, ledger) => {
    // Opening Capital = sum of opening balances of all banks
    const opCapital = bankList.reduce((sum, b) => sum + (parseFloat(b.opening) || 0), 0);

    // Filter cashbook entries up to end date (snapshot as of end date)
    const activeLedger = ledger.filter(r => r.date <= filter.end);

    // Cash in Hand
    let cashInHand = 0;
    // Bank balances
    let bankBalances = opCapital;

    // Net Surplus
    let totalCredits = 0;
    let totalDebits = 0;

    activeLedger.forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.type === 'Credit') {
        totalCredits += amt;
        if (r.payMode === 'Cash') {
          cashInHand += amt;
        } else {
          bankBalances += amt;
        }
      } else if (r.type === 'Debit') {
        totalDebits += amt;
        if (r.payMode === 'Cash') {
          cashInHand -= amt;
        } else {
          bankBalances -= amt;
        }
      }
    });

    const netSurplus = totalCredits - totalDebits;
    const totalLiabilities = opCapital + netSurplus;
    const totalAssets = cashInHand + bankBalances;

    setFinancials({
      openingCapital: opCapital,
      netSurplus: netSurplus,
      cashInHand: cashInHand,
      bankBalances: bankBalances,
      totalLiabilities: totalLiabilities,
      totalAssets: totalAssets
    });
  };

  useEffect(() => {
    if (shown) {
      loadData();
    }
  }, [shown, filter.end]);

  return (
    <div className="hr-form">
      <div className="section-title">Balance Sheet</div>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'20px 24px', marginBottom:20 }}>
        <div style={rS}><span style={lbS}>College</span><div style={{ flex:1, maxWidth:400 }}><select style={iS} value={filter.college} onChange={sf('college')}><option>All</option><option>{COLLEGE}</option></select></div></div>
        <div style={rS}><span style={lbS}>As of Date</span><div style={{ flex:1, maxWidth:400 }}><input style={iS} type="date" value={filter.end} onChange={sf('end')} /></div></div>
        <button className="submit-btn" onClick={() => setShown(true)}>Submit</button>
      </div>
      {shown && (
        <div className="table-wrap">
          <TableToolbar title={`Balance Sheet as of ${filter.end}`} />
          <table className="hr-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Liabilities & Capital</th>
                <th style={{ width: '15%' }}>Amount (₹)</th>
                <th style={{ width: '35%' }}>Assets</th>
                <th style={{ width: '15%' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Capital Account (Bank Opening Balances)</td>
                <td>₹{financials.openingCapital.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>Cash in Hand</td>
                <td>₹{financials.cashInHand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td>Reserves & Surplus (Net Surplus from I&E)</td>
                <td style={{ color: financials.netSurplus >= 0 ? '#16a34a' : '#dc2626' }}>
                  ₹{financials.netSurplus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td>Bank Balances</td>
                <td>₹{financials.bankBalances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style={{ background: '#eff6ff', fontWeight: 700 }}>
                <td>Total Liabilities & Capital</td>
                <td>₹{financials.totalLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>Total Assets</td>
                <td>₹{financials.totalAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
