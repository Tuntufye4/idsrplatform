import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import rawFormOptions from '../../data/form_options.yml?raw';      
   

const initialState = {
  patient_id: '', full_name: '', environmental_risk_factors: '', exposure_source: '', cluster_related: ''
};
   
const EpidemicsForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [formOptions, setFormOptions] = useState({});  

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    onsetInfo: true,
    caseContact: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    try {
      setFormOptions(yaml.load(rawFormOptions));
    } catch (err) {
      console.error('Error parsing YAML:', err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    ['date_of_onset']      
      .forEach(f => { if (payload[f] === '') payload[f] = null; });

    try {
      await axios.post('http://idsr-backend.onrender.com/api/epidemiological/', payload);
      alert('Form submitted successfully!');
      setFormData(initialState);
    } catch (err) {
      console.error(err);
      alert('Submission failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const renderSelect = (name, label, options) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Select {label}</option>
        {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const renderInput = (name, label, type='text', required=false) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        name={name}
        value={formData[name]}
        onChange={handleChange}
        type={type}
        required={required}
        className="w-full border rounded p-2"
      />
    </div>
  );

  // Collapsible Section with smooth animation
  const Section = ({ title, children, sectionKey }) => {
    const contentRef = useRef(null);
    return (
      <div className="bg-gray-50 p-4 rounded shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="w-full text-left font-semibold text-lg mb-2 flex justify-between items-center"
        >
          {title}
          <span>{openSections[sectionKey] ? '-' : '+'}</span>
        </button>
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: openSections[sectionKey] ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>
        </div>
      </div>
    );   
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4">Epidemics Details</h2>

      <Section title="Onset Details" sectionKey="onsetInfo">
        {renderInput('patient_id', 'Patient ID')}
        {renderInput('full_name', 'Full Name')}
        {renderSelect('environmental_risk_factors', 'Environmental risk factors', formOptions.environmental_risk_factors)}
        {renderSelect('exposure_source', 'Exposure source', formOptions.exposure_source)}
        {renderSelect('cluster_related', 'Cluster related', formOptions.cluster_related)}
      </Section>

      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>     
  );
};

export default EpidemicsForm;
    