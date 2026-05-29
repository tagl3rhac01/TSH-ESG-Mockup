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
  { timestamp: "2026-05-27 14:22:08", gmt: "GMT +8", property: "18 Robinson", period: "FY26 - Q2", field: "Scope 2 Emissions", originalVal: "422.50 tCO2e", newVal: "398.15 tCO2e", delta: "-5.76%", reasonCategory: "Data Error", reasonDetails: "Meter reading was incorrectly entered from manual log sheet. Verified against digital utility provider portal.", editor: "Sarah Jenkins", verifier: "Marcus Thorne" },
  { timestamp: "2026-05-25 09:15:33", gmt: "GMT +7", property: "PT Batam Opus Bay", period: "FY26 - Q2", field: "Water Intensity", originalVal: "0.84 m³/m²", newVal: "1.12 m³/m²", delta: "+33.33%", reasonCategory: "Recalculation", reasonDetails: "Square footage update for Annex B retail extensions.", editor: "James Wilson", verifier: "Sarah Jenkins" },
  { timestamp: "2026-05-22 17:05:12", gmt: "GMT +8", property: "18 Robinson", period: "FY26 - Q2", field: "Waste Diversion", originalVal: "65.0%", newVal: "82.5%", delta: "+26.92%", reasonCategory: "Verification", reasonDetails: "Annual recycling audit completion and document upload.", editor: "Auto-System (API)", verifier: "Marcus Thorne" },
  { timestamp: "2026-05-18 11:30:45", gmt: "GMT +10", property: "Grand Hyatt Melbourne", period: "FY26 - Q1", field: "Electricity", originalVal: "194,000 kWh", newVal: "185,900 kWh", delta: "-4.17%", reasonCategory: "Adjustment", reasonDetails: "Corrected for solar inverter self-consumption exclusion.", editor: "Sarah Jenkins", verifier: "Sarah Jenkins" },
  { timestamp: "2026-05-15 10:05:12", gmt: "GMT +8", property: "Hypak Sdn Bhd", period: "FY26 - Q2", field: "Natural Gas", originalVal: "2,450 GJ", newVal: "2,100 GJ", delta: "-14.28%", reasonCategory: "Data Error", reasonDetails: "Double bill ingestion from supplier billing cycle overlap.", editor: "Marcus Tan", verifier: "Chen Wei" }
];

const reasonBadgeStyles = {
  "Data Error": { bullet: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50 border-rose-100" },
  "Recalculation": { bullet: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
  "Verification": { bullet: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  "Adjustment": { bullet: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50 border-blue-100" }
};

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

  // Sustainability Manager Sub-states
  const [masterTab, setMasterTab] = useState('emission-factors');
  const [masterSearch, setMasterSearch] = useState('');
  const [portfolioRegion, setPortfolioRegion] = useState('All');
  const [allSubCountry, setAllSubCountry] = useState('All Countries');
  const [allSubSegment, setAllSubSegment] = useState('All Segments');
  const [allSubStatus, setAllSubStatus] = useState('All Statuses');
  const [allSubSearch, setAllSubSearch] = useState('');
  const [auditProperty, setAuditProperty] = useState('All Properties');
  const [auditField, setAuditField] = useState('All Fields');
  const [auditCategory, setAuditCategory] = useState('All Categories');
  const [auditPage, setAuditPage] = useState(1);
  const [tempDateRange, setTempDateRange] = useState('');
  const [tempProperty, setTempProperty] = useState('All Properties');
  const [tempField, setTempField] = useState('All Fields');
  const [tempCategory, setTempCategory] = useState('All Categories');
  const [masterPropCountry, setMasterPropCountry] = useState('All');

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

  // Filtered logs for Audit Trail
  const filteredLogs = useMemo(() => {
    return AMENDMENT_LOG.filter(log => {
      // Property filter
      if (auditProperty !== 'All Properties' && log.property !== auditProperty) return false;
      
      // Field filter
      if (auditField !== 'All Fields' && log.field !== auditField) return false;
      
      // Category filter
      if (auditCategory !== 'All Categories' && log.reasonCategory !== auditCategory) return false;
      
      // Date range text search
      if (tempDateRange) {
        const matchesDate = log.timestamp.toLowerCase().includes(tempDateRange.toLowerCase());
        if (!matchesDate) return false;
      }
      
      return true;
    });
  }, [auditProperty, auditField, auditCategory, tempDateRange]);

  // Pagination calculations
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIdx = (auditPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredLogs, auditPage]);

  // Reset filter handler
  const handleResetFilters = () => {
    setTempDateRange('');
    setTempProperty('All Properties');
    setTempField('All Fields');
    setTempCategory('All Categories');
    setAuditProperty('All Properties');
    setAuditField('All Fields');
    setAuditCategory('All Categories');
    setAuditPage(1);
    triggerToast("Filters cleared.", "info");
  };

  // Apply filters handler
  const handleApplyFilters = () => {
    setAuditProperty(tempProperty);
    setAuditField(tempField);
    setAuditCategory(tempCategory);
    setAuditPage(1);
    triggerToast("Filters applied successfully.", "success");
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
                      className="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-3 font-semibold text-slate-800 appearance-none bg-none focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
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
                    {/* ========================================================
              ROLE: SUSTAINABILITY MANAGER (SM)
             ======================================================== */}
          {role === 'sm' && page === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Portfolio Overview</h2>
                  <p className="text-slate-500 font-body-md mt-1">Real-time YTD ESG performance monitoring for TSH Group Portfolio.</p>
                </div>
                <div className="relative">
                  <select 
                    value={portfolioRegion}
                    onChange={e => {
                      setPortfolioRegion(e.target.value);
                      triggerToast(`Filtering portfolio by: ${e.target.value}`, "info");
                    }}
                    className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-1.5 pr-10 font-bold text-primary focus:ring-2 focus:ring-primary cursor-pointer outline-none shadow-sm"
                  >
                    <option value="All">Viewing: All Portfolio</option>
                    <option value="Singapore">Region: Singapore</option>
                    <option value="Australia">Region: Australia</option>
                    <option value="Indonesia">Region: Indonesia</option>
                    <option value="Malaysia">Region: Malaysia</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2 pointer-events-none text-primary">expand_more</span>
                </div>
              </div>

              {/* YTD KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Emissions */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 font-bold tracking-wider">TOTAL EMISSIONS (MTCO2E)</span>
                    <span className="material-symbols-outlined text-primary">co2</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">12,482.5</span>
                    <div className="flex items-center text-rose-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-xs">trending_up</span>
                      <span>4.2%</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">YTD vs 2023 Performance</p>
                </div>
                {/* Energy Intensity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 font-bold tracking-wider">ENERGY INTENSITY (KWH/M2)</span>
                    <span className="material-symbols-outlined text-primary">bolt</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">142.8</span>
                    <div className="flex items-center text-emerald-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-xs">trending_down</span>
                      <span>2.1%</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Singapore Hub efficiency leader</p>
                </div>
                {/* Water Usage */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 font-bold tracking-wider">WATER USAGE (M3)</span>
                    <span className="material-symbols-outlined text-emerald-500">water_drop</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">45,920</span>
                    <div className="flex items-center text-slate-400 text-xs font-bold">
                      <span className="material-symbols-outlined text-xs">horizontal_rule</span>
                      <span>0.0%</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Batam Facility steady state</p>
                </div>
                {/* Decarbonization Projects */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-xs text-slate-400 font-bold tracking-wider">DECARBONIZATION PROJECTS</span>
                    <span className="material-symbols-outlined text-amber-500">eco</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-data-table">18</span>
                    <span className="text-xs text-slate-400 font-bold">/ 24 Planned</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* Performance Trends Chart Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 gap-4">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-slate-800">Performance Trends</h3>
                      <p className="text-xs text-slate-400">Resource consumption over trailing 12 months</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Electricity</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Water</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-0.5 border-t border-dashed border-slate-400"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FY24 Target</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 h-[340px] relative">
                    {/* Custom SVG Chart */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
                      {/* Grid Lines */}
                      <line className="stroke-slate-100" x1="0" x2="800" y1="0" y2="0" strokeWidth="1" />
                      <line className="stroke-slate-100" x1="0" x2="800" y1="60" y2="60" strokeWidth="1" />
                      <line className="stroke-slate-100" x1="0" x2="800" y1="120" y2="120" strokeWidth="1" />
                      <line className="stroke-slate-100" x1="0" x2="800" y1="180" y2="180" strokeWidth="1" />
                      <line className="stroke-slate-100" x1="0" x2="800" y1="240" y2="240" strokeWidth="1" />
                      {/* Target Line */}
                      <line className="stroke-slate-400" x1="0" x2="800" y1="96" y2="96" strokeWidth="1.5" strokeDasharray="4 4" />
                      {/* Electricity Path (Primary Emerald) */}
                      <path className="stroke-primary fill-none" d="M0,200 L72,184 L145,196 L218,144 L290,132 L363,112 L436,124 L509,88 L581,100 L654,72 L727,84 L800,56" strokeWidth="2.5" />
                      {/* Water Path (Emerald Light) */}
                      <path className="stroke-emerald-400 fill-none" d="M0,224 L72,220 L145,208 L218,204 L290,192 L363,196 L436,184 L509,188 L581,176 L654,180 L727,168 L800,172" strokeWidth="2.5" />
                      {/* X-Axis Labels */}
                      <g className="font-sans text-[9px] font-bold fill-slate-400">
                        <text x="0" y="258">JUL 23</text>
                        <text x="145" y="258">SEP 23</text>
                        <text x="290" y="258">NOV 23</text>
                        <text x="436" y="258">JAN 24</text>
                        <text x="581" y="258">MAR 24</text>
                        <text x="727" y="258">MAY 24</text>
                      </g>
                      {/* Y-Axis Labels */}
                      <g className="font-sans text-[9px] font-bold fill-slate-400 text-right">
                        <text x="-35" y="4">500k</text>
                        <text x="-35" y="64">375k</text>
                        <text x="-35" y="124">250k</text>
                        <text x="-35" y="184">125k</text>
                        <text x="-35" y="244">0</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Right Sidebar Modules */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Emission Factors Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-label-caps text-xs text-slate-500 font-extrabold uppercase tracking-wider">EMISSION FACTORS (FY24)</h4>
                      <button onClick={() => { setPage('master'); setMasterTab('emission-factors'); }} className="text-[11px] font-bold text-primary hover:underline">View all</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Electricity - Singapore</p>
                          <p className="text-[10px] text-slate-400 font-semibold">EMA Grid Average 2023</p>
                        </div>
                        <span className="font-data-table text-xs text-slate-800 font-bold">0.4057 <span className="text-[9px] text-slate-400 font-semibold">kg/kWh</span></span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Electricity - Indonesia</p>
                          <p className="text-[10px] text-slate-400 font-semibold">PLN Batam Local Grid</p>
                        </div>
                        <span className="font-data-table text-xs text-slate-800 font-bold">0.7812 <span className="text-[9px] text-slate-400 font-semibold">kg/kWh</span></span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-800">Diesel (Scope 1)</p>
                          <p className="text-[10px] text-slate-400 font-semibold">UK DEFRA Factors</p>
                        </div>
                        <span className="font-data-table text-xs text-slate-800 font-bold">2.6869 <span className="text-[9px] text-slate-400 font-semibold">kg/L</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Amendment Log Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-label-caps text-xs text-slate-500 font-extrabold uppercase tracking-wider">RECENT AMENDMENTS</h4>
                      <button onClick={() => setPage('amendments')} className="text-[11px] font-bold text-primary hover:underline">View all</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Batam Warehouse - Mar 2026</p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Corrected water bill meter reading (+450 m³)</p>
                          <p className="text-[9px] text-primary font-bold mt-1">Updated by R. Lim • 2h ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                          <span className="material-symbols-outlined text-sm">history</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">TSH HQ - Scope 3 Travel</p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Re-classified 12 flights to Premium Economy</p>
                          <p className="text-[9px] text-primary font-bold mt-1">Updated by System • 5h ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Data Table Section */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-headline-sm text-headline-sm text-slate-800">Property Performance Detail</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => triggerToast("Excel export complete.", "success")}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">file_download</span> Export
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 font-label-caps text-xs font-bold text-slate-500 border-b border-slate-150">
                      <tr>
                        <th className="px-6 py-4">Property Name</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Energy (kWh)</th>
                        <th className="px-6 py-4">Water (m³)</th>
                        <th className="px-6 py-4">Emissions (MTCO2E)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-body-md text-sm font-medium text-slate-800">
                      {currentSubs.filter(s => {
                        if (portfolioRegion === 'All') return true;
                        return s.property?.country === portfolioRegion;
                      }).map((s, idx) => {
                        const ef = getGridEF(s.property?.country);
                        const emissionsVal = ((s.elec * ef) / 1000).toFixed(2);
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => triggerToast(`Opening detailed profile for ${s.property?.name}...`, "info")}>
                            <td className="px-6 py-4 font-bold text-slate-900">{s.property?.name}</td>
                            <td className="px-6 py-4 text-slate-500">{s.property?.country}</td>
                            <td className="px-6 py-4 font-data-table">{s.elec.toLocaleString()}</td>
                            <td className="px-6 py-4 font-data-table">{s.water.toLocaleString()}</td>
                            <td className="px-6 py-4 font-data-table text-primary font-bold">{emissionsVal}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                s.status === 'locked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'locked' ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                                {s.status === 'locked' ? 'VALIDATED' : 'PENDING'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
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

          {role === 'sm' && page === 'submissions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <nav className="flex text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2 mb-1">
                    <span>ESG Reporting</span>
                    <span>/</span>
                    <span className="text-primary font-bold">All Submissions</span>
                  </nav>
                  <h1 className="font-display-lg text-display-lg text-slate-900">All Submissions</h1>
                </div>
                <button 
                  onClick={() => {
                    triggerToast("Refreshing submissions database...", "info");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-bold text-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>REFRESH</span>
                </button>
              </div>

              {/* Sticky Filter Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm sticky top-[61px] z-30">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reporting Period</label>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-slate-700 text-xs font-semibold cursor-default">
                    <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                    <span>May 2026</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</label>
                  <select 
                    value={allSubCountry}
                    onChange={e => setAllSubCountry(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="All Countries">All Countries</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                    <option value="China">China</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Segment</label>
                  <select 
                    value={allSubSegment}
                    onChange={e => setAllSubSegment(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="All Segments">All Segments</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Retail">Retail</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 flex-grow max-w-[300px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property Search</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                    <input 
                      type="text"
                      placeholder="Type property name..."
                      value={allSubSearch}
                      onChange={e => setAllSubSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select 
                    value={allSubStatus}
                    onChange={e => setAllSubStatus(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Locked">Locked</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Draft">Draft</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Filtering of submissions list */}
              {(() => {
                const filteredSubs = currentSubs.filter(s => {
                  if (allSubCountry !== 'All Countries' && s.property?.country !== allSubCountry) return false;
                  if (allSubSegment !== 'All Segments' && s.property?.segment !== allSubSegment) return false;
                  if (allSubStatus !== 'All Statuses' && s.status !== allSubStatus.toLowerCase()) return false;
                  if (allSubSearch && !s.property?.name.toLowerCase().includes(allSubSearch.toLowerCase())) return false;
                  return true;
                });

                const totalElec = filteredSubs.reduce((acc, s) => acc + s.elec, 0);
                const totalWater = filteredSubs.reduce((acc, s) => acc + s.water, 0);
                const totalGas = filteredSubs.reduce((acc, s) => acc + s.gas, 0);
                const totalWaste = filteredSubs.reduce((acc, s) => acc + s.waste, 0);

                return (
                  <>
                    {/* Aggregation Summary Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm border-l-4 border-l-primary">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Electricity</span>
                          <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-data-table">{totalElec.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">kWh</span>
                        </div>
                        <span className="text-[10px] text-green-600 font-extrabold flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">trending_down</span>
                          -4.2% vs prev period
                        </span>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Water</span>
                          <span className="material-symbols-outlined text-blue-500 text-[20px]">water_drop</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-data-table">{totalWater.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">m³</span>
                        </div>
                        <span className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          +12.8% vs prev period
                        </span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm border-l-4 border-l-amber-500">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Gas</span>
                          <span className="material-symbols-outlined text-amber-500 text-[20px]">heat_pump</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-data-table">{totalGas.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">m³</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
                          Stable (±0.5%)
                        </span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm border-l-4 border-l-slate-500">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Waste</span>
                          <span className="material-symbols-outlined text-slate-500 text-[20px]">delete_outline</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-data-table">{totalWaste.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-data-table">kg</span>
                        </div>
                        <span className="text-[10px] text-green-600 font-extrabold flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">trending_down</span>
                          -8.1% vs prev period
                        </span>
                      </div>
                    </div>

                    {/* Main Data Table Container */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 font-label-caps">
                            <tr>
                              <th className="px-4 py-4 whitespace-nowrap">Property</th>
                              <th className="px-4 py-4 whitespace-nowrap">Country</th>
                              <th className="px-4 py-4 whitespace-nowrap">Segment</th>
                              <th className="px-4 py-4 whitespace-nowrap">Period</th>
                              <th className="px-4 py-4 whitespace-nowrap">Status</th>
                              <th className="px-4 py-4 whitespace-nowrap text-right">Electricity (kWh)</th>
                              <th className="px-4 py-4 whitespace-nowrap text-right">Water (m³)</th>
                              <th className="px-4 py-4 whitespace-nowrap text-right">Gas (m³)</th>
                              <th className="px-4 py-4 whitespace-nowrap text-right">Waste (kg)</th>
                              <th className="px-4 py-4 whitespace-nowrap">Locked By</th>
                              <th className="px-4 py-4 whitespace-nowrap">Locked On</th>
                              <th className="px-4 py-4 whitespace-nowrap text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-800 text-sm">
                            {filteredSubs.length === 0 ? (
                              <tr>
                                <td colSpan="12" className="px-6 py-12 text-center text-slate-400 font-semibold text-sm">
                                  <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 block">description</span>
                                  No submission records found matching selected filters.
                                </td>
                              </tr>
                            ) : (
                              filteredSubs.map((s, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-4 font-bold text-slate-900">{s.property?.name}</td>
                                  <td className="px-4 py-4 text-slate-500">{s.property?.country}</td>
                                  <td className="px-4 py-4 text-xs text-slate-500">{s.property?.segment}</td>
                                  <td className="px-4 py-4 font-data-table text-xs text-slate-500">{s.period}</td>
                                  <td className="px-4 py-4">
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
                                  <td className="px-4 py-4 font-data-table text-right text-xs">{s.elec.toLocaleString()}</td>
                                  <td className="px-4 py-4 font-data-table text-right text-xs">{s.water.toLocaleString()}</td>
                                  <td className="px-4 py-4 font-data-table text-right text-xs">{s.gas.toLocaleString()}</td>
                                  <td className="px-4 py-4 font-data-table text-right text-xs">{s.waste.toLocaleString()}</td>
                                  <td className="px-4 py-4 text-xs text-slate-500">{s.status === 'locked' ? 'John Tan' : '—'}</td>
                                  <td className="px-4 py-4 text-xs text-slate-400">{s.status === 'locked' ? s.submittedOn : '—'}</td>
                                  <td className="px-4 py-4 text-right">
                                    {s.status === 'locked' ? (
                                      <button 
                                        onClick={() => handleUnlockSubmission(s.propertyId)}
                                        className="text-[11px] font-bold border border-rose-200 text-rose-600 px-2 py-1 rounded hover:bg-rose-50 transition-colors active:scale-95 cursor-pointer"
                                      >
                                        Unlock
                                      </button>
                                    ) : (
                                      <span className="text-slate-300 font-semibold text-xs">—</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Table Pagination */}
                      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-semibold text-slate-500">
                          Showing 1-{filteredSubs.length} of {filteredSubs.length} submissions
                        </span>
                        <div className="flex gap-1">
                          <button disabled className="px-2 py-1 border border-slate-200 rounded disabled:opacity-40 text-slate-500"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                          <button className="px-3 py-1 bg-primary text-white font-bold text-xs rounded shadow-sm">1</button>
                          <button disabled className="px-2 py-1 border border-slate-200 rounded disabled:opacity-40 text-slate-500"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Bottom Export Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">download</span>
                  <span className="font-label-caps text-xs text-slate-400 font-bold uppercase tracking-wider">Export Consolidated Data</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button onClick={() => triggerToast("Consolidated submissions exported as CSV.", "success")} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors flex-1 sm:flex-initial group">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">description</span>
                    <span>CSV Export</span>
                  </button>
                  <button onClick={() => triggerToast("Submissions PDF report generated.", "success")} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors flex-1 sm:flex-initial group">
                    <span className="material-symbols-outlined text-rose-600 text-[20px]">picture_as_pdf</span>
                    <span>PDF Report</span>
                  </button>
                  <button onClick={() => triggerToast("Data synced with Power BI compliance dashboard.", "success")} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 text-xs font-bold transition-all shadow-md flex-1 sm:flex-initial">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                    <span>Sync to Power BI</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {role === 'sm' && page === 'master' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-label-caps text-[10px] text-primary font-extrabold uppercase bg-primary-container/10 px-2 py-0.5 rounded border border-primary/10">Master Governance</span>
                  </div>
                  <h2 className="font-display-lg text-display-lg text-slate-900 mb-1">Master Data Repository</h2>
                  <p className="text-slate-500 font-body-md mt-1">Centralized governance for all emissions reference data, conversion constants, and property asset masters. Ensure data integrity for auditable ESG reporting.</p>
                </div>
              </div>

              {/* Master Tabs */}
              <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-6">
                {[
                  { id: 'emission-factors', label: 'Emission Factors' },
                  { id: 'properties', label: 'Properties' },
                  { id: 'conversion-factors', label: 'Conversion Factors' },
                  { id: 'approvals', label: 'Approvals Queue', badge: 4 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setMasterTab(tab.id);
                      setMasterSearch('');
                    }}
                    className={`py-3.5 px-1 border-b-2 text-xs font-bold font-label-caps uppercase transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                      masterTab === tab.id
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab 1: Emission Factors */}
              {masterTab === 'emission-factors' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <div className="relative flex-grow sm:flex-initial">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input 
                          type="text" 
                          placeholder="Search factors..." 
                          value={masterSearch}
                          onChange={e => setMasterSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold w-full sm:w-64 focus:ring-1 focus:ring-primary focus:border-primary outline-none shadow-sm"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast("Upload dialog launched for new emission factors.", "info")}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md w-full sm:w-auto justify-center animate-fade-in"
                    >
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>Upload New EF Version</span>
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-label-caps text-xs font-bold border-b border-slate-150">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Region Scope</th>
                          <th className="px-4 py-3">Unit Measure</th>
                          <th className="px-4 py-3 text-right">Baseline Factor</th>
                          <th className="px-4 py-3">Validation Term</th>
                          <th className="px-4 py-3">Source Documentation</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-data-table text-xs text-slate-800 font-medium">
                        {(() => {
                          const filteredEFs = EMISSION_FACTORS.filter(ef => {
                            const term = masterSearch.toLowerCase();
                            return ef.category.toLowerCase().includes(term) || ef.region.toLowerCase().includes(term);
                          });

                          if (filteredEFs.length === 0) {
                            return (
                              <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-semibold">
                                  No emission factors match the search.
                                </td>
                              </tr>
                            );
                          }

                          return filteredEFs.map((ef, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 font-bold text-slate-900">{ef.category}</td>
                              <td className="px-4 py-4 text-slate-500">{ef.region}</td>
                              <td className="px-4 py-4 text-slate-400">{ef.unit}</td>
                              <td className="px-4 py-4 text-right font-bold text-slate-900 font-data-table">{ef.factor.toFixed(4)}</td>
                              <td className="px-4 py-4">
                                <span className="status-pill bg-emerald-100 text-emerald-800">
                                  <span className="status-dot bg-emerald-600"></span>
                                  {ef.period}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <button onClick={() => triggerToast(`Navigating to source documentation...`, "info")} className="flex items-center gap-1 text-primary hover:underline font-bold text-left">
                                  EMA/NEA Reference <span className="material-symbols-outlined text-[14px]">link</span>
                                </button>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <button onClick={() => triggerToast(`Edit form launched for ${ef.category} factor.`, "info")} className="text-slate-400 hover:text-primary hover:scale-105 transition-all"><span className="material-symbols-outlined">edit</span></button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Properties */}
              {masterTab === 'properties' && (
                <div className="grid grid-cols-12 gap-6 animate-fade-in">
                  {/* Grouping Sidebar */}
                  <div className="col-span-12 md:col-span-3 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <h3 className="font-label-caps text-xs text-slate-500 font-extrabold mb-4 uppercase tracking-wider">Country Filters</h3>
                      <div className="space-y-1">
                        {[
                          { id: 'All', label: 'All Regions', count: PROPERTIES.length },
                          { id: 'Singapore', label: 'Singapore', count: PROPERTIES.filter(p => p.country === 'Singapore').length },
                          { id: 'Australia', label: 'Australia', count: PROPERTIES.filter(p => p.country === 'Australia').length },
                          { id: 'Indonesia', label: 'Indonesia', count: PROPERTIES.filter(p => p.country === 'Indonesia').length },
                          { id: 'Malaysia', label: 'Malaysia', count: PROPERTIES.filter(p => p.country === 'Malaysia').length }
                        ].map(c => (
                          <button
                            key={c.id}
                            onClick={() => setMasterPropCountry(c.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                              masterPropCountry === c.id
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">location_on</span> {c.label}</span>
                            <span className={`text-[10px] px-1.5 rounded-full ${masterPropCountry === c.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{c.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Asset Table */}
                  <div className="col-span-12 md:col-span-9">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-headline-sm text-headline-sm text-slate-800">Asset Master List</h3>
                        <div className="flex gap-2">
                          <button onClick={() => triggerToast("Asset list exported to Excel.", "success")} className="text-xs font-bold border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-600 cursor-pointer">Export XLS</button>
                          <button onClick={() => triggerToast("Add asset wizard launched.", "info")} className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded hover:brightness-110 shadow-sm cursor-pointer">Add Asset</button>
                        </div>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-label-caps text-xs font-bold border-b border-slate-150">
                          <tr>
                            <th className="px-4 py-3">Property Code</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Segment</th>
                            <th className="px-4 py-3 text-right">GFA (sqm)</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-data-table text-xs text-slate-800 font-medium">
                          {PROPERTIES.filter(p => masterPropCountry === 'All' || p.country === masterPropCountry).map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 text-primary font-bold">{p.code}</td>
                              <td className="px-4 py-4 font-bold text-slate-900">{p.name}</td>
                              <td className="px-4 py-4 text-slate-500">{p.segment}</td>
                              <td className="px-4 py-4 text-right font-data-table">{p.gfa.toLocaleString()}</td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${idx % 2 === 0 ? 'bg-teal-100 text-teal-800' : 'bg-sky-100 text-sky-800'}`}>
                                  {idx % 2 === 0 ? 'RM' : 'BM'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                  <span>Active</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Conversion Factors */}
              {masterTab === 'conversion-factors' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-4xl mx-auto animate-fade-in">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">calculate</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-slate-800">Unit Conversion Constants</h3>
                      <p className="text-slate-500 font-body-sm">Global constants applied across all TSH portfolio reporting for standardization.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Natural Gas (LHV)", val: "10.63", unit: "kWh / m³", desc: "Standard low heating value for piped gas in Southeast Asian markets." },
                      { title: "GWP: Methane (CH₄)", val: "28", unit: "CO₂e factor", desc: "IPCC AR6 - 100-year Global Warming Potential." },
                      { title: "Liquid Nitrogen", val: "0.808", unit: "tonne / m³", desc: "Density constant for cryogenic industrial storage." },
                      { title: "Water Density", val: "1.00", unit: "tonne / m³", desc: "Pure water density at STP (4°C reference)." }
                    ].map((item, idx) => (
                      <div key={idx} onClick={() => triggerToast(`Constant detail: ${item.title} = ${item.val} ${item.unit}`, "info")} className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:border-primary transition-all group cursor-pointer shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-label-caps text-xs text-slate-400 font-extrabold uppercase tracking-wide">{item.title}</span>
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-sm">info</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-primary font-mono">{item.val}</span>
                          <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-2 italic">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Approvals Queue */}
              {masterTab === 'approvals' && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                  <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-rose-600" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                      <h3 className="font-headline-sm text-headline-sm text-rose-800 font-bold">Critical Approvals Required</h3>
                    </div>
                    <span className="text-xs font-extrabold text-rose-600 bg-rose-100/50 px-2 py-0.5 rounded border border-rose-200">4 Pending Changes</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/30 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <span className="material-symbols-outlined">autorenew</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Update: Electricity Grid EF (Singapore)</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Requested by <span className="font-bold">Chen Wei</span> • 2 hours ago</p>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-xs font-mono line-through text-slate-400">0.4085</span>
                            <span className="material-symbols-outlined text-xs text-slate-400">arrow_forward</span>
                            <span className="text-xs font-mono text-primary font-bold">0.4057 kgCO₂e/kWh</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button onClick={() => triggerToast("Change request rejected. Submitting agent notified.", "info")} className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Reject</button>
                        <button onClick={() => triggerToast("Change approved successfully. Master database updated.", "success")} className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 shadow-sm cursor-pointer">Approve Change</button>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/30 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-emerald-55/10 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <span className="material-symbols-outlined">add_business</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">New Asset: Northshore Logistics Hub (MY)</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Requested by <span className="font-bold">Marcus Tan</span> • Yesterday</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Segment: Industrial | GFA: 15,000 sqm</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button onClick={() => triggerToast("Change request rejected. Submitting agent notified.", "info")} className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Reject</button>
                        <button onClick={() => triggerToast("New asset added to master directory.", "success")} className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 shadow-sm cursor-pointer">Approve Addition</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informational Sidebar Widget (Bento Style) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="material-symbols-outlined text-primary mb-4 text-3xl">verified_user</span>
                    <h4 className="font-headline-sm text-headline-sm text-slate-850 font-bold mb-2">Data Integrity Lock</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">All emission factors are cryptographically signed. Any manual bypass is logged for external auditors.</p>
                  </div>
                  <div className="mt-6 flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGe9dIiePMqnJT0_EfikGPYOVnnxkXRYePaYN9tSU-c7Xj8ma8YQsoPy4QPsvpeGji05lRHgQSe_yL5q9Sjdp9bMyRL-dONpagjrFxJJ13uuAFiNEu6qLLrygizyNezJA2tTILhmktqrwgzq3sefye8c247uqqmc0VX9sXDidX8eObbebxYwckKVU3-KhOiR-0J2Q4HAWoqJu4s0zfzP1W1fuZZC_jBCXe6nviBi-3wh-mJxhK8ZshBvepyDQFmOKAvbhht-8QiME" alt="Auditor 1" />
                    <img className="w-8 h-8 rounded-full border-2 border-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2M5OMuCwylDFZR2NQjK-5RjJEnhcsJYELqJJWxHyWJSpsbYNkmiE6scWQpcpoyDDix6VyLVjMH822P55XXGBd_v_bKYWQ9PYKgJLxKsWPSh9SvDuUJkxsocw7lh9O2E0WqquiQK4DKXLrqI_2OO1FqbxgAhAwK4C8yGnHaH9n2gRmlFfcHgWs0OHJC1wVshRfPuf9PcIsxJB6WYiIEOn2LyKzf9GYMpVpq42wm8CIeCf6FZuhw2zwBtIO5qaAoyKaGoQSW3Ron00" alt="Auditor 2" />
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                    <span className="material-symbols-outlined text-primary mb-4 text-3xl">history_edu</span>
                    <h4 className="font-headline-sm text-headline-sm text-slate-850 font-bold mb-2">Audit Log Access</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Download the full history of all master data changes since the 2021 baseline year for verification.</p>
                  </div>
                  <button onClick={() => setPage('amendments')} className="mt-4 text-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform text-left">
                    <span>View Full Logs</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-primary to-emerald-800 text-white rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="material-symbols-outlined text-white mb-4 text-3xl">sync</span>
                    <h4 className="font-headline-sm text-headline-sm font-bold mb-2">Automated Sync</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Your factors are currently synced with EMA and IPCC real-time APIs. Next scheduled check in 14 hours.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-mono bg-white/10 p-2 rounded">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>LAST SYNC: 2026-05-28 04:00 UTC</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {role === 'sm' && page === 'amendments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-display-lg text-display-lg text-slate-900">Amendment Log &amp; Audit Trail</h2>
                  <p className="text-slate-500 font-body-md mt-1">Changes made to locked submission values by compliance officers.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => triggerToast("Syncing audit trail ledger with compliance nodes...", "success")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-slate-600 hover:text-primary transition-colors bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    <span>REFRESH</span>
                  </button>
                  <button 
                    onClick={() => triggerToast("Generating audit trail PDF report...", "success")}
                    className="flex-1 sm:flex-none bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-colors shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    <span>EXPORT PDF</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <section className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 items-end shadow-sm">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Date Range</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:border-primary focus-within:bg-white transition-all">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                    <input 
                      className="bg-transparent border-none p-0 text-xs font-semibold focus:ring-0 w-full text-slate-700 outline-none" 
                      type="text" 
                      value={tempDateRange}
                      onChange={e => setTempDateRange(e.target.value)}
                      placeholder="e.g. May 2026"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Property</label>
                  <select 
                    value={tempProperty}
                    onChange={e => setTempProperty(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:ring-0 focus:border-primary text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All Properties">All Properties</option>
                    {PROPERTIES.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Field Changed</label>
                  <select 
                    value={tempField}
                    onChange={e => setTempField(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:ring-0 focus:border-primary text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All Fields">All Fields</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Natural Gas">Natural Gas</option>
                    <option value="Water">Water</option>
                    <option value="Waste">Waste</option>
                    <option value="Scope 1 Emissions">Scope 1 Emissions</option>
                    <option value="Scope 2 Emissions">Scope 2 Emissions</option>
                    <option value="Water Intensity">Water Intensity</option>
                    <option value="Waste Diversion">Waste Diversion</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Reason Category</label>
                  <select 
                    value={tempCategory}
                    onChange={e => setTempCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:ring-0 focus:border-primary text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Data Error">Data Error</option>
                    <option value="Recalculation">Recalculation</option>
                    <option value="Verification">Verification</option>
                    <option value="Adjustment">Adjustment</option>
                  </select>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-105 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase rounded-lg transition-colors h-[38px] flex items-center gap-1.5 cursor-pointer border border-slate-200 bg-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">clear_all</span>
                    <span>Clear</span>
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="px-5 py-2 bg-primary text-white font-bold text-xs uppercase rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md h-[38px] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    <span>Apply</span>
                  </button>
                </div>
              </section>

              {/* Main Audit Table Card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">history_edu</span>
                    <h2 className="font-headline-sm text-slate-800 font-bold">Immutable Audit Trail</h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'Amendment' : 'Amendments'}
                  </span>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[140px]">Timestamp</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property / Period</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Field Affected</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[200px]">Amendment Detail</th>
                        <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delta %</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason / Justification</th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Flow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedLogs.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-semibold text-sm">
                            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 block">history_edu</span>
                            No audit records found matching the selected filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedLogs.map((log, idx) => {
                          const isNegative = log.delta.startsWith('-');
                          const deltaClass = isNegative ? 'text-rose-600' : 'text-emerald-600';
                          return (
                            <tr key={idx} className="hover:bg-slate-50/40 transition-colors group">
                              <td className="px-4 py-4 font-data-table text-xs text-slate-800 align-top">
                                {log.timestamp}
                                <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">{log.gmt}</div>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="text-sm font-bold text-slate-800">{log.property}</div>
                                <div className="text-xs text-slate-500 font-semibold mt-1">{log.period}</div>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <span className="bg-primary/5 text-primary text-[11px] font-bold px-2 py-0.5 rounded border border-primary/10">
                                  {log.field}
                                </span>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="flex items-center gap-2 font-data-table text-xs">
                                  <span className="text-slate-400 line-through">{log.originalVal}</span>
                                  <span className="material-symbols-outlined text-xs text-slate-400">trending_flat</span>
                                  <span className="text-emerald-700 font-bold">{log.newVal}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center align-top font-bold font-data-table text-xs">
                                <span className={deltaClass}>{log.delta}</span>
                              </td>
                              <td className="px-4 py-4 align-top max-w-[240px]">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${reasonBadgeStyles[log.reasonCategory]?.bullet || 'bg-slate-400'}`}></div>
                                  <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border ${reasonBadgeStyles[log.reasonCategory]?.text || 'text-slate-700'} ${reasonBadgeStyles[log.reasonCategory]?.bg || 'bg-slate-50 border-slate-100'}`}>
                                    {log.reasonCategory}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed truncate hover:text-clip hover:whitespace-normal cursor-help font-semibold" title={log.reasonDetails}>
                                  {log.reasonDetails}
                                </p>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">edit</span>
                                    <span>{log.editor}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-800 font-bold">
                                    <span className="material-symbols-outlined text-[14px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    <span>{log.verifier}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer/Pagination */}
                {filteredLogs.length > 0 && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-semibold text-slate-500">
                      Showing {Math.min(filteredLogs.length, (auditPage - 1) * itemsPerPage + 1)} to {Math.min(filteredLogs.length, auditPage * itemsPerPage)} of {filteredLogs.length} entries
                    </span>
                    <div className="flex gap-1.5">
                      <button 
                        disabled={auditPage === 1}
                        onClick={() => setAuditPage(prev => Math.max(1, prev - 1))}
                        className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-slate-500 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button 
                          key={pageNum}
                          onClick={() => setAuditPage(pageNum)}
                          className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                            auditPage === pageNum 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800 cursor-pointer'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      <button 
                        disabled={auditPage === totalPages || totalPages === 0}
                        onClick={() => setAuditPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-slate-500 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* System Integrity Banner */}
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="bg-primary/15 p-2.5 rounded-full text-primary">
                  <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Audit Trail Integrity Seal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    All amendments are cryptographically hashed and logged to an immutable ledger. Changes cannot be deleted or reordered after verification. Verified by TSH Compliance Node #741.
                  </p>
                </div>
                <button 
                  onClick={() => triggerToast("Ledger receipt signature verified: SHA256-f0c1a03fd0848ce9cde9a314...", "success")}
                  className="ml-auto font-label-caps text-xs uppercase text-primary border-b border-primary hover:text-primary/70 hover:border-primary/70 transition-colors py-0.5 font-bold shrink-0 cursor-pointer"
                >
                  View Blockchain Receipt
                </button>
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
