import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import { ArrowLeft, FileText, Calendar, UserRound, Activity } from 'lucide-react';
import controlScheduleService from '../../services/controlScheduleService';
import examinationService from '../../services/examinationService';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatGender, formatStatus } from '../../utils/formatLabel';

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

const AdminPatientDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchPatient = async () => {
    try {
      // Patient
      const patientData = await patientService.getById(id);
      setPatient(patientData.data || patientData);

      // Examination History
      const examData =
        await examinationService.getByPatient(id);

      setExaminations(
        examData.data || examData || []
      );

      // Control Schedule
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
        Pasien tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/patients')}
          aria-label="Kembali ke daftar pasien"
          className="mt-2 text-gray-500 hover:text-[#12223a] active:scale-90 transition-all duration-150"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#12223a]">
            Detail Pasien
          </h1>

          <p className="text-gray-500 mt-1">
            {patient.medical_record_number}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CARD */}
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
                {formatGender(patient.gender)},
lahir{' '}
{new Date(patient.date_of_birth).toLocaleDateString(
  'id-ID',
  {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
)}
              </p>

              <span className="mt-5 px-4 py-2 rounded-full text-blue-600 bg-blue-50 border border-blue-100">
                Status: {formatStatus(patient.status)}
              </span>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <UserRound className="text-[#12223a] flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Dokter Penanggung Jawab
                  </p>

                  <p className="font-semibold text-[#12223a] truncate">
                    {patient.doctor_name}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Activity className="text-[#12223a] flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Kontak
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
          {/* Examination History */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
    <FileText size={20} className="flex-shrink-0" />
    <h2 className="text-xl sm:text-2xl font-bold text-[#12223a]">
      Riwayat Pemeriksaan
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
              {exam.examination_date}
            </span>
          </div>

          <p className="mt-5 text-base sm:text-lg">
            <strong>Keluhan:</strong>{' '}
            {exam.complaint || '-'}
          </p>

          <p className="mt-3 text-base sm:text-lg">
            <strong>Tindakan:</strong>{' '}
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
        Data pemeriksaan tidak ditemukan.
      </p>
    )}
  </div>
</div>

          {/* Control Schedule */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
    <Calendar size={20} className="flex-shrink-0" />
    <h2 className="text-xl sm:text-2xl font-bold text-[#12223a]">
      Jadwal Kontrol
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
                {new Date(schedule.control_date)
                  .toLocaleString('id-ID', {
                    month: 'short',
                  })
                  .toUpperCase()}
              </span>

              <span className="text-3xl font-bold">
                {new Date(schedule.control_date).getDate()}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#12223a]">
                Jadwal Kontrol Lanjutan
              </h3>

              <p className="text-gray-500">
                {schedule.control_time || '-'}
              </p>
            </div>
          </div>

          <span className="px-4 py-2 rounded-full text-blue-600 bg-blue-50 border border-blue-100 whitespace-nowrap">
            {formatStatus(schedule.status)}
          </span>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 py-6">
        Jadwal kontrol tidak ditemukan.
      </p>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPatientDetailPage;
