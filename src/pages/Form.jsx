import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import rawFormOptions from '../data/form_options.yml?raw';
import rawHealthStructure from '../data/malawi_health_structure.yml?raw';


const initialState = {
  patient_id: '', full_name: '', age: '', sex: '', date_of_birth: '', national_id: '',
  village: '', traditional_authority: '', health_facility: '', district: '', region: '',
  date_onset_symptoms: '', date_first_seen: '', disease: '', case_classification: '',
  outcome: '', date_of_death: '', diagnosis_type: '', specimen_collected: '',
  date_specimen_collected: '', specimen_type: '', lab_name: '', specimen_sent_to_lab: '',
  lab_result: '', date_result_received: '', final_case_classification: '', vaccination_status: '',
  date_last_vaccination: '', contact_with_confirmed_case: '', recent_travel_history: '',
  travel_destination: '', reporter_name: '', designation: '', contact_number: '',
  date_reported: '', form_completed_by: '', date_form_completed: '', reporting_week_number: '',
  year: '', health_facility_code: '', district_code: '', form_version: '', observations: ''
};

const Form = () => {
  const [formData, setFormData] = useState(initialState);
  const [formOptions, setFormOptions] = useState({});
  const [healthStructure, setHealthStructure] = useState({ districts: [] });
  const [villages, setVillages] = useState([]);
  const [traditionalAuthorities, setTraditionalAuthorities] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    patientInfo: true,
    location: true,
    clinical: true,
    lab: true,
    exposure: true,
    reporter: true,
    metadata: true
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
      await axios.post('https://idsr-backend.onrender.com/api/cases/', payload);
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
      <h2 className="text-2xl font-bold mb-4">IDSR </h2>

      <Section title="Patient Info" sectionKey="patientInfo">
        {renderInput('patient_id', 'Patient ID')}
        {renderInput('full_name', 'Full Name')}
        {renderSelect('sex', 'Sex', formOptions.sex)}
        {renderSelect('age', 'Age', formOptions.age)}
        {renderInput('date_of_birth', 'Date of Birth', 'date')}
        {renderInput('national_id', 'National ID')}
      </Section>

      <Section title="Location" sectionKey="location">
        {renderSelect('district', 'District', healthStructure.districts?.map(d => d.name))}
        {renderSelect('traditional_authority', 'Traditional Authority', traditionalAuthorities)}
        {renderSelect('village', 'Village', villages)}
        {renderSelect('health_facility', 'Health Facility', facilities)}
        {renderInput('region', 'Region')}
      </Section>

      <Section title="Clinical Info" sectionKey="clinical">
        {renderInput('date_onset_symptoms', 'Date of Onset', 'date')}
        {renderInput('date_first_seen', 'Date First Seen', 'date')}
        {renderSelect('disease', 'Disease', formOptions.disease)}
        {renderSelect('case_classification', 'Case Classification', formOptions.case_classification)}
        {renderSelect('triage_level', 'Triage level', formOptions.triage_level)}
        {renderSelect('admission_status', 'Admission status', formOptions.admission_status)}
        {renderSelect('outcome', 'Outcome', formOptions.outcome)}
        {renderInput('date_of_death', 'Date of Death', 'date')}    
      </Section>

      <Section title="Lab Information" sectionKey="lab">
        {renderSelect('diagnosis_type', 'Diagnosis Type', formOptions.diagnosis_type)}
        {renderSelect('specimen_collected', 'Specimen Collected', formOptions.specimen_collected)}
        {renderInput('date_specimen_collected', 'Date Specimen Collected', 'date')}
        {renderSelect('specimen_type', 'Specimen Type', formOptions.specimen_type)}
        {renderSelect('lab_name', 'Lab Name', formOptions.lab_name)}
        {renderSelect('specimen_sent_to_lab', 'Specimen Sent to Lab', formOptions.specimen_sent_to_lab)}
        {renderSelect('lab_result', 'Lab Result', formOptions.lab_result)}
        {renderSelect('lab_tests_ordered', 'Lab Tests Ordered', formOptions.lab_tests_ordered)}  
        {renderInput('date_result_received', 'Date Result Received', 'date')}
        {renderSelect('final_case_classification', 'Final Case Classification', formOptions.final_case_classification)}
      </Section>

      <Section title="Exposure & Vaccination" sectionKey="exposure">
        {renderSelect('vaccination_status', 'Vaccination Status', formOptions.vaccination_status)}
        {renderInput('date_last_vaccination', 'Date of Last Vaccination', 'date')}
        {renderSelect('contact_with_confirmed_case', 'Known Contact with Case', formOptions.known_contact)}
        {renderSelect('recent_travel_history', 'Travel History', formOptions.travel_history)}
        {renderSelect('travel_destination', 'Travel Destination', formOptions.travel_destination)}
      </Section>

      <Section title="Reporter Info" sectionKey="reporter">
        {renderInput('reporter_name', 'Reporter Name')}
        {renderInput('reporting_method','Reporting Method', formOptions.reporting_method)}
        {renderSelect('designation', 'Designation', formOptions.designation)}  
        {renderSelect('case_source', 'Case Source', formOptions.case_source)}
        {renderSelect('health_facility_code', 'Health Facility Code', formOptions.health_facility_code)}
        {renderInput('contact_number', 'Contact Number')}   
        {renderInput('date_reported', 'Date Reported', 'date')}
        {renderInput('form_completed_by', 'Form Completed By', 'text', true)}
        {renderInput('supervisor_comments', 'Supervisor Comments', 'text', true)}
        {renderInput('date_form_completed', 'Form Completed Date', 'date')}
      </Section>
  
      <Section title="Metadata" sectionKey="metadata">
        {renderSelect('reporting_week_number', 'Reporting Week Number', formOptions.reporting_week_number)}
        {renderSelect('year', 'Reporting Year', formOptions.year)}
        {renderSelect('district_code', 'District Code', formOptions.district_code)}
        {renderInput('form_version', 'Form Version')}
        <div>   
          <label className="block font-medium mb-1">Observations</label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            className="w-full border rounded p-2 min-h-[100px] resize-none"
          />
        </div>
      </Section>

      <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default Form;
  