import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Phone,
  FileText,
  Mail,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Stethoscope
} from 'lucide-react';

export default function AppointmentsTab() {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    sendAppointmentReminderEmail
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: 'Cardiologist',
    hospital: '',
    dateTime: '',
    purpose: '',
    instructions: '',
    contactNumber: '+91 80 2502 4444'
  });

  const handleOpenAdd = () => {
    setEditingApt(null);
    setFormData({
      doctorName: '',
      specialty: 'Cardiologist',
      hospital: 'Manipal Hospital, Old Airport Road, Bengaluru',
      dateTime: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 16),
      purpose: 'Regular Consultation & Vitals Check',
      instructions: 'Bring blood test reports and home BP readings log.',
      contactNumber: '+91 80 2502 4444'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (apt) => {
    setEditingApt(apt);
    setFormData({
      doctorName: apt.doctorName,
      specialty: apt.specialty,
      hospital: apt.hospital,
      dateTime: apt.dateTime,
      purpose: apt.purpose,
      instructions: apt.instructions,
      contactNumber: apt.contactNumber
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.doctorName) return;

    if (editingApt) {
      updateAppointment(editingApt.id, formData);
    } else {
      addAppointment(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Doctor Appointments & Clinic Visits</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of consulting specialists, diagnostic preparation notes, and send proactive reminders
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((apt) => {
          const aptDate = new Date(apt.dateTime);
          const isUpcoming = aptDate > new Date();

          return (
            <div
              key={apt.id}
              className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col lg:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{apt.doctorName}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {apt.specialty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.hospital}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Consultation Date & Time</span>
                    <strong className="text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {aptDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {aptDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">Consultation Purpose</span>
                    <strong className="text-slate-800 text-sm block mt-0.5 truncate">
                      {apt.purpose}
                    </strong>
                  </div>
                </div>

                {/* Preparation & Doctor Notes */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-slate-800 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Clinical Preparation & Notes:</span>
                  </div>
                  <p className="text-slate-700 font-medium">"{apt.instructions}"</p>
                </div>
              </div>

              {/* Action Buttons Column */}
              <div className="flex flex-row lg:flex-col justify-end lg:justify-between items-center lg:items-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {apt.status || 'Confirmed'}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => sendAppointmentReminderEmail(apt.id)}
                    title="Send reminder email alert to caregiver & patient"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Reminder Email</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(apt)}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove appointment with ${apt.doctorName}?`)) {
                        deleteAppointment(apt.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingApt ? 'Edit Doctor Appointment' : 'Schedule Doctor Appointment'}
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
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvind Swaminathan"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Cardiologist"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hospital / Clinic Name & Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manipal Hospital, HAL Old Airport Road, Bengaluru"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Clinic Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Consultation Purpose / Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Semi-Annual BP Review & ECG"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preparation & Fasting Instructions
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. 12 hours fasting for Lipid Profile blood draw at 8:30 AM."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                  {editingApt ? 'Save Changes' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
