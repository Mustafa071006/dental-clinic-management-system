import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import examinationService from '../../services/examinationService';
import controlScheduleService from '../../services/controlScheduleService';
import {
  ArrowLeft,
  FileText,
  Calendar,
  UserRound,
  Activity,
  Plus,
} from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import FormSelect from '../../components/ui/FormSelect';
import Button from '../../components/ui/Button';
import useToast from '../../hooks/useToast';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
  { value: 'COMPLETE', label: 'COMPLETE' },
];

const DetailSkeleton = () => (
  <div className="p-4 sm:p-8 animate-fadeIn">
    <div className="flex items-start gap-4 mb-8">
      <Skeleton className="w-8 h-8 rounded-lg mt-2" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full mb-5" />
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="lg:col-span-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    </div>
  </div>
);

const DoctorPatientDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [patient, setPatient] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [controlSchedules, setControlSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientStatus, setPatientStatus] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientData = await patientService.getById(id);
        const patientInfo =
  patientData.data || patientData;

setPatient(patientInfo);
setPatientStatus(patientInfo.status);

        const examData =
            await examinationService.getByPatient(id);

        const schedules =
            await controlScheduleService.getByPatient(id);

        setControlSchedules(
            schedules.data || schedules
            );


        setExaminations(
          examData.data || examData || []
        );

        const scheduleData =
          await controlScheduleService.getByPatient(id);

        setSchedules(
          scheduleData.data || scheduleData || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-gray-400 animate-fadeIn">
        Patient not found.
      </div>
    );
  }

  const updatePatientStatus = async (
  newStatus
) => {
  try {
    await patientService.updateStatus(
      patient.id,
      newStatus
    );

    setPatientStatus(newStatus);

    setPatient((prev) => ({
      ...prev,
      status: newStatus,
    }));
    toast.success('Patient status updated.');
  } catch (err) {
    console.error(err);
    toast.error('Failed to update patient status.');
  }
};

const updateScheduleStatus = async (
  scheduleId,
  status
) => {
  try {
    await controlScheduleService.update(
      scheduleId,
      { status }
    );

    setControlSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? { ...s, status }
          : s
      )
    );
    toast.success('Schedule status updated.');
  } catch (err) {
    console.error(err);
    toast.error('Failed to update schedule status.');
  }
};

  return (
    <div className="p-4 sm:p-8 animate-fadeInUp">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/doctor/patients')}
            aria-label="Back to patients"
            className="mt-2 text-gray-500 hover:text-[#12223a] active:scale-90 transition-all duration-150"
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12223a]">
              Patient Details
            </h1>

            <p className="text-gray-500 mt-1">
              {patient.medical_record_number}
            </p>
          </div>
        </div>

        {/* ADD EXAMINATION */}
        <Button
          onClick={() =>
            navigate(
              `/doctor/patients/${patient.id}/add-examination`
            )
          }
          icon={Plus}
          className="w-full sm:w-auto"
        >
          Add Examination
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-[#12223a]">
                {patient.full_name?.charAt(0)}
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-[#12223a] text-center break-words">
                {patient.full_name}
              </h2>

              <p className="text-gray-500 mt-1 text-center">
                {patient.gender}, born{' '}
                {patient.date_of_birth?.split('T')[0]}
              </p>

              <div className="mt-5 w-full">
                <FormSelect
                  id="patient-status"
                  label="Patient Status"
                  value={patientStatus}
                  onChange={(e) => updatePatientStatus(e.target.value)}
                  options={STATUS_OPTIONS}
                />
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <UserRound
                  className="text-[#12223a] flex-shrink-0"
                  size={20}
                />

                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Assigned Doctor
                  </p>

                  <p className="font-semibold text-[#12223a] truncate">
                    {patient.doctor_name}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Activity
                  className="text-[#12223a] flex-shrink-0"
                  size={20}
                />

                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Contact
                  </p>

                  <p className="font-semibold text-[#12223a] truncate">
                    {patient.phone || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8 space-y-6">

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#12223a]">
    Control Schedule History
  </h2>

  <div className="space-y-4">
    {controlSchedules.length > 0 ? (
      controlSchedules.map((schedule) => (
      <div
        key={schedule.id}
        className="border rounded-2xl p-4 hover:border-gray-300 transition-colors duration-150"
      >
        <p>
          {schedule.control_date}
        </p>

        <p>
          Status:
          <span className="font-semibold ml-2">
            {schedule.status}
          </span>
        </p>

        {schedule.status === 'PENDING' && (
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() =>
                updateScheduleStatus(
                  schedule.id,
                  'COMPLETED'
                )
              }
              className="px-3 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-lg transition-all duration-150"
            >
              Complete
            </button>

            <button
              onClick={() =>
                updateScheduleStatus(
                  schedule.id,
                  'CANCELLED'
                )
              }
              className="px-3 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg transition-all duration-150"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      ))
    ) : (
      <p className="text-center text-gray-500 py-4">
        No control schedule history.
      </p>
    )}
  </div>
</div>
          {/* EXAMINATION HISTORY */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <FileText size={20} className="flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#12223a]">
                Examination History
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {examinations.length > 0 ? (
                examinations.map((exam) => (
                  <div
                    key={exam.id}
                    className="border rounded-2xl p-4 sm:p-6 mb-4 hover:border-gray-300 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#12223a]">
                        {exam.diagnosis || '-'}
                      </h3>

                      <span className="px-4 py-2 rounded-xl border bg-gray-50 text-sm whitespace-nowrap">
  {new Date(exam.examination_date).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )}
</span>
                    </div>

                    <p className="mt-5 text-base sm:text-lg">
                      <strong>Complaint:</strong>{' '}
                      {exam.complaint || '-'}
                    </p>

                    <p className="mt-3 text-base sm:text-lg">
                      <strong>Treatment:</strong>{' '}
                      {exam.treatment || '-'}
                    </p>

                    {exam.notes && (
                      <div className="mt-5 border rounded-xl p-4 italic text-gray-500">
                        {exam.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">
                  No examinations found.
                </p>
              )}
            </div>
          </div>

          {/* CONTROL SCHEDULE */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <Calendar size={20} className="flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#12223a]">
                Control Schedule
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 hover:border-gray-300 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 border flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-sm text-gray-500">
                          {new Date(
                            schedule.control_date
                          )
                            .toLocaleString('en-US', {
                              month: 'short',
                            })
                            .toUpperCase()}
                        </span>

                        <span className="text-3xl font-bold">
                          {new Date(
                            schedule.control_date
                          ).getDate()}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#12223a]">
                          Follow-up Appointment
                        </h3>

                        <p className="text-gray-500">
                          {schedule.control_time || '-'}
                        </p>
                      </div>
                    </div>

                    <span className="px-4 py-2 rounded-full text-blue-600 bg-blue-50 border border-blue-100 whitespace-nowrap">
                      {schedule.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">
                  No control schedules found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientDetailPage;
