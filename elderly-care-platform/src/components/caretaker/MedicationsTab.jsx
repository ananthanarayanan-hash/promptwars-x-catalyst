import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Pill,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  PackageOpen,
  Info,
  Check,
  X
} from 'lucide-react';

export default function MedicationsTab() {
  const {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    markDose
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSlot, setFilterSlot] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosage: '1 Tablet',
    category: 'General',
    timeSlot: 'Morning',
    scheduledTime: '08:30 AM',
    mealRelation: 'After breakfast',
    seniorInstructions: '',
    prescribedBy: 'Dr. Arvind Swaminathan',
    stockLeft: 30,
    refillThreshold: 10,
    shape: 'Round White Tablet'
  });

  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      genericName: '',
      dosage: '1 Tablet',
      category: 'General',
      timeSlot: 'Morning',
      scheduledTime: '08:30 AM',
      mealRelation: 'After breakfast',
      seniorInstructions: '',
      prescribedBy: 'Dr. Arvind Swaminathan',
      stockLeft: 30,
      refillThreshold: 10,
      shape: 'Round White Tablet'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setFormData({
      name: med.name,
      genericName: med.genericName,
      dosage: med.dosage,
      category: med.category || 'General',
      timeSlot: med.timeSlot,
      scheduledTime: med.scheduledTime,
      mealRelation: med.mealRelation,
      seniorInstructions: med.seniorInstructions,
      prescribedBy: med.prescribedBy,
      stockLeft: med.stockLeft,
      refillThreshold: med.refillThreshold,
      shape: med.shape
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingMed) {
      updateMedication(editingMed.id, formData);
    } else {
      addMedication(formData);
    }
    setIsModalOpen(false);
  };

  const filteredMeds = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSlot = filterSlot === 'ALL' || med.timeSlot.toLowerCase() === filterSlot.toLowerCase();
    return matchesSearch && matchesSlot;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medication Schedule & Pharmacy Stock</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage daily prescription schedules, stock levels, and elderly instructions for Ramesh Iyer
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search medicine name, generic salt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['ALL', 'Morning', 'Afternoon', 'Evening', 'Night'].map((slot) => (
            <button
              key={slot}
              onClick={() => setFilterSlot(slot)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filterSlot === slot
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const isLowStock = med.stockLeft <= med.refillThreshold;
          const isTaken = med.status === 'taken';
          const isMissed = med.status === 'missed';

          return (
            <div
              key={med.id}
              className={`p-5 rounded-2xl border-2 bg-white transition-all shadow-sm flex flex-col justify-between ${
                isTaken ? 'border-emerald-300' : isMissed ? 'border-rose-300' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{med.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-700 border border-slate-300">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{med.genericName}</p>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(med)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Medication"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${med.name} from schedule?`)) {
                          deleteMedication(med.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Schedule & Meal relation */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Schedule</span>
                    <strong className="text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {med.scheduledTime} ({med.timeSlot})
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Meal Relation</span>
                    <strong className="text-slate-800 text-xs block mt-0.5">
                      {med.mealRelation}
                    </strong>
                  </div>
                </div>

                {/* Senior Plain-Language Instructions */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-800 leading-relaxed mb-3">
                  <span className="font-bold text-blue-900 block mb-0.5">Elderly Instructions:</span>
                  "{med.seniorInstructions}"
                </div>

                {/* Inventory / Stock Warning */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <PackageOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Stock Remaining:</span>
                    <strong className={isLowStock ? 'text-red-600 font-bold' : 'text-slate-800'}>
                      {med.stockLeft} doses
                    </strong>
                  </div>

                  {isLowStock && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock - Refill!
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Toggle Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  isTaken
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isMissed
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Status: {med.status.toUpperCase()}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => markDose(med.id, 'taken')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isTaken ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                  >
                    Taken
                  </button>
                  <button
                    onClick={() => markDose(med.id, 'missed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isMissed ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-800'
                    }`}
                  >
                    Missed
                  </button>
                  <button
                    onClick={() => markDose(med.id, 'upcoming')}
                    className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingMed ? 'Edit Medication Schedule' : 'Add New Prescription'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Medicine Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Glycomet-GP 1 Forte"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Generic Salt & Strength
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin 1000mg + Glimepiride 1mg"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Time Slot
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={formData.scheduledTime}
                    placeholder="08:30 AM"
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Relation to Meals
                </label>
                <select
                  value={formData.mealRelation}
                  onChange={(e) => setFormData({ ...formData, mealRelation: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Before breakfast (Empty stomach)">Before breakfast (Empty stomach)</option>
                  <option value="After breakfast">After breakfast</option>
                  <option value="Before lunch">Before lunch</option>
                  <option value="After lunch">After lunch</option>
                  <option value="With dinner">With dinner</option>
                  <option value="After dinner">After dinner</option>
                  <option value="Before bedtime">Before bedtime</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Plain-Language Instructions for Senior *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Take 1 tablet with warm water after eating idli. Do not skip."
                  value={formData.seniorInstructions}
                  onChange={(e) => setFormData({ ...formData, seniorInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Stock (Tablets)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockLeft}
                    onChange={(e) => setFormData({ ...formData, stockLeft: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Prescribing Doctor
                  </label>
                  <input
                    type="text"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md"
                >
                  {editingMed ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
