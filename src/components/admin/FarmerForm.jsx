import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { showToast } from '../Toaster';
import MapPicker from './MapPicker';
import { CROPS, FARMER_SERVICE_NEEDS, COUNTRIES, REGIONS_CAMEROON, REGIONS_GENERIC, DIVISIONS_SAMPLE, DISTRICTS_SAMPLE, SOIL_TYPES, IRRIGATION_TYPES, PLANTING_SEASONS, MONTHS, LAND_OWNERSHIP, MECHANIZATION_LEVELS } from '../../constants/lookups';
import './FarmerForm.css';

function FarmerForm({ farmer, onSuccess, onCancel }) {
  const isEdit = !!farmer;
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    country: '',
    region: '',
    division: '',
    subdivision: '',
    district: '',
    division_other: '',
    district_other: '',
    village: '',
    location: '',
    gps_lat: '',
    gps_lng: '',
    farm_size_ha: '',
    crop_type: '',
    crop_type_other: '',
    service_needs: [],
    notes: '',
    number_of_plots: '', soil_type: '', irrigation_type: '', planting_season: '', expected_harvest_month: '', estimated_yield_per_ha: '', previous_yield: '', seed_variety: '', fertilizer_use: '', pest_disease_challenges: '',
    bank_account_access: '', mobile_money_access: '', seasonal_revenue: '', existing_loans: '', cooperative_membership: '', current_buyers: '', storage_method: '', post_harvest_loss_percent: '',
    land_ownership: '', years_farming: '', access_to_tractor_services: '', access_to_labour: '', storage_capacity: '', mechanization_level: '',
    geo_tagged_farm_photos: '', national_id: '', next_of_kin: '', consent_to_data_use: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);

  const regions = form.country === 'Cameroon' ? REGIONS_CAMEROON : (form.country ? REGIONS_GENERIC : []);
  const divisions = DIVISIONS_SAMPLE;
  const districts = DISTRICTS_SAMPLE;

  useEffect(() => {
    if (farmer) {
      setForm({
        full_name: farmer.full_name || '',
        phone: farmer.phone || '',
        country: farmer.country || '',
        region: farmer.region || '',
        division: DIVISIONS_SAMPLE.includes(farmer.division) ? farmer.division : (farmer.division ? '_other' : ''),
        division_other: farmer.division && !DIVISIONS_SAMPLE.includes(farmer.division) ? farmer.division : '',
        subdivision: farmer.subdivision || '',
        district: DISTRICTS_SAMPLE.includes(farmer.district) ? farmer.district : (farmer.district ? '_other' : ''),
        district_other: farmer.district && !DISTRICTS_SAMPLE.includes(farmer.district) ? farmer.district : '',
        village: farmer.village || '',
        location: farmer.location || '',
        gps_lat: farmer.gps_lat ?? '',
        gps_lng: farmer.gps_lng ?? '',
        farm_size_ha: farmer.farm_size_ha ?? '',
        crop_type: farmer.crop_type || '',
        crop_type_other: CROPS.includes(farmer.crop_type) ? '' : (farmer.crop_type || ''),
        service_needs: Array.isArray(farmer.service_needs) ? farmer.service_needs : (farmer.service_needs ? [farmer.service_needs] : []),
        notes: farmer.notes || '',
        number_of_plots: farmer.number_of_plots ?? '', soil_type: farmer.soil_type || '', irrigation_type: farmer.irrigation_type || '', planting_season: farmer.planting_season || '', expected_harvest_month: farmer.expected_harvest_month || '', estimated_yield_per_ha: farmer.estimated_yield_per_ha ?? '', previous_yield: farmer.previous_yield ?? '', seed_variety: farmer.seed_variety || '', fertilizer_use: farmer.fertilizer_use || '', pest_disease_challenges: farmer.pest_disease_challenges || '',
        bank_account_access: farmer.bank_account_access ?? '', mobile_money_access: farmer.mobile_money_access ?? '', seasonal_revenue: farmer.seasonal_revenue ?? '', existing_loans: farmer.existing_loans ?? '', cooperative_membership: farmer.cooperative_membership ?? '', current_buyers: farmer.current_buyers || '', storage_method: farmer.storage_method || '', post_harvest_loss_percent: farmer.post_harvest_loss_percent ?? '',
        land_ownership: farmer.land_ownership || '', years_farming: farmer.years_farming ?? '', access_to_tractor_services: farmer.access_to_tractor_services ?? '', access_to_labour: farmer.access_to_labour ?? '', storage_capacity: farmer.storage_capacity || '', mechanization_level: farmer.mechanization_level || '',
        geo_tagged_farm_photos: farmer.geo_tagged_farm_photos || '', national_id: farmer.national_id || '', next_of_kin: farmer.next_of_kin || '', consent_to_data_use: farmer.consent_to_data_use ?? '',
      });
    }
  }, [farmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError('');
  };

  const handleServiceNeedToggle = (need) => {
    setForm((f) => ({
      ...f,
      service_needs: f.service_needs.includes(need)
        ? f.service_needs.filter((n) => n !== need)
        : [...f.service_needs, need],
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Full name and phone are required');
      return;
    }
    setSaving(true);
    setError('');
    const cropValue = form.crop_type === 'Other' ? (form.crop_type_other?.trim() || null) : (form.crop_type || null);
    const divisionVal = form.division === '_other' || form.division_other ? (form.division_other?.trim() || null) : (form.division?.trim() || null);
    const districtVal = form.district === '_other' || form.district_other ? (form.district_other?.trim() || null) : (form.district?.trim() || null);
    const bool = (v) => (v === true || v === 'true' || v === 'yes' ? true : v === false || v === 'false' || v === 'no' ? false : null);
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      country: form.country?.trim() || null,
      region: form.region?.trim() || null,
      division: divisionVal,
      subdivision: form.subdivision?.trim() || null,
      district: districtVal,
      village: form.village?.trim() || null,
      location: form.location?.trim() || null,
      gps_lat: form.gps_lat ? parseFloat(form.gps_lat) : null,
      gps_lng: form.gps_lng ? parseFloat(form.gps_lng) : null,
      farm_size_ha: form.farm_size_ha ? parseFloat(form.farm_size_ha) : null,
      crop_type: cropValue,
      service_needs: form.service_needs.length ? form.service_needs : null,
      notes: form.notes?.trim() || null,
      number_of_plots: form.number_of_plots ? parseInt(form.number_of_plots, 10) : null,
      soil_type: form.soil_type?.trim() || null,
      irrigation_type: form.irrigation_type?.trim() || null,
      planting_season: form.planting_season?.trim() || null,
      expected_harvest_month: form.expected_harvest_month?.trim() || null,
      estimated_yield_per_ha: form.estimated_yield_per_ha ? parseFloat(form.estimated_yield_per_ha) : null,
      previous_yield: form.previous_yield ? parseFloat(form.previous_yield) : null,
      seed_variety: form.seed_variety?.trim() || null,
      fertilizer_use: form.fertilizer_use?.trim() || null,
      pest_disease_challenges: form.pest_disease_challenges?.trim() || null,
      bank_account_access: bool(form.bank_account_access),
      mobile_money_access: bool(form.mobile_money_access),
      seasonal_revenue: form.seasonal_revenue ? parseFloat(form.seasonal_revenue) : null,
      existing_loans: form.existing_loans ? parseFloat(form.existing_loans) : null,
      cooperative_membership: bool(form.cooperative_membership),
      current_buyers: form.current_buyers?.trim() || null,
      storage_method: form.storage_method?.trim() || null,
      post_harvest_loss_percent: form.post_harvest_loss_percent ? parseFloat(form.post_harvest_loss_percent) : null,
      land_ownership: form.land_ownership?.trim() || null,
      years_farming: form.years_farming ? parseInt(form.years_farming, 10) : null,
      access_to_tractor_services: bool(form.access_to_tractor_services),
      access_to_labour: bool(form.access_to_labour),
      storage_capacity: form.storage_capacity?.trim() || null,
      mechanization_level: form.mechanization_level?.trim() || null,
      geo_tagged_farm_photos: form.geo_tagged_farm_photos?.trim() || null,
      national_id: form.national_id?.trim() || null,
      next_of_kin: form.next_of_kin?.trim() || null,
      consent_to_data_use: bool(form.consent_to_data_use),
    };
    const { data, error: err } = isEdit
      ? await api.updateFarmer(farmer.id, payload)
      : await api.createFarmer(payload);
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    showToast(
      isEdit
        ? 'Farmer updated successfully.'
        : `${payload.full_name} has been added as a farmer.`,
      { type: 'success' }
    );
    onSuccess?.(data);
  };

  return (
    <div className="farmer-form">
      <h2 className="farmer-form-title">{isEdit ? 'Edit Farmer' : 'Add Farmer'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="farmer-form-error">{error}</p>}
        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="full_name">Full Name *</label>
            <input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Farmer's full name"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="WhatsApp number"
            />
          </div>
        </div>

        <div className="farmer-form-section-label">Location (Structured)</div>
        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="country">Country</label>
            <select id="country" name="country" value={form.country} onChange={handleChange}>
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="farmer-form-field">
            <label htmlFor="region">Region</label>
            <select id="region" name="region" value={form.region} onChange={handleChange}>
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              {regions.length === 0 && form.country && <option value="">—</option>}
            </select>
          </div>
          <div className="farmer-form-field">
            <label htmlFor="division">Division</label>
            <select id="division" name="division" value={divisions.includes(form.division) ? form.division : (form.division === '_other' || form.division_other ? '_other' : form.division || '')} onChange={(e) => {
              const v = e.target.value;
              if (v === '_other') setForm((f) => ({ ...f, division: '_other', division_other: f.division_other || '' }));
              else setForm((f) => ({ ...f, division: v, division_other: '' }));
            }}>
              <option value="">Select division</option>
              {divisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="_other">Other</option>
            </select>
            {(form.division === '_other' || (form.division && !divisions.includes(form.division))) && (
              <input
                name="division_other"
                value={form.division_other}
                onChange={(e) => setForm((f) => ({ ...f, division_other: e.target.value }))}
                placeholder="Enter division"
                className="farmer-form-other-input"
              />
            )}
          </div>
          <div className="farmer-form-field">
            <label htmlFor="subdivision">Subdivision</label>
            <input
              id="subdivision"
              name="subdivision"
              value={form.subdivision}
              onChange={handleChange}
              placeholder="Subdivision"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="district">District</label>
            <select id="district" name="district" value={districts.includes(form.district) ? form.district : (form.district === '_other' || form.district_other ? '_other' : form.district || '')} onChange={(e) => {
              const v = e.target.value;
              if (v === '_other') setForm((f) => ({ ...f, district: '_other', district_other: f.district_other || '' }));
              else setForm((f) => ({ ...f, district: v, district_other: '' }));
            }}>
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="_other">Other</option>
            </select>
            {(form.district === '_other' || form.district_other !== undefined) && (
              <input
                name="district_other"
                value={form.district_other}
                onChange={(e) => setForm((f) => ({ ...f, district_other: e.target.value }))}
                placeholder="Enter district"
                className="farmer-form-other-input"
              />
            )}
          </div>
        </div>

        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="farm_size_ha">Farm Size (ha)</label>
            <input
              id="farm_size_ha"
              name="farm_size_ha"
              type="number"
              step="0.01"
              min="0"
              value={form.farm_size_ha}
              onChange={handleChange}
              placeholder="e.g. 2.5"
            />
          </div>
          <div className="farmer-form-field farmer-form-field-full">
            <label htmlFor="crop_type">Crop Type</label>
            <select id="crop_type" name="crop_type" value={form.crop_type} onChange={handleChange}>
              <option value="">Select crop</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.crop_type === 'Other' && (
              <input
                name="crop_type_other"
                value={form.crop_type_other}
                onChange={handleChange}
                placeholder="Specify crop name"
                className="farmer-form-other-input"
              />
            )}
          </div>
        </div>

        <div className="farmer-form-field farmer-form-field-full">
          <label>Service Needs (select all that apply)</label>
          <div className="farmer-form-checkbox-group">
            {FARMER_SERVICE_NEEDS.map((need) => (
              <label key={need} className="farmer-form-checkbox">
                <input
                  type="checkbox"
                  checked={form.service_needs.includes(need)}
                  onChange={() => handleServiceNeedToggle(need)}
                />
                <span>{need}</span>
              </label>
            ))}
          </div>
        </div>

        <details className="farmer-form-details">
          <summary>Layer 2 — Production Data</summary>
          <div className="farmer-form-grid">
            <div className="farmer-form-field">
              <label htmlFor="number_of_plots">Number of Plots</label>
              <input id="number_of_plots" name="number_of_plots" type="number" min="0" value={form.number_of_plots} onChange={handleChange} placeholder="e.g. 3" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="soil_type">Soil Type</label>
              <select id="soil_type" name="soil_type" value={form.soil_type} onChange={handleChange}>
                <option value="">Select</option>
                {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="irrigation_type">Irrigation Type</label>
              <select id="irrigation_type" name="irrigation_type" value={form.irrigation_type} onChange={handleChange}>
                <option value="">Select</option>
                {IRRIGATION_TYPES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="planting_season">Planting Season</label>
              <select id="planting_season" name="planting_season" value={form.planting_season} onChange={handleChange}>
                <option value="">Select</option>
                {PLANTING_SEASONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="expected_harvest_month">Expected Harvest Month</label>
              <select id="expected_harvest_month" name="expected_harvest_month" value={form.expected_harvest_month} onChange={handleChange}>
                <option value="">Select</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="estimated_yield_per_ha">Estimated Yield/ha</label>
              <input id="estimated_yield_per_ha" name="estimated_yield_per_ha" type="number" step="0.01" min="0" value={form.estimated_yield_per_ha} onChange={handleChange} placeholder="e.g. 3.5" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="previous_yield">Previous Yield</label>
              <input id="previous_yield" name="previous_yield" type="number" step="0.01" min="0" value={form.previous_yield} onChange={handleChange} placeholder="e.g. 2.8" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="seed_variety">Seed Variety</label>
              <input id="seed_variety" name="seed_variety" value={form.seed_variety} onChange={handleChange} placeholder="e.g. Improved maize" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="fertilizer_use">Fertilizer Use</label>
              <input id="fertilizer_use" name="fertilizer_use" value={form.fertilizer_use} onChange={handleChange} placeholder="e.g. NPK, Urea" />
            </div>
            <div className="farmer-form-field farmer-form-field-full">
              <label htmlFor="pest_disease_challenges">Pest/Disease Challenges</label>
              <textarea id="pest_disease_challenges" name="pest_disease_challenges" value={form.pest_disease_challenges} onChange={handleChange} rows={2} placeholder="Describe challenges" />
            </div>
          </div>
        </details>
        <details className="farmer-form-details">
          <summary>Layer 3 — Financial & Market Data</summary>
          <div className="farmer-form-grid">
            <div className="farmer-form-field">
              <label htmlFor="bank_account_access">Bank Account Access</label>
              <select id="bank_account_access" name="bank_account_access" value={form.bank_account_access} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="mobile_money_access">Mobile Money Access</label>
              <select id="mobile_money_access" name="mobile_money_access" value={form.mobile_money_access} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="seasonal_revenue">Seasonal Revenue (FCFA)</label>
              <input id="seasonal_revenue" name="seasonal_revenue" type="number" min="0" value={form.seasonal_revenue} onChange={handleChange} placeholder="e.g. 500000" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="existing_loans">Existing Loans (FCFA)</label>
              <input id="existing_loans" name="existing_loans" type="number" min="0" value={form.existing_loans} onChange={handleChange} placeholder="e.g. 100000" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="cooperative_membership">Cooperative Membership</label>
              <select id="cooperative_membership" name="cooperative_membership" value={form.cooperative_membership} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="current_buyers">Current Buyers</label>
              <input id="current_buyers" name="current_buyers" value={form.current_buyers} onChange={handleChange} placeholder="e.g. Local traders" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="storage_method">Storage Method</label>
              <input id="storage_method" name="storage_method" value={form.storage_method} onChange={handleChange} placeholder="e.g. Silos, bags" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="post_harvest_loss_percent">Post-Harvest Loss (%)</label>
              <input id="post_harvest_loss_percent" name="post_harvest_loss_percent" type="number" step="0.1" min="0" max="100" value={form.post_harvest_loss_percent} onChange={handleChange} placeholder="e.g. 15" />
            </div>
          </div>
        </details>
        <details className="farmer-form-details">
          <summary>Layer 4 — Assets & Capacity</summary>
          <div className="farmer-form-grid">
            <div className="farmer-form-field">
              <label htmlFor="land_ownership">Land Ownership</label>
              <select id="land_ownership" name="land_ownership" value={form.land_ownership} onChange={handleChange}>
                <option value="">Select</option>
                {LAND_OWNERSHIP.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="years_farming">Years Farming</label>
              <input id="years_farming" name="years_farming" type="number" min="0" value={form.years_farming} onChange={handleChange} placeholder="e.g. 10" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="access_to_tractor_services">Access to Tractor Services</label>
              <select id="access_to_tractor_services" name="access_to_tractor_services" value={form.access_to_tractor_services} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="access_to_labour">Access to Labour</label>
              <select id="access_to_labour" name="access_to_labour" value={form.access_to_labour} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="farmer-form-field">
              <label htmlFor="storage_capacity">Storage Capacity</label>
              <input id="storage_capacity" name="storage_capacity" value={form.storage_capacity} onChange={handleChange} placeholder="e.g. 5 tonnes" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="mechanization_level">Mechanization Level</label>
              <select id="mechanization_level" name="mechanization_level" value={form.mechanization_level} onChange={handleChange}>
                <option value="">Select</option>
                {MECHANIZATION_LEVELS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </details>
        <details className="farmer-form-details">
          <summary>Layer 5 — Verification & Traceability</summary>
          <div className="farmer-form-grid">
            <div className="farmer-form-field">
              <label htmlFor="geo_tagged_farm_photos">Geo-tagged Farm Photos (URL)</label>
              <input id="geo_tagged_farm_photos" name="geo_tagged_farm_photos" value={form.geo_tagged_farm_photos} onChange={handleChange} placeholder="URL or reference" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="national_id">National ID (optional)</label>
              <input id="national_id" name="national_id" value={form.national_id} onChange={handleChange} placeholder="ID number" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="next_of_kin">Next of Kin (optional)</label>
              <input id="next_of_kin" name="next_of_kin" value={form.next_of_kin} onChange={handleChange} placeholder="Name, phone" />
            </div>
            <div className="farmer-form-field">
              <label htmlFor="consent_to_data_use">Consent to Data Use</label>
              <select id="consent_to_data_use" name="consent_to_data_use" value={form.consent_to_data_use} onChange={handleChange}>
                <option value="">—</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </details>

        <div className="farmer-form-grid">
          <div className="farmer-form-field">
            <label htmlFor="gps_lat">GPS Latitude</label>
            <input
              id="gps_lat"
              name="gps_lat"
              type="number"
              step="any"
              value={form.gps_lat}
              onChange={handleChange}
              placeholder="e.g. 6.3703"
            />
          </div>
          <div className="farmer-form-field">
            <label htmlFor="gps_lng">GPS Longitude</label>
            <input
              id="gps_lng"
              name="gps_lng"
              type="number"
              step="any"
              value={form.gps_lng}
              onChange={handleChange}
              placeholder="e.g. 2.3912"
            />
          </div>
          <div className="farmer-form-field farmer-form-map-pick">
            <label>Location</label>
            <button type="button" className="farmer-form-map-btn" onClick={() => setShowMapPicker(true)}>
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
        <div className="farmer-form-field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes"
          />
        </div>
        <div className="farmer-form-actions">
          <button type="button" className="farmer-form-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="farmer-form-submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Farmer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FarmerForm;
