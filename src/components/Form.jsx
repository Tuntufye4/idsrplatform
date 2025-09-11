// src/components/Form.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import rawFormOptions from '../data/form_options.yml?raw';
import rawHealthStructure from '../data/malawi_health_structure.yml?raw';

const initialState = {
  patient_id: '',
  full_name: '',
  age: '',
  sex: '',
  date_of_birth: '',
  national_id: '',
  village: '',
  traditional_authority: '',
  health_facility: '',
  district: '',
  region: '',
  date_onset_symptoms: '',
  date_first_seen: '',
  disease: '',
  case_classification: '',
  outcome: '',
  date_of_death: '',
  diagnosis_type: '',
  specimen_collected: '',
  date_specimen_collected: '',
  specimen_type: '',
  lab_name: '',
  specimen_sent_to_lab: '',
  lab_result: '',
  date_result_received: '',
  final_case_classification: '',
  vaccination_status: '',
  date_last_vaccination: '',
  contact_with_confirmed_case: '',
  recent_travel_history: '',
  travel_destination: '',
  reporter_name: '',
  designation: '',
  contact_number: '',
  date_reported: '',
  form_completed_by: '',
  date_form_completed: '',
  reporting_week_number: '',
  year: '',
  health_facility_code: '',
  district_code: '',
  form_version: '',
  observations: ''
};

const Form = () => {
  const [formData, setFormData] = useState(initialState);
  const [formOptions, setFormOptions] = useState({});
  const [healthStructure, setHealthStructure] = useState({ districts: [] });
  const [villages, setVillages] = useState([]);
  const [traditionalAuthorities, setTraditionalAuthorities] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    try {
      setFormOptions(yaml.load(rawFormOptions));
      setHealthStructure(yaml.load(rawHealthStructure));
    } catch (err) {
      console.error('Error parsing YAML:', err);
    }
  }, []);

  useEffect(() => {
    const selectedDistrict = healthStructure.districts?.find(d => d.name === formData.district);
    if (selectedDistrict) {
      setTraditionalAuthorities(
        selectedDistrict.traditional_authorities.map(ta => ta.name)
      );
      setVillages(
        selectedDistrict.traditional_authorities.flatMap(ta => ta.villages)
      );
      setFacilities(selectedDistrict.facilities.map(f => f.name));
      setFormData(prev => ({ ...prev, region: selectedDistrict.region }));
    } else {
      setTraditionalAuthorities([]);
      setVillages([]);
      setFacilities([]);
      setFormData(prev => ({ ...prev, region: '' }));
    }
  }, [formData.district, healthStructure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };

    // Convert empty date fields to null
    const dateFields = [
      'date_of_birth',
      'date_of_death',
      'date_specimen_collected',
      'date_result_received',
      'date_last_vaccination',
      'date_reported',
      'date_form_completed'
    ];
    dateFields.forEach(field => {
      if (payload[field] === '') {
        payload[field] = null;
      }
    });

    try {
      await axios.post('http://localhost:8000/api/cases/', payload);
      alert('Form submitted successfully!');
      setFormData(initialState);
    } catch (err) {
      console.error(err);
      alert('Submission failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const renderSelect = (name, label, options) => (
    <div>
      <label className="block font-medium">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Select {label}</option>
        {options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderInput = (name, label, type = 'text', required = false) => (
    <div>
      <label className="block font-medium">{label}</label>
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

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">IDSR Case Form</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('patient_id', 'Patient ID')}
        {renderInput('full_name', 'Full Name')}
        {renderSelect('sex', 'Sex', formOptions.sex)}
        {renderSelect('age', 'Age', formOptions.age)}
        {renderInput('date_of_birth', 'Date of Birth', 'date')}
        {renderInput('national_id', 'National ID')}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect('district', 'District', healthStructure.districts?.map(d => d.name))}
        {renderSelect('traditional_authority', 'Traditional Authority', traditionalAuthorities)}
        {renderSelect('village', 'Village', villages)}
        {renderSelect('health_facility', 'Health Facility', facilities)}
        {renderInput('region', 'Region')}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Clinical Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('date_onset_symptoms', 'Date of Onset', 'date')}
        {renderInput('date_first_seen', 'Date First Seen', 'date')}
        {renderSelect('disease', 'Disease', formOptions.disease)}
        {renderSelect('case_classification', 'Case Classification', formOptions.case_classification)}
        {renderSelect('outcome', 'Outcome', formOptions.outcome)}
        {renderInput('date_of_death', 'Date of Death', 'date')} {/* Optional */}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Lab Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect('diagnosis_type', 'Diagnosis Type', formOptions.diagnosis_type)}
        {renderSelect('specimen_collected', 'Specimen Collected', formOptions.specimen_collected)}
        {renderInput('date_specimen_collected', 'Date Specimen Collected', 'date')}
        {renderSelect('specimen_type', 'Specimen Type', formOptions.specimen_type)}
        {renderSelect('lab_name', 'Lab Name', formOptions.lab_name)}
        {renderSelect('specimen_sent_to_lab', 'Specimen Sent to Lab', formOptions.specimen_sent_to_lab)}
        {renderSelect('lab_result', 'Lab Result', formOptions.lab_result)}
        {renderInput('date_result_received', 'Date Result Received', 'date')}
        {renderSelect('final_case_classification', 'Final Case Classification', formOptions.final_case_classification)}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Exposure & Vaccination</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect('vaccination_status', 'Vaccination Status', formOptions.vaccination_status)}
        {renderInput('date_last_vaccination', 'Date of Last Vaccination', 'date')}
        {renderSelect('contact_with_confirmed_case', 'Known Contact with Case', formOptions.known_contact)}
        {renderSelect('recent_travel_history', 'Travel History', formOptions.travel_history)}
        {renderSelect('travel_destination', 'Travel Destination',formOptions.travel_destination)}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Reporter Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('reporter_name', 'Reporter Name')}
        {renderSelect('designation', 'Designation', formOptions.designation)}
        {renderInput('contact_number', 'Contact Number')}
        {renderInput('date_reported', 'Date Reported', 'date')}
        {renderInput('form_completed_by', 'Form Completed By', 'text', true)}
        {renderInput('date_form_completed', 'Form Completed Date', 'date')}
      </div>

      <h3 className="mt-6 text-lg font-semibold">Metadata</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect('reporting_week_number', 'Reporting Week Number', formOptions.reporting_week_number)}
        {renderSelect('year', 'Reporting Year', formOptions.year)}   
        {renderSelect('health_facility_code', 'Health Facility Code', formOptions.health_facility_code)}
        {renderSelect('district_code', 'District Code', formOptions.district_code)}
        {renderInput('form_version', 'Form Version')}  
        <div>
          <label className="block font-medium">Observations</label>
          <textarea   
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
  