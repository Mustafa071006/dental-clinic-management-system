import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, ClipboardList, Calendar } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import PatientAvatar from '../../components/ui/PatientAvatar';
import { SkeletonTableRows } from '../../components/ui/Skeleton';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import examinationService from '../../services/examinationService';
import controlScheduleService from '../../services/controlScheduleService';

const TABLE_HEADERS = ['Nama Pasien', 'No. RM', 'Status', 'Dokter Penanggung Jawab'];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    examinations: 0,
    todayControls: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [patientsRes, doctorsRes, examsRes, controlsRes] =
          await Promise.allSettled([
            patientService.getAll(),
            doctorService.getAll(),
            examinationService.getAll(),
            controlScheduleService.getAll(),
          ]);

        const patients =
          patientsRes.status === 'fulfilled'
            ? patientsRes.value?.data || patientsRes.value || []
            : [];

        const doctors =
  doctorsRes.status === 'fulfilled'
    ? (doctorsRes.value?.data || doctorsRes.value || []).filter(
        (u) =>
          u.role === 'DOCTOR' ||
          u.role_name === 'DOCTOR'
      )
    : [];

        const exams =
          examsRes.status === 'fulfilled'
            ? examsRes.value?.data || examsRes.value || []
            : [];

        const controls =
          controlsRes.status === 'fulfilled'
            ? controlsRes.value?.data || controlsRes.value || []
            : [];

        // Hitung today's controls
        const today = new Date().toISOString().split('T')[0];
        const todayControls = controls.filter((c) => {
          const d = c.control_date || c.date || '';
          return d.startsWith(today);
        });

        setStats({
          patients: patients.length,
          doctors: doctors.length,
          examinations: exams.length,
          todayControls: todayControls.length,
        });

        // Ambil 5 pasien terbaru
        setRecentPatients(patients.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#12223a]">Ringkasan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang kembali! Berikut ringkasan aktivitas hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Pasien"
          value={stats.patients}
          icon={Users}
          iconColor="text-gray-400"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Dokter"
          value={stats.doctors}
          icon={Stethoscope}
          iconColor="text-gray-400"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Pemeriksaan"
          value={stats.examinations}
          icon={ClipboardList}
          iconColor="text-gray-400"
          isLoading={isLoading}
        />
        <StatCard
          label="Kontrol Hari Ini"
          value={stats.todayControls}
          icon={Calendar}
          iconColor="text-gray-400"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Patient Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#12223a]">
            Aktivitas Pasien Terbaru
          </h2>
          <button
            onClick={() => navigate('/admin/patients')}
            className="text-sm font-medium text-[#12223a] hover:text-gold transition-colors duration-150"
          >
            Lihat Semua
          </button>
        </div>

        {!isLoading && recentPatients.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12 animate-fadeIn">
            Data pasien tidak ditemukan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              {isLoading ? (
                <SkeletonTableRows rows={5} columns={TABLE_HEADERS.length} />
              ) : (
                <tbody>
                  {recentPatients.map((patient, idx) => (
                    <tr
                      key={patient.id || idx}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <PatientAvatar
                            name={patient.name || patient.full_name}
                            imageUrl={patient.photo}
                            size="sm"
                          />
                          <span className="text-sm font-semibold text-[#12223a] whitespace-nowrap">
                            {patient.name || patient.full_name || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {patient.mrn || patient.medical_record_number || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={patient.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {patient.doctor_name ||
                          patient.assigned_doctor ||
                          patient.doctor?.name ||
                          '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
