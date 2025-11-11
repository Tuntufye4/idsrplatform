import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';   
import yaml from 'js-yaml';
import rawFormOptions from '../../data/form_options.yml?raw';  
import rawHealthStructure from '../../data/malawi_health_structure.yml?raw';


const initialState = {
  patient_id: '', age:'',  sex: '', date_of_birth: '', national_id:'', village:'',  traditional_authority:'', health_facility:'',
  district:'', region:'' , date_first_seen:'', date_of_death:'',  date_result_received:'', vaccination_status:'', date_last_vaccination:''
     
};
   
const DemographicsForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [formOptions, setFormOptions] = useState({});
  const [healthStructure, setHealthStructure] = useState({ districts: [] });
  const [villages, setVillages] = useState([]);
  const [traditionalAuthorities, setTraditionalAuthorities] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    demographics: true    
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
    ['date_reported']
      .forEach(f => { if (payload[f] === '') payload[f] = null; });

    try {
      await axios.post('http://127.0.0.1:8000/api/demographics/', payload);
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
      <h2 className="text-2xl font-bold mb-4">Demographics </h2>

      <Section title="Demographics" sectionKey="demographics">
        {renderInput('patient_id', 'Patient ID')}
        {renderSelect('age', 'Age', formOptions.age)}
        {renderInput('date_of_birth', 'Date of birth', 'date')}
        {renderInput('national_id', 'National ID')}   
        {renderSelect('village', 'Village', formOptions.village)} 
        {renderSelect('traditional_authority', 'Traditional authority', formOptions.traditional_authority)}
        {renderSelect('health_facility', 'Health facility', formOptions.health_facility)}
        {renderSelect('district', 'District', formOptions.district)}
        {renderSelect('region', 'Region', formOptions.region)}
        {renderInput('date_first_seen', 'Date first seen', 'date')}
        {renderInput('date_result_received', 'Date result received', 'date')}
        {renderSelect('vaccination_status', 'Vaccination status', formOptions.vaccination_status)}
        {renderInput('date_last_vaccination', 'Date last vaccination', 'date')}

      </Section>     

      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default DemographicsForm;
     