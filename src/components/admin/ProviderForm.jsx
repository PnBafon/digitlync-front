import React, { useState, useEffect, useCallback } from 'react';
import MapPicker from './MapPicker';
import { api } from '../../api';
import { showToast } from '../Toaster';
import { FARMER_SERVICE_NEEDS, COUNTRIES, REGIONS_CAMEROON, REGIONS_GENERIC, DIVISIONS_SAMPLE, DISTRICTS_SAMPLE, EQUIPMENT_CONDITION, FUEL_TYPES } from '../../constants/lookups';
import './ProviderForm.css';

const emptyService = () => ({
  service_name: '',
  work_capacity_ha_per_hour: '',
  base_price_per_ha: '',
  country: '',
  region: '',
  division: '',
  subdivision: '',
  district: '',
  equipment: [''],
});

function ProviderForm({ provider, onSuccess, onCancel }) {
  const isEdit = !!provider;
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    services_offered: '',
    work_capacity_ha_per_hour: '',
    base_price_per_ha: '',
    equipment_type: '',
    service_radius_km: '',
    notes: '',
    services: [emptyService()],
    gps_lat: '', gps_lng: '',
    number_of_machines: '', equipment_condition: '', fuel_type: '', backup_equipment_available: '', years_operating: '',
    willingness_to_travel: '', travel_surcharge_per_km: '',
    labour_provided: '', number_of_workers: '', skilled_vs_unskilled: '', ability_to_scale_large_farms: '', minimum_booking_size_ha: '',
    minimum_charge_ha: '', fuel_included: '', advance_payment_percent: '', accepted_payment_methods: '', cancellation_policy: '',
    days_available_per_week: '', peak_season_capacity: '', required_booking_lead_time_days: '',
    national_id: '', equipment_ownership_proof: '', reference_contact: '', consent_platform_rules: '', agreement_no_show_penalties: '',
    on_time_completion_rate: '', job_success_rate: '', dispute_frequency: '', repeat_client_percent: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);

  const mapProviderToForm = useCallback((p) => {
    const services = p.services?.length
        ? p.services.map((s) => ({
            service_name: s.service_name || '',
            work_capacity_ha_per_hour: s.work_capacity_ha_per_hour ?? '',
            base_price_per_ha: s.base_price_per_ha ?? '',
            country: s.country || '',
            region: s.region || '',
            division: s.division || '',
            subdivision: s.subdivision || '',
            district: s.district || '',
            equipment: s.equipment?.length ? s.equipment.map((e) => (typeof e === 'object' ? e.equipment_name : e) || '') : [''],
          }))
        : [emptyService()];
    return {
      full_name: p.full_name || '',
      phone: p.phone || '',
      services_offered: p.services_offered || '',
      work_capacity_ha_per_hour: p.work_capacity_ha_per_hour ?? '',
      base_price_per_ha: p.base_price_per_ha ?? '',
      equipment_type: p.equipment_type || '',
      service_radius_km: p.service_radius_km ?? '',
      notes: p.notes || '',
      services,
      gps_lat: p.gps_lat ?? '', gps_lng: p.gps_lng ?? '',
      number_of_machines: p.number_of_machines ?? '', equipment_condition: p.equipment_condition || '', fuel_type: p.fuel_type || '', backup_equipment_available: p.backup_equipment_available ?? '', years_operating: p.years_operating ?? '',
      willingness_to_travel: p.willingness_to_travel ?? '', travel_surcharge_per_km: p.travel_surcharge_per_km ?? '',
      labour_provided: p.labour_provided ?? '', number_of_workers: p.number_of_workers ?? '', skilled_vs_unskilled: p.skilled_vs_unskilled || '', ability_to_scale_large_farms: p.ability_to_scale_large_farms ?? '', minimum_booking_size_ha: p.minimum_booking_size_ha ?? '',
      minimum_charge_ha: p.minimum_charge_ha ?? '', fuel_included: p.fuel_included ?? '', advance_payment_percent: p.advance_payment_percent ?? '', accepted_payment_methods: p.accepted_payment_methods || '', cancellation_policy: p.cancellation_policy || '',
      days_available_per_week: p.days_available_per_week ?? '', peak_season_capacity: p.peak_season_capacity || '', required_booking_lead_time_days: p.required_booking_lead_time_days ?? '',
      national_id: p.national_id || '', equipment_ownership_proof: p.equipment_ownership_proof || '', reference_contact: p.reference_contact || '', consent_platform_rules: p.consent_platform_rules ?? '', agreement_no_show_penalties: p.agreement_no_show_penalties ?? '',
      on_time_completion_rate: p.on_time_completion_rate ?? '', job_success_rate: p.job_success_rate ?? '', dispute_frequency: p.dispute_frequency ?? '', repeat_client_percent: p.repeat_client_percent ?? '',
    };
  }, []);

  useEffect(() => {
    if (provider) {
      const loadProvider = async () => {
        if (!provider.services && provider.id) {
          const { data } = await api.getProvider(provider.id);
          if (data) setForm(mapProviderToForm(data));
          return;
        }
        setForm(mapProviderToForm(provider));
      };
      loadProvider();
    }
  }, [provider, mapProviderToForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const updateService = (idx, field, value) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
    setError('');
  };

  const updateServiceEquipment = (svcIdx, eqIdx, value) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => {
        if (i !== svcIdx) return s;
        const eq = [...(s.equipment || [''])];
        eq[eqIdx] = value;
        return { ...s, equipment: eq };
      }),
    }));
    setError('');
  };

  const addEquipment = (svcIdx) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => (i === svcIdx ? { ...s, equipment: [...(s.equipment || ['']), ''] } : s)),
    }));
  };

  const removeEquipment = (svcIdx, eqIdx) => {
    setForm((f) => ({
      ...f,
      services: f.services.map((s, i) => {
        if (i !== svcIdx) return s;
        const eq = (s.equipment || ['']).filter((_, j) => j !== eqIdx);
        return { ...s, equipment: eq.length ? eq : [''] };
      }),
    }));
  };

  const addService = () => {
    setForm((f) => ({ ...f, services: [...f.services, emptyService()] }));
  };

  const removeService = (idx) => {
    if (form.services.length <= 1) return;
    setForm((f) => ({ ...f, services: f.services.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Full name and phone are required');
      return;
    }
    setSaving(true);
    setError('');
    const servicesPayload = form.services
      .filter((s) => s.service_name?.trim())
      .map((s) => ({
        service_name: s.service_name.trim(),
        work_capacity_ha_per_hour: s.work_capacity_ha_per_hour ? parseFloat(s.work_capacity_ha_per_hour) : null,
        base_price_per_ha: s.base_price_per_ha ? parseFloat(s.base_price_per_ha) : null,
        country: s.country?.trim() || null,
        region: s.region?.trim() || null,
        division: s.division?.trim() || null,
        subdivision: s.subdivision?.trim() || null,
        district: s.district?.trim() || null,
        equipment: (s.equipment || ['']).filter((eq) => eq?.trim()).map((eq) => eq.trim()),
      }));
    const bool = (v) => (v === true || v === 'true' || v === 'yes' ? true : v === false || v === 'false' || v === 'no' ? false : null);
    const num = (v) => (v != null && v !== '' ? parseFloat(v) : null);
    const int = (v) => (v != null && v !== '' ? parseInt(v, 10) : null);
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      services_offered: form.services_offered?.trim() || null,
      work_capacity_ha_per_hour: num(form.work_capacity_ha_per_hour),
      base_price_per_ha: num(form.base_price_per_ha),
      equipment_type: form.equipment_type?.trim() || null,
      service_radius_km: num(form.service_radius_km),
      notes: form.notes?.trim() || null,
      services: servicesPayload,
      gps_lat: num(form.gps_lat), gps_lng: num(form.gps_lng),
      number_of_machines: int(form.number_of_machines), equipment_condition: form.equipment_condition?.trim() || null, fuel_type: form.fuel_type?.trim() || null, backup_equipment_available: bool(form.backup_equipment_available), years_operating: int(form.years_operating),
      willingness_to_travel: bool(form.willingness_to_travel), travel_surcharge_per_km: num(form.travel_surcharge_per_km),
      labour_provided: bool(form.labour_provided), number_of_workers: int(form.number_of_workers), skilled_vs_unskilled: form.skilled_vs_unskilled?.trim() || null, ability_to_scale_large_farms: bool(form.ability_to_scale_large_farms), minimum_booking_size_ha: num(form.minimum_booking_size_ha),
      minimum_charge_ha: num(form.minimum_charge_ha), fuel_included: bool(form.fuel_included), advance_payment_percent: num(form.advance_payment_percent), accepted_payment_methods: form.accepted_payment_methods?.trim() || null, cancellation_policy: form.cancellation_policy?.trim() || null,
      days_available_per_week: int(form.days_available_per_week), peak_season_capacity: form.peak_season_capacity?.trim() || null, required_booking_lead_time_days: int(form.required_booking_lead_time_days),
      national_id: form.national_id?.trim() || null, equipment_ownership_proof: form.equipment_ownership_proof?.trim() || null, reference_contact: form.reference_contact?.trim() || null, consent_platform_rules: bool(form.consent_platform_rules), agreement_no_show_penalties: bool(form.agreement_no_show_penalties),
      on_time_completion_rate: num(form.on_time_completion_rate), job_success_rate: num(form.job_success_rate), dispute_frequency: int(form.dispute_frequency), repeat_client_percent: num(form.repeat_client_percent),
    };
    const { data, error: err } = isEdit
      ? await api.updateProvider(provider.id, payload)
      : await api.createProvider(payload);
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    showToast(
      isEdit
        ? 'Provider updated successfully.'
        : `${payload.full_name} has been added as a provider.`,
      { type: 'success' }
    );
    onSuccess?.(data);
  };

  const regions = (s) => (s?.country === 'Cameroon' ? REGIONS_CAMEROON : s?.country ? REGIONS_GENERIC : []);

  return (
    <div className="provider-form">
      <h2 className="provider-form-title">{isEdit ? 'Edit Provider' : 'Add Provider'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="provider-form-error">{error}</p>}
        <div className="provider-form-grid">
          <div className="provider-form-field">
            <label htmlFor="full_name">Full Name *</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Provider's full name" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="phone">Phone (WhatsApp) *</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="WhatsApp number" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="service_radius_km">Service Radius (km)</label>
            <input id="service_radius_km" name="service_radius_km" type="number" step="0.1" min="0" value={form.service_radius_km} onChange={handleChange} placeholder="e.g. 50" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="gps_lat">GPS Latitude</label>
            <input id="gps_lat" name="gps_lat" type="number" step="any" value={form.gps_lat} onChange={handleChange} placeholder="e.g. 6.3703" />
          </div>
          <div className="provider-form-field">
            <label htmlFor="gps_lng">GPS Longitude</label>
            <input id="gps_lng" name="gps_lng" type="number" step="any" value={form.gps_lng} onChange={handleChange} placeholder="e.g. 2.3912" />
          </div>
          <div className="provider-form-field provider-form-map-pick">
            <label>Base location</label>
            <button type="button" className="provider-form-map-btn" onClick={() => setShowMapPicker(true)}>
              📍 Pick on map
            </button>
          </div>
        </div>
        {showMapPicker && (
          <MapPicker
            lat={form.gps_lat || undefined}
            lng={form.gps_lng || undefined}
            onSelect={(lat, lng) => setForm((f) => ({ ...f, gps_lat: String(lat), gps_lng: String(lng) }))}
            onClose={() => setShowMapPicker(false)}
          />
        )}

        <details className="provider-form-details">
          <summary>Layer 2 — Equipment & Operations</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>Number of Machines</label>
              <input type="number" min="0" value={form.number_of_machines} onChange={(e) => setForm((f) => ({ ...f, number_of_machines: e.target.value }))} placeholder="e.g. 2" />
            </div>
            <div className="provider-form-field">
              <label>Equipment Condition</label>
              <select value={form.equipment_condition} onChange={(e) => setForm((f) => ({ ...f, equipment_condition: e.target.value }))}>
                <option value="">Select</option>
                {EQUIPMENT_CONDITION.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="provider-form-field">
              <label>Fuel Type</label>
              <select value={form.fuel_type} onChange={(e) => setForm((f) => ({ ...f, fuel_type: e.target.value }))}>
                <option value="">Select</option>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="provider-form-field">
              <label>Backup Equipment Available</label>
              <select value={form.backup_equipment_available} onChange={(e) => setForm((f) => ({ ...f, backup_equipment_available: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Years Operating</label>
              <input type="number" min="0" value={form.years_operating} onChange={(e) => setForm((f) => ({ ...f, years_operating: e.target.value }))} placeholder="e.g. 5" />
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 3 — Geographic Coverage</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>Willingness to Travel Outside District</label>
              <select value={form.willingness_to_travel} onChange={(e) => setForm((f) => ({ ...f, willingness_to_travel: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Travel Surcharge per km (FCFA)</label>
              <input type="number" min="0" value={form.travel_surcharge_per_km} onChange={(e) => setForm((f) => ({ ...f, travel_surcharge_per_km: e.target.value }))} placeholder="e.g. 500" />
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 4 — Labour Capacity</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>Labour Provided</label>
              <select value={form.labour_provided} onChange={(e) => setForm((f) => ({ ...f, labour_provided: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Number of Workers</label>
              <input type="number" min="0" value={form.number_of_workers} onChange={(e) => setForm((f) => ({ ...f, number_of_workers: e.target.value }))} placeholder="e.g. 4" />
            </div>
            <div className="provider-form-field">
              <label>Skilled vs Unskilled Labour</label>
              <input value={form.skilled_vs_unskilled} onChange={(e) => setForm((f) => ({ ...f, skilled_vs_unskilled: e.target.value }))} placeholder="e.g. 2 skilled, 2 unskilled" />
            </div>
            <div className="provider-form-field">
              <label>Ability to Scale for Large Farms</label>
              <select value={form.ability_to_scale_large_farms} onChange={(e) => setForm((f) => ({ ...f, ability_to_scale_large_farms: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Minimum Booking Size (ha)</label>
              <input type="number" step="0.1" min="0" value={form.minimum_booking_size_ha} onChange={(e) => setForm((f) => ({ ...f, minimum_booking_size_ha: e.target.value }))} placeholder="e.g. 1" />
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 5 — Pricing Structure</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>Minimum Charge (ha)</label>
              <input type="number" step="0.1" min="0" value={form.minimum_charge_ha} onChange={(e) => setForm((f) => ({ ...f, minimum_charge_ha: e.target.value }))} placeholder="e.g. 1" />
            </div>
            <div className="provider-form-field">
              <label>Fuel Included</label>
              <select value={form.fuel_included} onChange={(e) => setForm((f) => ({ ...f, fuel_included: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Advance Payment (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.advance_payment_percent} onChange={(e) => setForm((f) => ({ ...f, advance_payment_percent: e.target.value }))} placeholder="e.g. 30" />
            </div>
            <div className="provider-form-field">
              <label>Accepted Payment Methods</label>
              <input value={form.accepted_payment_methods} onChange={(e) => setForm((f) => ({ ...f, accepted_payment_methods: e.target.value }))} placeholder="e.g. Cash, Mobile money" />
            </div>
            <div className="provider-form-field provider-form-full">
              <label>Cancellation Policy</label>
              <textarea value={form.cancellation_policy} onChange={(e) => setForm((f) => ({ ...f, cancellation_policy: e.target.value }))} rows={2} placeholder="Describe policy" />
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 6 — Availability & Scheduling</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>Days Available per Week</label>
              <input type="number" min="0" max="7" value={form.days_available_per_week} onChange={(e) => setForm((f) => ({ ...f, days_available_per_week: e.target.value }))} placeholder="e.g. 5" />
            </div>
            <div className="provider-form-field">
              <label>Peak Season Capacity</label>
              <input value={form.peak_season_capacity} onChange={(e) => setForm((f) => ({ ...f, peak_season_capacity: e.target.value }))} placeholder="e.g. 10 ha/day" />
            </div>
            <div className="provider-form-field">
              <label>Required Booking Lead Time (days)</label>
              <input type="number" min="0" value={form.required_booking_lead_time_days} onChange={(e) => setForm((f) => ({ ...f, required_booking_lead_time_days: e.target.value }))} placeholder="e.g. 3" />
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 7 — Trust & Risk Control</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>National ID (optional)</label>
              <input value={form.national_id} onChange={(e) => setForm((f) => ({ ...f, national_id: e.target.value }))} placeholder="ID number" />
            </div>
            <div className="provider-form-field">
              <label>Equipment Ownership Proof</label>
              <input value={form.equipment_ownership_proof} onChange={(e) => setForm((f) => ({ ...f, equipment_ownership_proof: e.target.value }))} placeholder="URL or reference" />
            </div>
            <div className="provider-form-field">
              <label>Reference Contact</label>
              <input value={form.reference_contact} onChange={(e) => setForm((f) => ({ ...f, reference_contact: e.target.value }))} placeholder="Name, phone" />
            </div>
            <div className="provider-form-field">
              <label>Consent to Platform Rules</label>
              <select value={form.consent_platform_rules} onChange={(e) => setForm((f) => ({ ...f, consent_platform_rules: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="provider-form-field">
              <label>Agreement to No-Show Penalties</label>
              <select value={form.agreement_no_show_penalties} onChange={(e) => setForm((f) => ({ ...f, agreement_no_show_penalties: e.target.value }))}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </details>
        <details className="provider-form-details">
          <summary>Layer 8 — Performance Metrics (system-tracked)</summary>
          <div className="provider-form-grid">
            <div className="provider-form-field">
              <label>On-Time Completion Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.on_time_completion_rate} onChange={(e) => setForm((f) => ({ ...f, on_time_completion_rate: e.target.value }))} placeholder="e.g. 95" />
            </div>
            <div className="provider-form-field">
              <label>Job Success Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.job_success_rate} onChange={(e) => setForm((f) => ({ ...f, job_success_rate: e.target.value }))} placeholder="e.g. 98" />
            </div>
            <div className="provider-form-field">
              <label>Dispute Frequency</label>
              <input type="number" min="0" value={form.dispute_frequency} onChange={(e) => setForm((f) => ({ ...f, dispute_frequency: e.target.value }))} placeholder="Count" />
            </div>
            <div className="provider-form-field">
              <label>Repeat Client (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.repeat_client_percent} onChange={(e) => setForm((f) => ({ ...f, repeat_client_percent: e.target.value }))} placeholder="e.g. 60" />
            </div>
          </div>
        </details>

        <div className="provider-form-section-label">Services (add multiple)</div>
        {form.services.map((svc, idx) => (
          <div key={idx} className="provider-form-service-block">
            <div className="provider-form-service-header">
              <span>Service {idx + 1}</span>
              <button type="button" className="provider-form-remove-svc" onClick={() => removeService(idx)} disabled={form.services.length <= 1}>
                Remove
              </button>
            </div>
            <div className="provider-form-grid">
              <div className="provider-form-field">
                <label>Service Name</label>
                <select value={svc.service_name} onChange={(e) => updateService(idx, 'service_name', e.target.value)}>
                  <option value="">Select service</option>
                  {FARMER_SERVICE_NEEDS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Work Capacity (ha/hr)</label>
                <input type="number" step="0.1" min="0" value={svc.work_capacity_ha_per_hour} onChange={(e) => updateService(idx, 'work_capacity_ha_per_hour', e.target.value)} placeholder="e.g. 2.5" />
              </div>
              <div className="provider-form-field">
                <label>Base Price/ha (FCFA)</label>
                <input type="number" min="0" value={svc.base_price_per_ha} onChange={(e) => updateService(idx, 'base_price_per_ha', e.target.value)} placeholder="e.g. 25000" />
              </div>
            </div>
            <div className="provider-form-section-label-sm">Service Zone</div>
            <div className="provider-form-grid">
              <div className="provider-form-field">
                <label>Country</label>
                <select value={svc.country} onChange={(e) => updateService(idx, 'country', e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Region</label>
                <select value={svc.region} onChange={(e) => updateService(idx, 'region', e.target.value)}>
                  <option value="">Select</option>
                  {regions(svc).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Division</label>
                <select value={svc.division} onChange={(e) => updateService(idx, 'division', e.target.value)}>
                  <option value="">Select</option>
                  {DIVISIONS_SAMPLE.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="provider-form-field">
                <label>Subdivision</label>
                <input value={svc.subdivision} onChange={(e) => updateService(idx, 'subdivision', e.target.value)} placeholder="Subdivision" />
              </div>
              <div className="provider-form-field">
                <label>District</label>
                <select value={svc.district} onChange={(e) => updateService(idx, 'district', e.target.value)}>
                  <option value="">Select</option>
                  {DISTRICTS_SAMPLE.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="provider-form-section-label-sm">Equipment (per service)</div>
            <div className="provider-form-equipment-list">
              {(svc.equipment || ['']).map((eq, eqIdx) => (
                <div key={eqIdx} className="provider-form-equipment-row">
                  <input value={eq} onChange={(e) => updateServiceEquipment(idx, eqIdx, e.target.value)} placeholder="e.g. Tractor, Harrow" />
                  <button type="button" className="provider-form-remove-eq" onClick={() => removeEquipment(idx, eqIdx)} title="Remove">×</button>
                </div>
              ))}
              <button type="button" className="provider-form-add-eq" onClick={() => addEquipment(idx)}>+ Add equipment</button>
            </div>
          </div>
        ))}
        <button type="button" className="provider-form-add-svc" onClick={addService}>+ Add Service</button>

        <div className="provider-form-field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Additional notes" />
        </div>
        <div className="provider-form-actions">
          <button type="button" className="provider-form-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="provider-form-submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Add Provider'}</button>
        </div>
      </form>
    </div>
  );
}

export default ProviderForm;
