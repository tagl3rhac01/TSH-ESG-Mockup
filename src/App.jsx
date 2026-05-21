import { useState, useEffect, useMemo } from 'react';

// ==========================================
// DUMMY DATA & ASSETS
// ==========================================
const PROPERTIES = [
  { id: 1, code: "SG-18ROB", name: "18 Robinson", segment: "Commercial Office", country: "Singapore", gfa: 27540, baseline: "2019", desc: "High-density mixed-use development with specific tenant sub-metering requirements." },
  { id: 2, code: "SG-DUNEARN", name: "Dunearn Village", segment: "Retail", country: "Singapore", gfa: 8120, baseline: "2021", desc: "Low-rise retail mall with open-air pedestrian walkways and F&B tenants." },
  { id: 3, code: "SG-OXLEY", name: "The Oxley", segment: "Commercial Office", country: "Singapore", gfa: 12400, baseline: "2020", desc: "Premium office complex in CBD zone." },
  { id: 4, code: "AU-ROLP", name: "ROLP (Perth Hospitality)", segment: "Hospitality", country: "Australia", gfa: 15200, baseline: "2019", desc: "Regional Office Park with extensive landscaped areas and organic waste processing facilities." },
  { id: 5, code: "AU-GHM", name: "Grand Hyatt Melbourne", segment: "Hospitality", country: "Australia", gfa: 42000, baseline: "2019", desc: "Five-star hotel property with guest rooms and event spaces." },
  { id: 6, code: "SG-FRRP", name: "Fraser Residence River Promenade", segment: "Hospitality", country: "Singapore", gfa: 19600, baseline: "2022", desc: "Luxury service residence along the Singapore River." },
  { id: 7, code: "CN-HABITAT", name: "Habitat Shanghai", segment: "Commercial Office", country: "China", gfa: 31000, baseline: "2020", desc: "High-end corporate office park in Pudong district." },
  { id: 8, code: "ID-BATAM", name: "PT Batam Opus Bay", segment: "Retail", country: "Indonesia", gfa: 22800, baseline: "2022", desc: "Commercial shopping plaza in Batam center." },
  { id: 9, code: "AU-PERTH", name: "Perth Commercial Centre", segment: "Commercial Office", country: "Australia", gfa: 18900, baseline: "2021", desc: "Corporate office building in Western Australia." },
  { id: 10, code: "MY-HYPAK", name: "Hypak Sdn Bhd", segment: "Industrial", country: "Malaysia", gfa: 9400, baseline: "2018", desc: "Industrial manufacturing asset with specialized heavy-load energy grids and logistics centers." }
];

const EMISSION_FACTORS = [
  { category: "Electricity", region: "Singapore (EMA)", unit: "kgCO2e/kWh", factor: 0.4085, period: "CY 2026", active: true },
  { category: "Electricity", region: "Australia (NEM)", unit: "kgCO2e/kWh", factor: 0.6812, period: "CY 2026", active: true },
  { category: "Electricity", region: "China (National Grid)", unit: "kgCO2e/kWh", factor: 0.5840, period: "CY 2026", active: true },
  { category: "Electricity", region: "Malaysia (Peninsular)", unit: "kgCO2e/kWh", factor: 0.6200, period: "CY 2026", active: true },
  { category: "Electricity", region: "Indonesia (Java-Bali)", unit: "kgCO2e/kWh", factor: 0.7800, period: "CY 2026", active: true },
  { category: "Natural Gas", region: "Global Default", unit: "kgCO2e/GJ", factor: 56.1000, period: "Indefinite", active: true },
  { category: "Waste", region: "Municipal (Mixed)", unit: "kgCO2e/tonne", factor: 21.5000, period: "CY 2026", active: true }
];

const INITIAL_SUBMISSIONS = [
  { propertyId: 1, period: "May 2026", status: "locked", elec: 124502, water: 892, gas: 0, waste: 3400, submittedOn: "12 May 2026", daysOverdue: 0 },
  { propertyId: 2, period: "May 2026", status: "locked", elec: 34100, water: 245, gas: 0, waste: 1100, submittedOn: "14 May 2026", daysOverdue: 0 },
  { propertyId: 3, period: "May 2026", status: "submitted", elec: 52400, water: 412, gas: 0, waste: 1800, submittedOn: "18 May 2026", daysOverdue: 0 },
  { propertyId: 4, period: "May 2026", status: "draft", elec: 84200, water: 1205, gas: 1420, waste: 4800, submittedOn: null, daysOverdue: 1 },
  { propertyId: 5, period: "May 2026", status: "overdue", elec: 194000, water: 3420, gas: 4200, waste: 12400, submittedOn: null, daysOverdue: 8 },
  { propertyId: 6, period: "May 2026", status: "locked", elec: 78500, water: 610, gas: 680, waste: 2100, submittedOn: "11 May 2026", daysOverdue: 0 },
  { propertyId: 7, period: "May 2026", status: "submitted", elec: 142800, water: 980, gas: 2100, waste: 5400, submittedOn: "15 May 2026", daysOverdue: 0 },
  { propertyId: 8, period: "May 2026", status: "draft", elec: 91000, water: 1430, gas: 0, waste: 4100, submittedOn: null, daysOverdue: 2 },
  { propertyId: 9, period: "May 2026", status: "locked", elec: 95400, water: 820, gas: 1850, waste: 3900, submittedOn: "10 May 2026", daysOverdue: 0 },
  { propertyId: 10, period: "May 2026", status: "locked", elec: 164000, water: 2410, gas: 0, waste: 18900, submittedOn: "15 May 2026", daysOverdue: 0 }
];

const AMENDMENT_LOG = [
  { date: "21 May 2026, 09:12 AM", property: "Sydney Central Plaza", category: "Electricity", original: "12,450 kWh", new: "14,210 kWh", reason: "Meter recalibration correction", user: "Sarah Jenkins" },
  { date: "20 May 2026, 04:30 PM", property: "Melbourne Tech Park", category: "Natural Gas", original: "4,200 GJ", new: "4,115 GJ", reason: "Duplicate entry removal", user: "Michael Chen" },
  { date: "18 May 2026, 11:15 AM", property: "18 Robinson", category: "Water", original: "920 m³", new: "892 m³", reason: "Tenant sub-meter reconciliation", user: "John Tan" },
  { date: "15 May 2026, 02:45 PM", property: "Habitat Shanghai", category: "Waste", original: "5,800 kg", new: "5,400 kg", reason: "Compost collection correction", user: "Li Wei" }
];

const FORM_TABS = ["General", "Electricity", "Water", "Fuel", "Waste", "Recycling", "Documents", "Review"];

// Helper to resolve Country/Region Grid Factor
const getGridEF = (country) => {
  switch (country) {
    case "Singapore": return 0.4085;
    case "Australia": return 0.6812;
    case "China": return 0.5840;
    case "Malaysia": return 0.6200;
    case "Indonesia": return 0.7800;
    default: return 0.5000;
  }
};

// ==========================================
// SUB-COMPONENT: SUBMISSION FORM (KEYED PER PROPERTY)
// ==========================================
function SubmissionForm({ selectedProperty, submissions, onSaveDraft, onSubmitFinal, triggerToast }) {
  const [formTab, setFormTab] = useState(0);

  // Initialize values when component is mounted (keyed by selectedProperty.id)
  const initialValues = useMemo(() => {
    const sub = submissions.find(s => s.propertyId === selectedProperty.id && s.period === "May 2026");
    return {
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      controlType: 'Full Operational Control',
      comments: '',
      gridElectricity: sub ? Math.round(sub.elec * 0.4) : 0,
      landlordElectricity: sub ? Math.round(sub.elec * 0.6) : 0,
      tenantElectricity: selectedProperty.code === "SG-18ROB" ? 31200 : 0,
      electricityUnit: 'kWh',
      billAmount: 0,
      domesticWater: sub ? Math.round(sub.water * 0.5) : 0,
      irrigationWater: sub ? Math.round(sub.water * 0.2) : 0,
      coolingWater: sub ? Math.round(sub.water * 0.3) : 0,
      processWater: selectedProperty.code === "MY-HYPAK" ? 890 : 0,
      newater: selectedProperty.code === "SG-18ROB" || selectedProperty.code === "AU-ROLP" ? 340 : 0,
      rainwater: selectedProperty.code === "SG-18ROB" ? 12 : 0,
      naturalGas: sub ? sub.gas : 0,
      townGas: selectedProperty.code === "SG-FRRP" ? 680 : 0,
      diesel: 240,
      generalWaste: sub ? sub.waste : 0,
      foodWaste: selectedProperty.segment === "Hospitality" ? 1200 : 0,
      plasticWaste: 0,
      glassWaste: 0,
      paperWaste: 0,
      containersForChange: selectedProperty.code === "AU-ROLP" ? 45 : 0,
      paperReams: 0,
      recyclingPlastic: 0,
      recyclingMetal: 0,
      recyclingGlass: 0,
      compostProcessed: selectedProperty.segment === "Hospitality" ? 340 : 0,
      confirmCheck: false,
      uploadedDocuments: [
        { name: "Electricity_Bill_May2026.pdf", size: "2.4 MB", date: "18 May 2026" },
        { name: "Water_Bill_May2026.pdf", size: "1.1 MB", date: "18 May 2026" }
      ]
    };
  }, [selectedProperty, submissions]);

  const [formValues, setFormValues] = useState(initialValues);


  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileRemove = (index) => {
    setFormValues(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index)
    }));
    triggerToast("Document removed successfully.", "info");
  };

  const handleFileUploadMock = () => {
    const mockFiles = [
      { name: "Diesel_Receipt_May2026.png", size: "840 KB", date: "21 May 2026" },
      { name: "Waste_Logs_May2026.xlsx", size: "1.8 MB", date: "21 May 2026" }
    ];
    const nextFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (formValues.uploadedDocuments.some(d => d.name === nextFile.name)) {
      triggerToast("File is already uploaded.", "warning");
      return;
    }
    setFormValues(prev => ({
      ...prev,
      uploadedDocuments: [...prev.uploadedDocuments, nextFile]
    }));
    triggerToast(`File ${nextFile.name} uploaded successfully.`, "success");
  };

  // Real-time calculations
  const calculatedScope2 = useMemo(() => {
    let gridVal = Number(formValues.gridElectricity || 0);
    let landlordVal = Number(formValues.landlordElectricity || 0);
    if (formValues.electricityUnit === 'MWh') {
      gridVal *= 1000;
      landlordVal *= 1000;
    } else if (formValues.electricityUnit === 'GJ') {
      gridVal *= 277.78;
      landlordVal *= 277.78;
    }
    const factor = getGridEF(selectedProperty.country);
    return (((gridVal + landlordVal) * factor) / 1000).toFixed(2);
  }, [formValues.gridElectricity, formValues.landlordElectricity, formValues.electricityUnit, selectedProperty]);

  const gasKwhEquiv = useMemo(() => {
    return (Number(formValues.naturalGas) * 10.63).toFixed(2);
  }, [formValues.naturalGas]);

  const dieselKwhEquiv = useMemo(() => {
    return (Number(formValues.diesel) * 10.63).toFixed(2);
  }, [formValues.diesel]);

  const paperKgEquiv = useMemo(() => {
    return (Number(formValues.paperReams) * 2.5).toFixed(2);
  }, [formValues.paperReams]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Step Navigation Bar */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200">
        {FORM_TABS.map((tabName, idx) => (
          <button
            key={idx}
            onClick={() => setFormTab(idx)}
            className={`flex-1 min-w-[100px] py-4 px-3 flex flex-col items-center gap-1 border-b-4 text-xs transition-all ${
              formTab === idx 
                ? 'border-primary text-primary font-bold bg-primary/5' 
                : 'border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {idx === 0 ? 'info' :
               idx === 1 ? 'bolt' :
               idx === 2 ? 'water_drop' :
               idx === 3 ? 'local_fire_department' :
               idx === 4 ? 'delete_sweep' :
               idx === 5 ? 'recycling' :
               idx === 6 ? 'upload_file' : 'fact_check'}
            </span>
            <span className="font-label-caps tracking-wider uppercase font-semibold text-[10px]">{tabName}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-8 min-h-[400px]">
        
        {/* TAB 0: General */}
        {formTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-headline-sm text-headline-sm text-slate-800">Reporting Coverage</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Start Date</label>
                  <input 
                    type="date"
                    value={formValues.startDate}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">End Date</label>
                  <input 
                    type="date"
                    value={formValues.endDate}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Operational Control Structure</label>
                <select
                  value={formValues.controlType}
                  onChange={e => handleInputChange('controlType', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none"
                >
                  <option>Full Operational Control</option>
                  <option>Equity Share</option>
                  <option>Financial Control</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter notes..."
                  value={formValues.comments}
                  onChange={e => handleInputChange('comments', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center min-h-[220px]">
              <img 
                alt="Asset View"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXyP4KVdDz5b0KRsyAXowoDYAzKWwELQE_BVVIdNdNPfKBl-dDy32sFRozlwPqxj5PHfrfjR5zWK6RpgKOKpUOWKcF0Wuje2de2M4JqpDY79NBJBjafJGPzZO0hITmoLIzh2Sswc0sBiI-_BDp4ryw0qSIcpArcfD3xYwNY1EL0GSjUJqxIQXFwCXPql3pEak-5hyaVWZ5lxyzCvScEEG2XBH6lxkSrzoV5D_iEkNT2crOncTFeSAa75q4xO2OPqNeO1aFW9uzB0E"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2.5 rounded-lg backdrop-blur shadow-md border border-slate-200/50">
                <p className="font-label-caps text-[9px] font-bold text-primary tracking-widest uppercase">Live Asset Overview</p>
                <p className="font-headline-sm text-xs font-bold text-slate-800 mt-0.5">{selectedProperty.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Electricity */}
        {formTab === 1 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-[#F3EEFE]/30 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-slate-600">
                <span className="font-bold text-slate-800">Conversion Factors:</span> 1 MWh = 1,000 kWh, 1 GJ = 277.78 kWh.
                <span className="ml-4">Current sub-meter billing accuracy: <span className="font-data-table font-bold text-primary">Class 1.0</span>.</span>
              </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Electricity Management (col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-headline-sm text-slate-800 font-bold">Electricity Management</h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">GRID ELECTRICITY (COMMON AREA)</label>
                    <div className="flex w-full items-stretch">
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formValues.gridElectricity || ''}
                        onChange={e => handleInputChange('gridElectricity', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <select 
                        value={formValues.electricityUnit}
                        onChange={e => handleInputChange('electricityUnit', e.target.value)}
                        className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-3 py-3 text-xs font-bold flex-shrink-0 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                      >
                        <option>kWh</option>
                        <option>MWh</option>
                        <option>GJ</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-400">Total common area grid-consumed electricity.</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">LANDLORD ELECTRICITY</label>
                    <div className="flex w-full items-stretch">
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formValues.landlordElectricity || ''}
                        onChange={e => handleInputChange('landlordElectricity', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kWh</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Landlord shared services/HVAC central system consumption.</p>
                  </div>

                  {selectedProperty.code === "SG-18ROB" && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">TENANT ELECTRICITY (SUB-METERED)</label>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">PROPERTY SPECIFIC</span>
                      </div>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="Enter tenant total"
                          value={formValues.tenantElectricity || ''}
                          onChange={e => handleInputChange('tenantElectricity', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kWh</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Tenant sub-metered cumulative reporting.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Breakdown & Map/Location Context (col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-headline-sm text-slate-800 font-bold">Electricity Breakdown</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Grid Electricity */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Grid Electricity</p>
                        <p className="text-xs text-slate-400">Meter: E-GR-01</p>
                      </div>
                      <div className="text-right">
                        <p className="font-data-table font-bold text-slate-800 text-sm">
                          {(() => {
                            let val = Number(formValues.gridElectricity || 0);
                            if (formValues.electricityUnit === 'MWh') val *= 1000;
                            else if (formValues.electricityUnit === 'GJ') val *= 277.78;
                            return Math.round(val).toLocaleString();
                          })()} kWh
                        </p>
                        <p className="text-[10px] text-slate-400">Converted from {formValues.gridElectricity || 0} {formValues.electricityUnit}</p>
                      </div>
                    </div>

                    {/* Landlord Electricity */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Landlord Electricity</p>
                        <p className="text-xs text-slate-400">Meter: E-LL-01</p>
                      </div>
                      <div className="text-right">
                        <p className="font-data-table font-bold text-slate-800 text-sm">
                          {Number(formValues.landlordElectricity || 0).toLocaleString()} kWh
                        </p>
                      </div>
                    </div>

                    {/* Tenant Electricity */}
                    {selectedProperty.code === "SG-18ROB" && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-body-md font-bold text-slate-800">Tenant Electricity</p>
                          <p className="text-xs text-slate-400">Meter: E-TN-01</p>
                        </div>
                        <div className="text-right">
                          <p className="font-data-table font-bold text-slate-800 text-sm">
                            {Number(formValues.tenantElectricity || 0).toLocaleString()} kWh
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Grid Emission Factor */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/50">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Grid Emission Factor</p>
                        <p className="text-xs text-slate-400">Region: {selectedProperty.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-data-table font-bold text-primary text-sm">
                          {getGridEF(selectedProperty.country)} kgCO2e/kWh
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <span className="font-label-caps text-primary font-bold text-xs tracking-wider">TOTAL SCOPE 2</span>
                    <span className="font-data-table font-bold text-primary text-base">
                      {calculatedScope2} tCO2e
                    </span>
                  </div>
                </div>

                {/* Map/Location Placeholder for Context */}
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] relative group shadow-sm">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="A clean, top-down architectural layout of a modern sustainable building floorplan" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3BqxoD8TgVrm8gKcwyKsPqEVKF-XPtUEqIrFx46eVGgJqhpYip40HkK8T9O1F2fKeOrH6gXkxj01KGbTGzYeXHvFkkWRdxt5_k3OITDKCYKgBYq66kFNko_jiWIySvS-2aqeOoekX_eVcxTFc7LDsk1kWLET6umVdoI8RjKxaVBvMTBrAmsLzLFENn0a3ijuUHXrILNsFl_boCGNkNB_6h51DcTb3oKLOsNq5f54UA4EDf5LCDCvQxpmUyyrOSYYPiukOw-Xcq7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">Site: {selectedProperty.name}</p>
                    <p className="text-white/70 text-xs">{selectedProperty.country === "Singapore" ? "Singapore CBD" : selectedProperty.country === "Australia" ? "Western Australia" : "Asia-Pacific Region"}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold shadow-sm text-slate-800">
                    GPS: {selectedProperty.code === "SG-18ROB" ? "1.2823° N, 103.8507° E" : selectedProperty.code === "AU-ROLP" ? "31.9505° S, 115.8605° E" : "1.2902° N, 103.8519° E"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Water */}
        {formTab === 2 && (
          <div className="space-y-6">
            {/* Warning Banner */}
            <div className="bg-[#F3EEFE]/30 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-slate-600">
                <span className="font-bold text-slate-800">Conversion Factor:</span> 1 m³ = 1,000 Liters. 
                <span className="ml-4">Current submission intensity: <span className="font-data-table font-bold text-primary">2.4 m³/FTE</span>.</span>
              </p>
              <button 
                type="button" 
                className="ml-auto text-primary font-bold text-body-sm hover:underline"
                onClick={() => triggerToast("Threshold ranges: Green < 2.0, Amber 2.0 - 3.5, Red > 3.5 m³/FTE", "info")}
              >
                View Thresholds
              </button>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Water Management (col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-headline-sm text-slate-800 font-bold">Water Management</h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">POTABLE WATER USAGE</label>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          readOnly
                          value={(Number(formValues.domesticWater) + Number(formValues.irrigationWater) + Number(formValues.coolingWater)).toFixed(2)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg bg-slate-50 cursor-not-allowed text-slate-600 outline-none"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Reflects main municipal meter reading (sum of sub-meters).</p>
                    </div>

                    {(selectedProperty.country === "Singapore" || selectedProperty.code === "SG-18ROB") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">NEWater USAGE</label>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">SG STANDARD</span>
                        </div>
                        <div className="flex w-full items-stretch">
                          <input 
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formValues.newater || ''}
                            onChange={e => handleInputChange('newater', e.target.value)}
                            className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                          <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                        </div>
                        <p className="text-[11px] text-slate-400">High-grade reclaimed water usage.</p>
                      </div>
                    )}

                    {(selectedProperty.code === "MY-HYPAK" || selectedProperty.country === "Malaysia") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">PROCESS WATER USAGE</label>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">PROCESS SPECIFIC</span>
                        </div>
                        <div className="flex w-full items-stretch">
                          <input 
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formValues.processWater || ''}
                            onChange={e => handleInputChange('processWater', e.target.value)}
                            className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                          <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Industrial process water usage.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider block">RAINWATER HARVESTING</label>
                    <div className="flex w-full items-stretch max-w-[280px]">
                      <input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formValues.rainwater || ''}
                        onChange={e => handleInputChange('rainwater', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Rainwater captured and utilized on-site.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Destination Breakdown & Map/Location Context (col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-headline-sm text-slate-800 font-bold">Destination Breakdown</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* HVAC / Cooling Towers */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">HVAC / Cooling Towers</p>
                        <p className="text-xs text-slate-400">Meter: M-CT-01</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.coolingWater || ''}
                          onChange={e => handleInputChange('coolingWater', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">m³</span>
                      </div>
                    </div>

                    {/* Ablution & General */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Ablution &amp; General</p>
                        <p className="text-xs text-slate-400">Meter: M-WC-01-20</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.domesticWater || ''}
                          onChange={e => handleInputChange('domesticWater', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">m³</span>
                      </div>
                    </div>

                    {/* Landscaping */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Landscaping</p>
                        <p className="text-xs text-slate-400">Meter: M-LS-01</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.irrigationWater || ''}
                          onChange={e => handleInputChange('irrigationWater', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">m³</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <span className="font-label-caps text-primary font-bold text-xs tracking-wider">RECONCILED TOTAL</span>
                    <span className="font-data-table font-bold text-primary text-base">
                      {(Number(formValues.domesticWater) + Number(formValues.irrigationWater) + Number(formValues.coolingWater)).toFixed(2)} m³
                    </span>
                  </div>
                </div>

                {/* Map/Location Placeholder for Context */}
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] relative group shadow-sm">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="A clean, top-down architectural layout of a modern sustainable building floorplan" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3BqxoD8TgVrm8gKcwyKsPqEVKF-XPtUEqIrFx46eVGgJqhpYip40HkK8T9O1F2fKeOrH6gXkxj01KGbTGzYeXHvFkkWRdxt5_k3OITDKCYKgBYq66kFNko_jiWIySvS-2aqeOoekX_eVcxTFc7LDsk1kWLET6umVdoI8RjKxaVBvMTBrAmsLzLFENn0a3ijuUHXrILNsFl_boCGNkNB_6h51DcTb3oKLOsNq5f54UA4EDf5LCDCvQxpmUyyrOSYYPiukOw-Xcq7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">Site: {selectedProperty.name}</p>
                    <p className="text-white/70 text-xs">{selectedProperty.country === "Singapore" ? "Singapore CBD" : selectedProperty.country === "Australia" ? "Western Australia" : "Asia-Pacific Region"}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold shadow-sm text-slate-800">
                    GPS: {selectedProperty.code === "SG-18ROB" ? "1.2823° N, 103.8507° E" : selectedProperty.code === "AU-ROLP" ? "31.9505° S, 115.8605° E" : "1.2902° N, 103.8519° E"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Fuel */}
        {formTab === 3 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-[#F3EEFE]/30 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-slate-600">
                <span className="font-bold text-slate-800">Conversion Factors:</span> 1 m³ Natural Gas ≈ 10.63 kWh, 1 Litre Diesel ≈ 10.63 kWh.
                <span className="ml-4">Reporting standard: <span className="font-data-table font-bold text-primary">GRI 302-1</span>.</span>
              </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Stationary Combustibles Management (col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-headline-sm text-slate-800 font-bold">Stationary Combustibles Management</h3>
                </div>
                <div className="p-8 space-y-6">
                  {/* Natural Gas Input */}
                  {(selectedProperty.country === "Australia" || selectedProperty.country === "China" || selectedProperty.code === "SG-FRRP") ? (
                    <div className="space-y-2">
                      <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">NATURAL GAS CONSUMPTION</label>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formValues.naturalGas || ''}
                          onChange={e => handleInputChange('naturalGas', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Total natural gas volume consumed for heating/cooling systems.</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                      Natural Gas connection is not registered for {selectedProperty.name}.
                    </div>
                  )}

                  {/* Town Gas Input */}
                  {selectedProperty.code === "SG-FRRP" && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">TOWN GAS (TENANT LEASED ASSETS)</label>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">PROPERTY SPECIFIC</span>
                      </div>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formValues.townGas || ''}
                          onChange={e => handleInputChange('townGas', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">m³</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Tenant-shared utilities reporting for town gas.</p>
                    </div>
                  )}

                  {/* Diesel Input */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">DIESEL FUEL (GENERATORS)</label>
                    <div className="flex w-full items-stretch">
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formValues.diesel || ''}
                        onChange={e => handleInputChange('diesel', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">Litres</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Diesel volume consumed for emergency power generator backup.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Energy Breakdown & Map/Location Context (col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-headline-sm text-slate-800 font-bold">Energy Breakdown</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Natural Gas Breakdown */}
                    {(selectedProperty.country === "Australia" || selectedProperty.country === "China" || selectedProperty.code === "SG-FRRP") && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-body-md font-bold text-slate-800">Natural Gas Energy</p>
                          <p className="text-xs text-slate-400">Gas Equivalent</p>
                        </div>
                        <div className="text-right">
                          <p className="font-data-table font-bold text-slate-800 text-sm">
                            {Number(gasKwhEquiv).toLocaleString()} kWh
                          </p>
                          <p className="text-[10px] text-slate-400">Converted from {formValues.naturalGas || 0} m³</p>
                        </div>
                      </div>
                    )}

                    {/* Town Gas Breakdown */}
                    {selectedProperty.code === "SG-FRRP" && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-body-md font-bold text-slate-800">Town Gas Energy</p>
                          <p className="text-xs text-slate-400">Tenant Equivalent</p>
                        </div>
                        <div className="text-right">
                          <p className="font-data-table font-bold text-slate-800 text-sm">
                            {(Number(formValues.townGas || 0) * 10.63).toFixed(2).toLocaleString()} kWh
                          </p>
                          <p className="text-[10px] text-slate-400">Converted from {formValues.townGas || 0} m³</p>
                        </div>
                      </div>
                    )}

                    {/* Diesel Breakdown */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Diesel Fuel Energy</p>
                        <p className="text-xs text-slate-400">Generator Equivalent</p>
                      </div>
                      <div className="text-right">
                        <p className="font-data-table font-bold text-slate-800 text-sm">
                          {Number(dieselKwhEquiv).toLocaleString()} kWh
                        </p>
                        <p className="text-[10px] text-slate-400">Converted from {formValues.diesel || 0} Litres</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <span className="font-label-caps text-primary font-bold text-xs tracking-wider">TOTAL ENERGY</span>
                    <span className="font-data-table font-bold text-primary text-base">
                      {(() => {
                        let total = Number(dieselKwhEquiv) + Number(gasKwhEquiv);
                        if (selectedProperty.code === "SG-FRRP") {
                          total += Number(formValues.townGas || 0) * 10.63;
                        }
                        return total.toFixed(2);
                      })()} kWh eq.
                    </span>
                  </div>
                </div>

                {/* Map/Location Placeholder for Context */}
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] relative group shadow-sm">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="A clean, top-down architectural layout of a modern sustainable building floorplan" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3BqxoD8TgVrm8gKcwyKsPqEVKF-XPtUEqIrFx46eVGgJqhpYip40HkK8T9O1F2fKeOrH6gXkxj01KGbTGzYeXHvFkkWRdxt5_k3OITDKCYKgBYq66kFNko_jiWIySvS-2aqeOoekX_eVcxTFc7LDsk1kWLET6umVdoI8RjKxaVBvMTBrAmsLzLFENn0a3ijuUHXrILNsFl_boCGNkNB_6h51DcTb3oKLOsNq5f54UA4EDf5LCDCvQxpmUyyrOSYYPiukOw-Xcq7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">Site: {selectedProperty.name}</p>
                    <p className="text-white/70 text-xs">{selectedProperty.country === "Singapore" ? "Singapore CBD" : selectedProperty.country === "Australia" ? "Western Australia" : "Asia-Pacific Region"}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold shadow-sm text-slate-800">
                    GPS: {selectedProperty.code === "SG-18ROB" ? "1.2823° N, 103.8507° E" : selectedProperty.code === "AU-ROLP" ? "31.9505° S, 115.8605° E" : "1.2902° N, 103.8519° E"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Waste */}
        {formTab === 4 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-[#F3EEFE]/30 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-slate-600">
                <span className="font-bold text-slate-800">Waste Log Standard:</span> Operational waste reporting aligned with ESG benchmarks.
                <span className="ml-4">Diversion Target: <span className="font-data-table font-bold text-primary">60% minimum</span>.</span>
              </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Waste Management (col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-headline-sm text-slate-800 font-bold">Operational Waste Log</h3>
                </div>
                <div className="p-8 space-y-6">
                  {/* General Waste */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">GENERAL UNSORTED SOLID WASTE</label>
                    <div className="flex w-full items-stretch">
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formValues.generalWaste || ''}
                        onChange={e => handleInputChange('generalWaste', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kg</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Total weight of unsorted landfill-directed operational waste.</p>
                  </div>

                  {/* Food Waste */}
                  {selectedProperty.segment === "Hospitality" && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">FOOD WASTE (SEPARATE COLLECTION)</label>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">PROPERTY SPECIFIC</span>
                      </div>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formValues.foodWaste || ''}
                          onChange={e => handleInputChange('foodWaste', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kg</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Organic and food waste gathered for composting.</p>
                    </div>
                  )}

                  {/* Containers for Change */}
                  {selectedProperty.code === "AU-ROLP" && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">CONTAINERS FOR CHANGE SCHEME</label>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">REGIONAL SCHEME</span>
                      </div>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formValues.containersForChange || ''}
                          onChange={e => handleInputChange('containersForChange', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kg</span>
                      </div>
                      <p className="text-[11px] text-slate-400">State-run container deposit scheme return weight (mixed glass/plastic).</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Sorted Recycling & Map/Location Context (col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-headline-sm text-slate-800 font-bold">Sorted Recycling Breakdown</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Plastic Waste */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Plastic Waste</p>
                        <p className="text-xs text-slate-400">Category: Recyclable</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.plasticWaste || ''}
                          onChange={e => handleInputChange('plasticWaste', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>

                    {/* Glass Waste */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Glass Waste</p>
                        <p className="text-xs text-slate-400">Category: Recyclable</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.glassWaste || ''}
                          onChange={e => handleInputChange('glassWaste', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>

                    {/* Paper Waste */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Paper Waste</p>
                        <p className="text-xs text-slate-400">Category: Recyclable</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.paperWaste || ''}
                          onChange={e => handleInputChange('paperWaste', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>

                    {selectedProperty.code === "AU-ROLP" && (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed rounded-lg">
                        ⚠️ <strong>Compliance note:</strong> Plastic waste should be classified under recycled plastic. Food waste should be classified under recycling - compost processed.
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <span className="font-label-caps text-primary font-bold text-xs tracking-wider">TOTAL WASTE LOGGED</span>
                    <span className="font-data-table font-bold text-primary text-base">
                      {(
                        Number(formValues.generalWaste || 0) +
                        Number(formValues.foodWaste || 0) +
                        Number(formValues.containersForChange || 0) +
                        Number(formValues.plasticWaste || 0) +
                        Number(formValues.glassWaste || 0) +
                        Number(formValues.paperWaste || 0)
                      ).toFixed(2)} kg
                    </span>
                  </div>
                </div>

                {/* Map/Location Placeholder for Context */}
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] relative group shadow-sm">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="A clean, top-down architectural layout of a modern sustainable building floorplan" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3BqxoD8TgVrm8gKcwyKsPqEVKF-XPtUEqIrFx46eVGgJqhpYip40HkK8T9O1F2fKeOrH6gXkxj01KGbTGzYeXHvFkkWRdxt5_k3OITDKCYKgBYq66kFNko_jiWIySvS-2aqeOoekX_eVcxTFc7LDsk1kWLET6umVdoI8RjKxaVBvMTBrAmsLzLFENn0a3ijuUHXrILNsFl_boCGNkNB_6h51DcTb3oKLOsNq5f54UA4EDf5LCDCvQxpmUyyrOSYYPiukOw-Xcq7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">Site: {selectedProperty.name}</p>
                    <p className="text-white/70 text-xs">{selectedProperty.country === "Singapore" ? "Singapore CBD" : selectedProperty.country === "Australia" ? "Western Australia" : "Asia-Pacific Region"}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold shadow-sm text-slate-800">
                    GPS: {selectedProperty.code === "SG-18ROB" ? "1.2823° N, 103.8507° E" : selectedProperty.code === "AU-ROLP" ? "31.9505° S, 115.8605° E" : "1.2902° N, 103.8519° E"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Recycling */}
        {formTab === 5 && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-[#F3EEFE]/30 border border-primary/20 rounded-lg p-4 mb-6 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-slate-600">
                <span className="font-bold text-slate-800">Recycling Metric:</span> Paper conversion uses 2.5 kg per ream. 
                <span className="ml-4">Audited by: <span className="font-data-table font-bold text-primary">Green Circle Certifications</span>.</span>
              </p>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Diverted Waste & Consumption (col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-headline-sm text-slate-800 font-bold">Diverted Waste &amp; Consumption</h3>
                </div>
                <div className="p-8 space-y-6">
                  {/* Office Paper Consumption */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">OFFICE PAPER CONSUMPTION</label>
                    <div className="flex w-full items-stretch">
                      <input 
                        type="number"
                        placeholder="0.00"
                        value={formValues.paperReams || ''}
                        onChange={e => handleInputChange('paperReams', e.target.value)}
                        className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">Reams</span>
                    </div>
                    {formValues.paperReams > 0 && (
                      <p className="text-xs text-primary font-bold bg-primary/5 border border-primary/10 px-3 py-1.5 rounded flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-xs">sync</span>
                        Weight conversion: {paperKgEquiv} kg (1 ream ≈ 2.5 kg)
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">Total paper supply reams purchased and consumed.</p>
                  </div>

                  {/* Compost Processed */}
                  {selectedProperty.segment === "Hospitality" && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-xs font-bold text-slate-500 tracking-wider">COMPOST PROCESSED (ON-SITE / DIVERTED)</label>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tighter uppercase font-bold">PROPERTY SPECIFIC</span>
                      </div>
                      <div className="flex w-full items-stretch">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formValues.compostProcessed || ''}
                          onChange={e => handleInputChange('compostProcessed', e.target.value)}
                          className="flex-1 min-w-0 border border-slate-200 rounded-l-lg px-4 py-3 font-data-table text-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-4 py-3 font-label-caps text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">kg</span>
                      </div>
                      <p className="text-[11px] text-slate-400">On-site processing of organic solid food waste into compost fertilizer.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Recycling Raw Commodities & Map/Location Context (col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-headline-sm text-slate-800 font-bold">Recycling Raw Commodities</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Recycled Plastics */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Recycled Plastics</p>
                        <p className="text-xs text-slate-400">Commodity Code: PET/HDPE</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.recyclingPlastic || ''}
                          onChange={e => handleInputChange('recyclingPlastic', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>

                    {/* Recycled Metals */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Recycled Metals</p>
                        <p className="text-xs text-slate-400">Commodity Code: AL/FE</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.recyclingMetal || ''}
                          onChange={e => handleInputChange('recyclingMetal', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>

                    {/* Recycled Glass */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary transition-all">
                      <div>
                        <p className="font-body-md font-bold text-slate-800">Recycled Glass</p>
                        <p className="text-xs text-slate-400">Commodity Code: GL-01</p>
                      </div>
                      <div className="flex items-center gap-2 max-w-[130px] w-full">
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formValues.recyclingGlass || ''}
                          onChange={e => handleInputChange('recyclingGlass', e.target.value)}
                          className="w-full min-w-0 text-right font-data-table font-bold border border-slate-200 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                    <span className="font-label-caps text-primary font-bold text-xs tracking-wider">TOTAL DIVERTED WASTE</span>
                    <span className="font-data-table font-bold text-primary text-base">
                      {(
                        Number(formValues.compostProcessed || 0) +
                        Number(formValues.recyclingPlastic || 0) +
                        Number(formValues.recyclingMetal || 0) +
                        Number(formValues.recyclingGlass || 0) +
                        (Number(formValues.paperReams || 0) * 2.5)
                      ).toFixed(2)} kg
                    </span>
                  </div>
                </div>

                {/* Map/Location Placeholder for Context */}
                <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] relative group shadow-sm">
                  <img 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    alt="A clean, top-down architectural layout of a modern sustainable building floorplan" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3BqxoD8TgVrm8gKcwyKsPqEVKF-XPtUEqIrFx46eVGgJqhpYip40HkK8T9O1F2fKeOrH6gXkxj01KGbTGzYeXHvFkkWRdxt5_k3OITDKCYKgBYq66kFNko_jiWIySvS-2aqeOoekX_eVcxTFc7LDsk1kWLET6umVdoI8RjKxaVBvMTBrAmsLzLFENn0a3ijuUHXrILNsFl_boCGNkNB_6h51DcTb3oKLOsNq5f54UA4EDf5LCDCvQxpmUyyrOSYYPiukOw-Xcq7Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">Site: {selectedProperty.name}</p>
                    <p className="text-white/70 text-xs">{selectedProperty.country === "Singapore" ? "Singapore CBD" : selectedProperty.country === "Australia" ? "Western Australia" : "Asia-Pacific Region"}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold shadow-sm text-slate-800">
                    GPS: {selectedProperty.code === "SG-18ROB" ? "1.2823° N, 103.8507° E" : selectedProperty.code === "AU-ROLP" ? "31.9505° S, 115.8605° E" : "1.2902° N, 103.8519° E"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Documents */}
        {formTab === 6 && (
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <h4 className="font-headline-sm text-headline-sm text-slate-800">Audit &amp; Compliance Evidence</h4>
            <p className="text-slate-500 text-xs">Upload utility invoices, garbage disposal certificates, and delivery receipts.</p>
            
            <div 
              onClick={handleFileUploadMock}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-12 hover:border-primary hover:bg-primary-container/5 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-6xl text-slate-400 group-hover:text-primary transition-colors">cloud_upload</span>
              <p className="font-headline-sm text-slate-700 mt-3 font-semibold">Click to select files or drag-and-drop</p>
              <p className="text-slate-400 text-xs mt-1">PDF, XLSX, PNG, JPG (Max 25MB per file)</p>
            </div>

            {formValues.uploadedDocuments.length === 0 && (
              <div className="flex items-center justify-center gap-2 text-rose-600 animate-pulse text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-sm">warning</span>
                At least one invoice document is required for verification
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-600 block">Uploaded Files ({formValues.uploadedDocuments.length})</label>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                {formValues.uploadedDocuments.map((doc, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">description</span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.size} · Uploaded {doc.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFileRemove(idx)}
                      className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Review & Submit */}
        {formTab === 7 && (
          <div className="space-y-6">
            <h4 className="font-headline-sm text-headline-sm text-slate-800">Submission Audit Summary</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Electricity Usage</div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Landlord Common</span>
                    <span className="font-data-table text-slate-800">{Number(formValues.landlordElectricity).toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Grid Common</span>
                    <span className="font-data-table text-slate-800">{Number(formValues.gridElectricity).toLocaleString()} kWh</span>
                  </div>
                  {selectedProperty.code === "SG-18ROB" && (
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Tenant Submeter</span>
                      <span className="font-data-table text-slate-800">{Number(formValues.tenantElectricity).toLocaleString()} kWh</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Water Management</div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Potable Water</span>
                    <span className="font-data-table text-slate-800">{Number(formValues.domesticWater).toLocaleString()} m³</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Cooling &amp; Irrigation</span>
                    <span className="font-data-table text-slate-800">{(Number(formValues.coolingWater) + Number(formValues.irrigationWater)).toLocaleString()} m³</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Scope Metrics</div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Scope 1 YTD</span>
                    <span className="font-data-table text-slate-800">{(Number(formValues.naturalGas) * 0.002).toFixed(2)} tCO2e</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Scope 2 Location-based</span>
                    <span className="font-data-table text-slate-800 text-primary font-bold">{calculatedScope2} tCO2e</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="confirmCheck"
                  checked={formValues.confirmCheck}
                  onChange={e => handleInputChange('confirmCheck', e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="confirmCheck" className="text-xs font-semibold text-slate-600 leading-relaxed cursor-pointer">
                  I hereby certify that the data submitted above for <strong className="text-slate-800">{selectedProperty.name}</strong> is accurate and supported by valid evidence for the period of May 2026. I understand that once submitted, this data will be locked for auditing purposes.
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => onSubmitFinal(formValues)}
                  className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Submit &amp; Lock Final Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Prev / Next controls */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => setFormTab(prev => Math.max(0, prev - 1))} 
          disabled={formTab === 0}
          className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all"
        >
          &larr; Previous
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onSaveDraft(formValues)}
            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            Save Draft
          </button>
          
          {formTab < 7 ? (
            <button 
              onClick={() => setFormTab(prev => Math.min(7, prev + 1))}
              className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Next &rarr;
            </button>
          ) : (
            <button 
              onClick={() => onSubmitFinal(formValues)}
              className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Submit &amp; Lock
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// MAIN COMPONENT ENTRY POINT
// ==========================================
export default function App() {
  const [role, setRole] = useState('bm'); // bm, rm, sm
  const [page, setPage] = useState('dashboard'); // dashboard, form, history, outstanding, escalation, submissions, master, amendments
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const triggerToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  // Sync role color schemes to standard CSS variables in _document.jsx
  useEffect(() => {
    const root = document.documentElement;
    if (role === 'bm') {
      root.style.setProperty('--primary', '#1e40af'); // blue-800
      root.style.setProperty('--on-primary', '#ffffff');
      root.style.setProperty('--primary-container', '#3b82f6');
      root.style.setProperty('--on-primary-container', '#eff6ff');
      root.style.setProperty('--secondary-container', '#dbeafe');
      root.style.setProperty('--on-secondary-container', '#1e3a8a');
      root.style.setProperty('--background', '#f1f5f9');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-dim', '#f8fafc');
      root.style.setProperty('--surface-container-low', '#f1f5f9');
      root.style.setProperty('--surface-container', '#e2e8f0');
      root.style.setProperty('--surface-container-high', '#cbd5e1');
      root.style.setProperty('--surface-container-highest', '#94a3b8');
    } else if (role === 'rm') {
      root.style.setProperty('--primary', '#4f378a'); // purple-800
      root.style.setProperty('--on-primary', '#ffffff');
      root.style.setProperty('--primary-container', '#6750a4');
      root.style.setProperty('--on-primary-container', '#e0d2ff');
      root.style.setProperty('--secondary-container', '#e1d4fd');
      root.style.setProperty('--on-secondary-container', '#645a7d');
      root.style.setProperty('--background', '#f8fafc');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-dim', '#fdf7ff');
      root.style.setProperty('--surface-container-low', '#f8f2fa');
      root.style.setProperty('--surface-container', '#f2ecf4');
      root.style.setProperty('--surface-container-high', '#ece6ee');
      root.style.setProperty('--surface-container-highest', '#e6e0e9');
    } else if (role === 'sm') {
      root.style.setProperty('--primary', '#047857'); // emerald-700
      root.style.setProperty('--on-primary', '#ffffff');
      root.style.setProperty('--primary-container', '#059669');
      root.style.setProperty('--on-primary-container', '#ecfdf5');
      root.style.setProperty('--secondary-container', '#d1fae5');
      root.style.setProperty('--on-secondary-container', '#064e3b');
      root.style.setProperty('--background', '#f1f5f9');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-dim', '#f0fdf4');
      root.style.setProperty('--surface-container-low', '#e6f4ea');
      root.style.setProperty('--surface-container', '#d2ebd9');
      root.style.setProperty('--surface-container-high', '#b8dfc4');
      root.style.setProperty('--surface-container-highest', '#96cdab');
    }
  }, [role]);

  const handleSaveDraft = (formValues) => {
    const totalElec = Number(formValues.gridElectricity) + Number(formValues.landlordElectricity);
    const totalWater = Number(formValues.domesticWater) + Number(formValues.irrigationWater) + Number(formValues.coolingWater);
    const totalWaste = Number(formValues.generalWaste);

    setSubmissions(prev => prev.map(s => {
      if (s.propertyId === selectedProperty.id && s.period === "May 2026") {
        return {
          ...s,
          elec: totalElec || s.elec,
          water: totalWater || s.water,
          gas: Number(formValues.naturalGas) || s.gas,
          waste: totalWaste || s.waste,
          status: 'draft'
        };
      }
      return s;
    }));
    triggerToast(`Draft saved for ${selectedProperty.name}.`, "success");
  };

  const handleSubmitFinal = (formValues) => {
    if (!formValues.confirmCheck) {
      triggerToast("Please check the confirmation box to certify accuracy.", "warning");
      return;
    }
    if (formValues.uploadedDocuments.length === 0) {
      triggerToast("Submission requires at least one supporting document.", "error");
      return;
    }

    const totalElec = Number(formValues.gridElectricity) + Number(formValues.landlordElectricity);
    const totalWater = Number(formValues.domesticWater) + Number(formValues.irrigationWater) + Number(formValues.coolingWater);
    const totalWaste = Number(formValues.generalWaste);

    setSubmissions(prev => prev.map(s => {
      if (s.propertyId === selectedProperty.id && s.period === "May 2026") {
        return {
          ...s,
          elec: totalElec,
          water: totalWater,
          gas: Number(formValues.naturalGas),
          waste: totalWaste,
          status: 'locked',
          submittedOn: '21 May 2026',
          daysOverdue: 0
        };
      }
      return s;
    }));

    triggerToast(`Submission for ${selectedProperty.name} has been submitted & locked.`, "success");
    setPage('dashboard');
  };

  const handleUnlockSubmission = (propertyId) => {
    setSubmissions(prev => prev.map(s => {
      if (s.propertyId === propertyId && s.period === "May 2026") {
        return { ...s, status: 'draft' };
      }
      return s;
    }));
    const p = PROPERTIES.find(prop => prop.id === propertyId);
    triggerToast(`Unlocked ${p?.name} for amendments.`, "info");
  };

  const handleEscalateProperty = (propertyName) => {
    triggerToast(`Escalation sequence initiated for ${propertyName}. Notification sent to manager.`, "info");
  };

  const handleRemindProperty = (propertyName) => {
    triggerToast(`Nudge reminder sent to Building Manager of ${propertyName}.`, "success");
  };

  // Filters and Counts
  const currentSubs = useMemo(() => {
    return submissions.map(s => ({
      ...s,
      property: PROPERTIES.find(p => p.id === s.propertyId)
    }));
  }, [submissions]);

  // Sidebar navigation configuration
  const navItems = {
    bm: [
      { id: "dashboard", label: "My Submissions", icon: "dashboard" },
      { id: "form", label: "New Submission", icon: "edit_note" },
      { id: "history", label: "Submission History", icon: "history" }
    ],
    rm: [
      { id: "dashboard", label: "Compliance Dashboard", icon: "analytics" },
      { id: "outstanding", label: "Outstanding Submissions", icon: "pending_actions" },
      { id: "escalation", label: "Escalation Log", icon: "rule" }
    ],
    sm: [
      { id: "dashboard", label: "Portfolio Overview", icon: "dashboard" },
      { id: "submissions", label: "All Submissions", icon: "assessment" },
      { id: "master", label: "Master Data", icon: "settings" },
      { id: "amendments", label: "Amendment Log", icon: "history_edu" }
    ]
  };

  const statusCounts = useMemo(() => {
    let locked = 0, submitted = 0, draft = 0, overdue = 0;
    submissions.forEach(s => {
      if (s.status === 'locked') locked++;
      else if (s.status === 'submitted') submitted++;
      else if (s.status === 'draft') draft++;
      else if (s.status === 'overdue') overdue++;
    });
    return { locked, submitted, draft, overdue, total: submissions.length };
  }, [submissions]);

  // Dynamic filter for global search across grids
  const searchFilter = (itemText) => {
    if (!globalSearch) return true;
    return itemText.toLowerCase().includes(globalSearch.toLowerCase());
  };

  return (
    <div className="min-h-screen flex bg-slate-100/50">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 flex flex-col p-4 z-50 border-r border-slate-800">
        <div className="mb-8 px-2">
          <h1 className="font-headline-md text-headline-md font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">domain</span>
            TSH Group
          </h1>
          <p className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest mt-1">ESG Management Platform</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems[role].map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 active:scale-98 text-left ${
                page === item.id 
                  ? 'bg-primary text-white font-bold' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Toggle & Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Access Role</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">swap_horiz</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {['bm', 'rm', 'sm'].map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setPage('dashboard'); }}
                  className={`py-1 text-[10px] font-extrabold uppercase rounded transition-all ${
                    role === r 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-primary mt-2 text-center">
              {role === 'bm' ? 'Building Manager' : role === 'rm' ? 'Reporting Manager' : 'Sustainability Manager'}
            </p>
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg">
            <img 
              alt="User Profile" 
              className="w-8 h-8 rounded-full border border-slate-700" 
              src={role === 'bm' 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBXyP4KVdDz5b0KRsyAXowoDYAzKWwELQE_BVVIdNdNPfKBl-dDy32sFRozlwPqxj5PHfrfjR5zWK6RpgKOKpUOWKcF0Wuje2de2M4JqpDY79NBJBjafJGPzZO0hITmoLIzh2Sswc0sBiI-_BDp4ryw0qSIcpArcfD3xYwNY1EL0GSjUJqxIQXFwCXPql3pEak-5hyaVWZ5lxyzCvScEEG2XBH6lxkSrzoV5D_iEkNT2crOncTFeSAa75q4xO2OPqNeO1aFW9uzB0E"
                : role === 'rm'
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBtgIN5x5AbAVPNpUFfJpYu1t8rWD83GA5j6zPeIOOpoeokqTC7qDEZwyJP1xTlCBUDolv2oIGmZ6UaP4XENtMBsbRA2jGgmqxrQ9zps20R-XsZo6OX9kLrQAYD86gYuOz8jDdzWTepN2kTcIK7obiVFVybR_BYoQ1uVoZh9gyddy5IwxXhaZ5ckb7vQOezwnZ0-E--CCZN-yPzd_5pPLENBppNj99v5Ih9Q8aDksG0_ktyPwRXk8cvNXMXp6ZGXns7oibsU_v66Ng"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuBkl_Xzd84a_p1qQzN6wNryHWrHtasLtsvYE9I_PWEOYpUa8131nhf9CWhs4vc4IBNw4GARraBVMBVyd3awEjGAWtb0dok8JynijI8n7j6a6G7YupgpTeUhX-CIGR4IxwLA_d8ODPvHoqTepFmnVqKYH68qg4UStkITK0Vlcibmi73yrTsSFcUmPWBTeGd_z_2lWGsWMlbP75recfJJu3eNwk3O14kHphdXEdCQRWUXvYt19C9qAAN8m5NNx3S9NeH0gbY93bov2ns"
              }
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{role === 'bm' ? 'John Tan' : role === 'rm' ? 'Sarah Jenkins' : 'Michael Chen'}</p>
              <p className="text-[10px] text-slate-500 truncate">tsh-group.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-3.5 flex justify-between items-center z-40">
          <div className="flex items-center gap-4">
            <span className="font-headline-sm text-headline-sm font-extrabold text-slate-800">ESG Platform</span>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <span className="text-xs font-bold text-primary bg-primary-container/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {role === 'bm' ? 'Building Dashboard' : role === 'rm' ? 'Compliance Hub' : 'Portfolio Master'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search metrics..." 
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-full border-none focus:ring-2 focus:ring-primary w-60 text-xs font-body-md transition-all outline-none"
              />
            </div>

            <button 
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
              onClick={() => triggerToast("All systems operational. No unread notifications.", "success")}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="p-8 flex-1 max-w-[1600px] w-full mx-auto space-y-6">
          
          {/* ========================================================
              ROLE: BUILDING MANAGER (BM)
             ======================================================== */}
          {role === 'bm' && page === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Operational Submissions</h2>
                  <p className="text-slate-500 font-body-md mt-1">Review, log and lock utility usage data for May 2026 reporting cycle.</p>
                </div>
                <button 
                  onClick={() => { setPage('form'); }}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Submission
                </button>
              </div>

              {/* KPI Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Locked Submissions</span>
                    <span className="material-symbols-outlined text-emerald-600/30 group-hover:text-emerald-600 transition-colors">lock</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">{submissions.filter(s => s.status === 'locked').length}/10</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Submitted (Awaiting Lock)</span>
                    <span className="material-symbols-outlined text-indigo-600/30 group-hover:text-indigo-600 transition-colors">check_circle</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">{submissions.filter(s => s.status === 'submitted').length}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Draft / Pending</span>
                    <span className="material-symbols-outlined text-amber-500/30 group-hover:text-amber-500 transition-colors">pending_actions</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">{submissions.filter(s => s.status === 'draft').length}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Overdue Submissions</span>
                    <span className="material-symbols-outlined text-rose-600/30 group-hover:text-rose-600 transition-colors">warning</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-rose-600 tracking-tight font-data-table">{submissions.filter(s => s.status === 'overdue').length}</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-headline-sm text-headline-sm text-slate-800">My Submissions — May 2026</h3>
                  <div className="text-xs text-slate-400">Showing 10 of 10 properties</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left zebra-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Property Name</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Segment</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Reporting Status</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Electricity</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Water Volume</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Last Update</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                      {currentSubs.filter(s => searchFilter(s.property.name || '')).map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{sub.property.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{sub.property.code} · {sub.property.country}</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{sub.property.segment}</td>
                          <td className="px-6 py-4">
                            <span className={`status-pill ${
                              sub.status === 'locked' ? 'bg-emerald-100 text-emerald-800' :
                              sub.status === 'submitted' ? 'bg-indigo-100 text-indigo-800' :
                              sub.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              <span className={`status-dot ${
                                sub.status === 'locked' ? 'bg-emerald-600' :
                                sub.status === 'submitted' ? 'bg-indigo-600' :
                                sub.status === 'draft' ? 'bg-amber-500' :
                                'bg-rose-600'
                              }`}></span>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-data-table text-slate-600">
                            {sub.elec > 0 ? `${sub.elec.toLocaleString()} kWh` : '—'}
                          </td>
                          <td className="px-6 py-4 text-right font-data-table text-slate-600">
                            {sub.water > 0 ? `${sub.water.toLocaleString()} m³` : '—'}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">{sub.submittedOn || 'Awaiting entry'}</td>
                          <td className="px-6 py-4 text-right">
                            {sub.status === 'locked' ? (
                              <button 
                                onClick={() => {
                                  setSelectedProperty(sub.property);
                                  setPage('form');
                                }}
                                className="text-xs font-bold text-slate-500 border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors"
                              >
                                View Locked
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setSelectedProperty(sub.property);
                                  setPage('form');
                                }}
                                className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded hover:brightness-110 shadow-sm active:scale-95 transition-all"
                              >
                                {sub.status === 'draft' ? 'Edit Draft' : 'Report Now'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BM SUBMISSION FORM PAGE CODES */}
          {role === 'bm' && page === 'form' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Building Data Submission</h2>
                  <p className="text-slate-500 font-body-md mt-1">FY 2026 - Q2 ESG Performance Reporting Cycle</p>
                </div>
              </div>

              {/* Property Selector Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="md:col-span-4 space-y-2">
                  <label className="font-label-caps text-xs font-bold text-slate-500 uppercase tracking-wider block">SELECT PROPERTY</label>
                  <div className="relative">
                    <select 
                      value={selectedProperty.id}
                      onChange={e => {
                        const p = PROPERTIES.find(prop => prop.id === Number(e.target.value));
                        if (p) setSelectedProperty(p);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 font-semibold text-slate-800 appearance-none focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    >
                      {PROPERTIES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
                  </div>
                </div>

                <div className="md:col-span-8 bg-slate-50 border border-primary/20 rounded-xl p-5 flex flex-wrap gap-x-12 gap-y-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-full opacity-5 pointer-events-none">
                    <div className="w-full h-full bg-primary" style={{ maskImage: 'radial-gradient(circle, black, transparent)', WebkitMaskImage: 'radial-gradient(circle, black, transparent)' }}></div>
                  </div>
                  <div className="min-w-[150px]">
                    <p className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider">ASSET CODE</p>
                    <p className="font-data-table text-primary font-bold text-base mt-1">{selectedProperty.code}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEGMENT</p>
                    <p className="font-body-md font-bold mt-1 text-slate-700">{selectedProperty.segment}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider">GROSS FLOOR AREA</p>
                    <p className="font-body-md font-bold mt-1 text-slate-700">{Number(selectedProperty.gfa).toLocaleString()} m²</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold text-slate-400 uppercase tracking-wider">BASELINE FY</p>
                    <p className="font-body-md font-bold mt-1 text-slate-700">{selectedProperty.baseline}</p>
                  </div>
                  <div className="w-full pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 italic">{selectedProperty.desc}</p>
                  </div>
                </div>
              </div>

              {/* Render SubmissionForm keyed by selectedProperty.id to force reset when property changes */}
              <SubmissionForm 
                key={selectedProperty.id}
                selectedProperty={selectedProperty}
                submissions={submissions}
                onSaveDraft={handleSaveDraft}
                onSubmitFinal={handleSubmitFinal}
                triggerToast={triggerToast}
              />
            </div>
          )}

          {/* BM SUBMISSION HISTORY */}
          {role === 'bm' && page === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">Submission History</h2>
                <p className="text-slate-500 font-body-md mt-1">Audit log of locked monthly submissions for your portfolio properties.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left zebra-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Property</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Reporting Period</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Electricity</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Water</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Solid Waste</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Locked Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                      {submissions.filter(s => s.status === 'locked' && searchFilter(PROPERTIES.find(p => p.id === s.propertyId)?.name || '')).map((s, idx) => {
                        const p = PROPERTIES.find(prop => prop.id === s.propertyId);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{p?.name}</td>
                            <td className="px-6 py-4 font-data-table text-slate-500">{s.period}</td>
                            <td className="px-6 py-4 font-data-table text-slate-600">{s.elec.toLocaleString()} kWh</td>
                            <td className="px-6 py-4 font-data-table text-slate-600">{s.water.toLocaleString()} m³</td>
                            <td className="px-6 py-4 font-data-table text-slate-600">{s.waste.toLocaleString()} kg</td>
                            <td className="px-6 py-4">
                              <span className="status-pill bg-emerald-100 text-emerald-800">
                                <span className="status-dot bg-emerald-600"></span>
                                Locked
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ========================================================
              ROLE: REPORTING MANAGER (RM)
             ======================================================== */}
          {role === 'rm' && page === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">Compliance Dashboard</h2>
                <p className="text-slate-500 font-body-md mt-1">Operational Overview • Reporting Cycle May 2026</p>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Portfolio Completion</span>
                    <span className="material-symbols-outlined text-primary/30 group-hover:text-primary transition-colors">pie_chart</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">
                      {Math.round((statusCounts.locked / statusCounts.total) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/80"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Properties Locked</span>
                    <span className="material-symbols-outlined text-primary/30 group-hover:text-primary transition-colors">lock</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">
                      {statusCounts.locked}/{statusCounts.total}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Outstanding Submissions</span>
                    <span className="material-symbols-outlined text-amber-500/30 group-hover:text-amber-500 transition-colors">pending_actions</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">
                      {statusCounts.draft + statusCounts.submitted}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Overdue (Critical)</span>
                    <span className="material-symbols-outlined text-rose-600/30 group-hover:text-rose-600 transition-colors">warning</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-rose-600 tracking-tight font-data-table">
                      {statusCounts.overdue}
                    </span>
                  </div>
                </div>
              </div>

              {/* RAG & On-Time Rate Bar Chart Mockups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Submission Status - May 2026</h3>
                  
                  {/* Custom Flex Stacked Bar */}
                  <div className="h-8 w-full flex rounded-lg overflow-hidden border border-slate-200">
                    <div className="bg-[#10b981] h-full flex items-center justify-center text-[10px] text-white font-extrabold" style={{ width: '60%' }}>60% LOCKED</div>
                    <div className="bg-[#fbbf24] h-full flex items-center justify-center text-[10px] text-white font-extrabold" style={{ width: '20%' }}>20% DRAFT</div>
                    <div className="bg-[#ef4444] h-full flex items-center justify-center text-[10px] text-white font-extrabold" style={{ width: '20%' }}>20% OVERDUE</div>
                  </div>

                  <div className="flex justify-around pt-2 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 bg-[#10b981] rounded-sm"></span>Locked ({statusCounts.locked})</span>
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 bg-[#fbbf24] rounded-sm"></span>Draft ({statusCounts.draft})</span>
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 bg-[#ef4444] rounded-sm"></span>Overdue ({statusCounts.overdue})</span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">On-Time Rate History</h3>
                    <span className="text-[10px] font-bold text-slate-400">LAST 5 MONTHS</span>
                  </div>
                  
                  {/* Simulating a bar chart with SVG/CSS */}
                  <div className="h-28 flex items-end justify-between gap-6 px-4">
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY'].map((mon, index) => {
                      const heights = ['h-[60%]', 'h-[72%]', 'h-[68%]', 'h-[85%]', 'h-[92%]'];
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer animate-fade-in">
                          <div className={`w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-md ${heights[index]}`}></div>
                          <span className="text-[10px] font-extrabold text-slate-500">{mon}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Overdue Properties Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-headline-sm text-headline-sm text-slate-800">Critical Overdue List</h3>
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Action Required</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left zebra-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Property</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Segment</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Country</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Status</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-center">Days Overdue</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Escalate</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                      {currentSubs.filter(s => (s.status === 'overdue' || s.status === 'draft') && searchFilter(s.property.name || '')).map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{s.property.name}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{s.property.segment}</td>
                          <td className="px-6 py-4 text-slate-500">{s.property.country}</td>
                          <td className="px-6 py-4">
                            <span className={`status-pill ${s.status === 'overdue' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              <span className={`status-dot ${s.status === 'overdue' ? 'bg-rose-600' : 'bg-amber-500'}`}></span>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-data-table text-rose-600 font-bold">{s.daysOverdue || '1'}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleEscalateProperty(s.property.name)}
                              className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded hover:brightness-110 active:scale-95 shadow-sm transition-all"
                            >
                              Escalate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RM OUTSTANDING SUBMISSIONS */}
          {role === 'rm' && page === 'outstanding' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">Outstanding Submissions</h2>
                <p className="text-slate-500 font-body-md mt-1">Direct sub-meter logs currently awaiting compliance lock.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left zebra-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Property Asset</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Coverage Period</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Status</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Assigned BM</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Remind</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                    {currentSubs.filter(s => s.status !== 'locked' && searchFilter(s.property.name || '')).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{s.property.name}</td>
                        <td className="px-6 py-4 font-data-table text-slate-500">{s.period}</td>
                        <td className="px-6 py-4">
                          <span className={`status-pill ${s.status === 'overdue' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                            <span className={`status-dot ${s.status === 'overdue' ? 'bg-rose-600' : 'bg-amber-500'}`}></span>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">John Tan (TSH Singapore)</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemindProperty(s.property.name)}
                            className="text-xs font-bold border border-primary text-primary px-3 py-1.5 rounded hover:bg-primary/5 active:scale-95 transition-all"
                          >
                            Send Nudge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RM ESCALATION LOG */}
          {role === 'rm' && page === 'escalation' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">Escalation Log</h2>
                <p className="text-slate-500 font-body-md mt-1">Audit log of system-generated and manual notification alerts.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left zebra-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Alert Date</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Target Asset</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Escalation Type</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Recipients</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                    {[
                      { date: "21 May 2026, 10:14 AM", prop: "Grand Hyatt Melbourne", type: "Critical Overdue Nudge", target: "Regional VP Operations", status: "Delivered" },
                      { date: "19 May 2026, 09:00 AM", prop: "ROLP (Perth Hospitality)", type: "Mid-Period Nudge", target: "John Tan (BM)", status: "Delivered" },
                      { date: "15 May 2026, 05:00 PM", prop: "PT Batam Opus Bay", type: "Compliance Alert", target: "Batam Manager Office", status: "Pending" }
                    ].filter(e => searchFilter(e.prop)).map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-data-table text-slate-500 text-xs">{e.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{e.prop}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{e.type}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{e.target}</td>
                        <td className="px-6 py-4">
                          <span className={`status-pill ${e.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            <span className={`status-dot ${e.status === 'Delivered' ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* ========================================================
              ROLE: SUSTAINABILITY MANAGER (SM)
             ======================================================== */}
          {role === 'sm' && page === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Portfolio Overview</h2>
                  <p className="text-slate-500 font-body-md mt-1">Real-time YTD ESG performance monitoring for TSH Group Portfolio.</p>
                </div>
                <div className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Jan - May 2026
                </div>
              </div>

              {/* SM KPI Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Completion Rate</span>
                    <span className="material-symbols-outlined text-emerald-600/30 group-hover:text-emerald-600 transition-colors">check_circle</span>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">
                      {Math.round((statusCounts.locked / statusCounts.total) * 100)}%
                    </span>
                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${(statusCounts.locked / statusCounts.total) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Scope 1 YTD</span>
                    <span className="material-symbols-outlined text-emerald-600/30 group-hover:text-emerald-600 transition-colors">eco</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">2,410</span>
                      <span className="text-xs text-slate-400 font-bold">tCO2e</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      -3.2% vs target
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Scope 2 YTD</span>
                    <span className="material-symbols-outlined text-emerald-600/30 group-hover:text-emerald-600 transition-colors">bolt</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">14,820</span>
                      <span className="text-xs text-slate-400 font-bold">tCO2e</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      -1.8% vs target
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-600"></div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 uppercase font-bold tracking-wider">Scope 3 YTD</span>
                    <span className="material-symbols-outlined text-rose-600/30 group-hover:text-rose-600 transition-colors">factory</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">42,105</span>
                      <span className="text-xs text-slate-400 font-bold">tCO2e</span>
                    </div>
                    <div className="text-[11px] font-bold text-rose-600 mt-2 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      +2.1% vs target
                    </div>
                  </div>
                </div>
              </div>

              {/* SM Charts & Warnings Section */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Left Panel - Performance Trend bar chart */}
                <div className="col-span-12 lg:col-span-8 bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-sm text-headline-sm text-slate-800">Performance Trends (Utility Intensities)</h3>
                    <div className="flex gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-700 rounded-sm"></span> Electricity (kWh)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-300 rounded-sm"></span> Water (m³)</span>
                    </div>
                  </div>

                  {/* Dual Bar Charts */}
                  <div className="h-64 flex items-end justify-between gap-6 pt-6">
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY'].map((mon, index) => {
                      const hElec = ['h-[60%]', 'h-[75%]', 'h-[65%]', 'h-[90%]', 'h-[80%]'];
                      const hWater = ['h-[40%]', 'h-[45%]', 'h-[50%]', 'h-[55%]', 'h-[60%]'];
                      return (
                        <div key={index} className="flex-1 h-full flex flex-col items-center gap-2 group">
                          <div className="w-full flex-1 flex items-end justify-center gap-1">
                            <div className={`bg-emerald-700 w-full rounded-t-sm transition-all group-hover:opacity-80 ${hElec[index]}`}></div>
                            <div className={`bg-emerald-300 w-full rounded-t-sm transition-all group-hover:opacity-80 ${hWater[index]}`}></div>
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-500">{mon}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Segment completion */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-3">
                      <h4 className="font-label-caps text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Segment Completion</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Office Portfolio</span>
                            <span>92%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Retail complexes</span>
                            <span>76%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full" style={{ width: '76%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-label-caps text-xs font-bold text-slate-400 uppercase tracking-wider">Regional Compliance (RAG count)</h4>
                      <div className="flex justify-around items-center h-16 text-center">
                        <div>
                          <p className="text-xl font-extrabold text-slate-800">12</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">APAC</p>
                        </div>
                        <div>
                          <p className="text-xl font-extrabold text-slate-800">4</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">EMEA</p>
                        </div>
                        <div>
                          <p className="text-xl font-extrabold text-slate-800">2</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">AMER</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Anomalies & Map */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Anomalies Card */}
                  <div className="bg-amber-50/50 p-6 border border-amber-200 rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <span className="material-symbols-outlined text-amber-600">warning</span>
                      <h3 className="text-sm font-bold uppercase tracking-wide">Anomalies Detected</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 border border-amber-100 rounded-lg flex gap-3 shadow-sm hover:translate-y-[-1px] transition-all">
                        <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-2 rounded">water_drop</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Sydney Central Plaza</h4>
                          <p className="text-[10px] text-amber-800 font-medium mt-0.5">+45% Water spike vs YTD average</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 border border-amber-100 rounded-lg flex gap-3 shadow-sm hover:translate-y-[-1px] transition-all">
                        <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-2 rounded">bolt</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Shanghai Innovation Hub</h4>
                          <p className="text-[10px] text-amber-800 font-medium mt-0.5">Missing meter logs (May 2026)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Map */}
                  <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Submission Map</h3>
                    <div className="bg-slate-100 h-44 rounded-lg overflow-hidden relative">
                      <img 
                        alt="Global Map"
                        className="w-full h-full object-cover grayscale"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-VEbG7qlgQh3pyZv8oLA8Ei2p3N5MAyVNY9_TFVyzyAAXwS6rRfDorOCsTlm8Jo2AU2q2wqYuxZdkvSQWN_1Njd_ZAiqN0zsDxwyLrocpIwqMM3Nm9eBP1DsmAuFHxVr0MNSX8eh5WZHDYWIsGKbwiJ3hhL9oIBQClJInEkKwQgxk6GCYJ5gznoFFYCE_1WOTBeevumXix0alhiZF-sNZVZV2f6bBUepsNRZoHFJbFxqabY8y2TiuBxOwcEoBvjM0CPZKKBLdFZc"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></span>
                        <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.7)]"></span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 tracking-wider">
                      <span>Properties Registered: 42</span>
                      <span className="text-primary cursor-pointer hover:underline">View Map Mode</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SM ALL SUBMISSIONS TABLE */}
          {role === 'sm' && page === 'submissions' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">All Submissions</h2>
                <p className="text-slate-500 font-body-md mt-1">Global audit view. Lock status and override capability.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Submission Grid</h3>
                  <div className="text-xs text-slate-400">Total properties: 10</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left zebra-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Asset Name</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Country</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Electricity</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Water</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Compliance Status</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase text-right">Unlock</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                      {currentSubs.filter(s => searchFilter(s.property.name || '')).map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{s.property.name}</td>
                          <td className="px-6 py-4 text-slate-500">{s.property.country}</td>
                          <td className="px-6 py-4 font-data-table text-slate-600">{s.elec.toLocaleString()} kWh</td>
                          <td className="px-6 py-4 font-data-table text-slate-600">{s.water.toLocaleString()} m³</td>
                          <td className="px-6 py-4">
                            <span className={`status-pill ${
                              s.status === 'locked' ? 'bg-emerald-100 text-emerald-800' :
                              s.status === 'submitted' ? 'bg-indigo-100 text-indigo-800' :
                              s.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              <span className={`status-dot ${
                                s.status === 'locked' ? 'bg-emerald-600' :
                                s.status === 'submitted' ? 'bg-indigo-600' :
                                s.status === 'draft' ? 'bg-amber-500' : 'bg-rose-600'
                              }`}></span>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {s.status === 'locked' && (
                              <button 
                                onClick={() => handleUnlockSubmission(s.property.id)}
                                className="text-xs font-bold border border-rose-200 text-rose-600 px-2.5 py-1 rounded hover:bg-rose-50 transition-colors active:scale-95"
                              >
                                Unlock
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SM MASTER DATA */}
          {role === 'sm' && page === 'master' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Master Data: Emission Factors</h2>
                  <p className="text-slate-500 font-body-md mt-1">Baseline emissions factors registered for CY 2026 calculations.</p>
                </div>
                <button 
                  onClick={() => triggerToast("Master data exported as CSV successfully.", "success")}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  Export CSV
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left zebra-table">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Category</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Region Scope</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Unit Measure</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Baseline Factor</th>
                      <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Validation Term</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                    {EMISSION_FACTORS.filter(f => searchFilter(f.category)).map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{f.category}</td>
                        <td className="px-6 py-4 text-slate-500">{f.region}</td>
                        <td className="px-6 py-4 text-slate-500">{f.unit}</td>
                        <td className="px-6 py-4 font-data-table text-slate-800 font-bold">{f.factor}</td>
                        <td className="px-6 py-4">
                          <span className="status-pill bg-emerald-100 text-emerald-800">
                            <span className="status-dot bg-emerald-600"></span>
                            {f.period}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SM AMENDMENT LOG */}
          {role === 'sm' && page === 'amendments' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display-lg text-display-lg text-slate-900">Amendment Log &amp; Audit Trail</h2>
                <p className="text-slate-500 font-body-md mt-1">Changes made to locked submission values by compliance officers.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left zebra-table">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Amendment Date</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Target Property</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Data Field</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Original Value</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Revised Value</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">Reasoning / Justification</th>
                        <th className="px-6 py-3 font-label-caps tracking-widest uppercase">User</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-800 divide-y divide-slate-100">
                      {AMENDMENT_LOG.filter(l => searchFilter(l.property)).map((l, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-data-table text-slate-500 text-xs">{l.date}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{l.property}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{l.category}</td>
                          <td className="px-6 py-4 font-data-table text-rose-600 line-through decoration-rose-300 font-medium">{l.original}</td>
                          <td className="px-6 py-4 font-data-table text-emerald-600 font-bold">{l.new}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">{l.reason}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-bold">{l.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Footer info labels */}
        <footer className="mt-auto px-8 py-6 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-400">
          <div className="flex gap-6 font-semibold">
            <span>Data Sync: 21 May 2026, 10:30 AM</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> System online</span>
          </div>
          <span className="font-label-caps text-[9px] uppercase tracking-widest">© 2026 TSH Group ESG Platform</span>
        </footer>
      </div>

      {/* ── GLOBAL TOAST NOTIFICATION ── */}
      <div 
        className={`fixed bottom-8 right-8 z-[9999] transition-all duration-300 transform pointer-events-none ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="bg-slate-900 text-slate-100 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 min-w-[280px]">
          <span className="material-symbols-outlined text-primary text-[22px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
        </div>
      </div>

    </div>
  );
}
