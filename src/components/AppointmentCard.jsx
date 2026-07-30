import React from 'react';
import { Calendar, Clock, User, Stethoscope, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
export const AppointmentCard = ({ appointment, userRole, onStatusUpdate, onWritePrescription, onViewPDF }) => {
    const statusBadges = {
        Pending: { variant: 'warning', label: 'Pending Confirmation' },
        Accepted: { variant: 'info', label: 'Accepted' },
        Rejected: { variant: 'danger', label: 'Rejected' },
        Completed: { variant: 'success', label: 'Completed' },
        Cancelled: { variant: 'neutral', label: 'Cancelled' }
    };
    const badge = statusBadges[appointment.status] || { variant: 'neutral', label: appointment.status };
    return (<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Calendar className="w-4 h-4 text-blue-600"/>
          <span>{appointment.date}</span>
          <span className="text-slate-300">•</span>
          <Clock className="w-4 h-4 text-emerald-600"/>
          <span>{appointment.timeSlot}</span>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Doctor</p>
          <div className="flex items-center gap-2 mt-1">
            <Stethoscope className="w-4 h-4 text-blue-600"/>
            <p className="font-semibold text-slate-800">{appointment.doctorName}</p>
          </div>
          <p className="text-xs text-slate-500 ml-6">{appointment.doctorSpecialization}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Patient</p>
          <div className="flex items-center gap-2 mt-1">
            <User className="w-4 h-4 text-emerald-600"/>
            <p className="font-semibold text-slate-800">{appointment.patientName}</p>
          </div>
          <p className="text-xs text-slate-500 ml-6">{appointment.patientEmail}</p>
        </div>
      </div>

      {appointment.reason && (<div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <span className="font-semibold text-slate-600">Consultation Reason: </span>
          <span className="text-slate-800">{appointment.reason}</span>
          {appointment.symptoms && (<div className="mt-1 text-slate-600">
              <span className="font-semibold">Symptoms: </span>
              {appointment.symptoms}
            </div>)}
        </div>)}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-900">Fee: ${appointment.fee}</span>

        <div className="flex items-center gap-2">
          {userRole === 'Doctor' && appointment.status === 'Pending' && onStatusUpdate && (<>
              <Button onClick={() => onStatusUpdate(appointment.id, 'Accepted')} variant="primary" size="sm" icon={<CheckCircle className="w-3.5 h-3.5"/>}>
                Accept
              </Button>
              <Button onClick={() => onStatusUpdate(appointment.id, 'Rejected')} variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5"/>}>
                Reject
              </Button>
            </>)}

          {userRole === 'Doctor' && appointment.status === 'Accepted' && (<>
              {onStatusUpdate && (<Button onClick={() => onStatusUpdate(appointment.id, 'Completed')} variant="primary" size="sm" icon={<CheckCircle className="w-3.5 h-3.5"/>}>
                  Mark Complete
                </Button>)}
              {onWritePrescription && (<Button onClick={() => onWritePrescription(appointment)} variant="secondary" size="sm" icon={<FileText className="w-3.5 h-3.5"/>}>
                  Rx Prescription
                </Button>)}
            </>)}

          {userRole === 'Patient' && (appointment.status === 'Pending' || appointment.status === 'Accepted') && onStatusUpdate && (<Button onClick={() => onStatusUpdate(appointment.id, 'Cancelled')} variant="outline" size="sm" icon={<AlertCircle className="w-3.5 h-3.5"/>}>
              Cancel
            </Button>)}

          {onViewPDF && (appointment.status === 'Completed' || appointment.status === 'Accepted') && (<Button onClick={() => onViewPDF(appointment)} variant="secondary" size="sm" icon={<FileText className="w-3.5 h-3.5"/>}>
              Download PDF Report
            </Button>)}
        </div>
      </div>
    </div>);
};
