import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import rawFormOptions from '../../data/form_options.yml?raw';
import rawHealthStructure from '../../data/malawi_health_structure.yml?raw';


const initialState = {
  patient_id: '', treatment_given: '',  procedures_done: '', follow_up_plan: '', referral_facility: ''
};

const TreatmentForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [formOptions, setFormOptions] = useState({});
  const [healthStructure, setHealthStructure] = useState({ districts: [] });
  const [villages, setVillages] = useState([]);
  const [traditionalAuthorities, setTraditionalAuthorities] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    treatmentInfo: true  
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    try {
      setFormOptions(yaml.load(rawFormOptions));
      setHealthStructure(yaml.load(rawHealthStructure));
    } catch (err) {
      console.error('Error parsing YAML:', err);
    }
  }, []);

  useEffect(() => {
    const districtObj = healthStructure.districts?.find(d => d.name === formData.district);
    if (districtObj) {
      setTraditionalAuthorities(districtObj.traditional_authorities.map(ta => ta.name));
      setVillages(districtObj.traditional_authorities.flatMap(ta => ta.villages));
      setFacilities(districtObj.facilities.map(f => f.name));
      setFormData(prev => ({ ...prev, region: districtObj.region }));
    } else {
      setTraditionalAuthorities([]);
      setVillages([]);
      setFacilities([]);
      setFormData(prev => ({ ...prev, region: '' }));
    }
  }, [formData.district, healthStructure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    ['date_of_birth','date_of_death','date_specimen_collected','date_result_received','date_last_vaccination','date_reported','date_form_completed']
      .forEach(f => { if (payload[f] === '') payload[f] = null; });

    try {
      await axios.post('https://idsr-backend.onrender.com/api/treatment/', payload);
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
      <h2 className="text-2xl font-bold mb-4">Treatment Details </h2>

      <Section title="Treatment" sectionKey="treatmentInfo">
        {renderInput('patient_id', 'Patient ID')}
        {renderSelect('treatment_given', 'Sex', formOptions.treatment_given)}
        {renderSelect('procedures_done', 'Procedures Done', formOptions.procedures_done)}
        {renderSelect('follow_up_plan', 'Follow Up Plan', formOptions.follow_up_plan)}
        {renderSelect('referral_facility', 'Referral Facility', formOptions.referral_facility)}
      </Section>

      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default TreatmentForm;
  