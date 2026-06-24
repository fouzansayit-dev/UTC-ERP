import React, { useRef, useState } from 'react';

export default function FileUpload({ label, name, onChange }) {
  const ref = useRef();
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    if (onChange) onChange(e);
  };

  return (
    <div className="visa-field">
      <label>{label}</label>
      <div className="visa-file-wrap" onClick={() => ref.current.click()}>
        <input ref={ref} type="file" name={name} onChange={handleChange} />
        {fileName
          ? <span style={{ color: '#2563eb', fontWeight: 600 }}>{fileName}</span>
          : <span>Click to browse or drag & drop file here</span>
        }
      </div>
    </div>
  );
}
