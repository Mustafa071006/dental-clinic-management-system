import { useState, useEffect } from 'react';
import { Users, Calendar, ClipboardList } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import PatientAvatar from '../../components/ui/PatientAvatar';
import { Skeleton } from '../../components/ui/Skeleton';
import useAuth from '../../hooks/useAuth';
import patientService from '../../services/patientService';
import examinationService from '../../services/examinationService';
import controlScheduleService from '../../services/controlScheduleService';
import { formatDate, formatTime } from '../../utils/formatDate';

const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    myPatients: 0,
    todayControls: 0,
    recentExams: 0,
  });
  const [upcomingControls, setUpcomingControls] = useState([]);
  const [recentExams, setRecentExams] = useState([]);

  // Greeting berdasarkan jam
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const doctorFirstName = user?.name
    ? user.name.replace(/^Dr\.\s*/i, '').split(' ')[0]
    : '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pRes, eRes, cRes] = await Promise.allSettled([
          patientService.getAll(),
          examinationService.getAll(),
          controlScheduleService.getAll(),
        ]);

        const patients =
          pRes.status === 'fulfilled'
            ? pRes.value?.data || pRes.value || []
            : [];

        const exams =
          eRes.status === 'fulfilled'
            ? eRes.value?.data || eRes.value || []
            : [];

        const controls =
  cRes.status === 'fulfilled'
    ? cRes.value?.data || cRes.value || []
    : [];

const today = new Date().toLocaleDateString('en-CA');

const todayControls = controls.filter((c) => {
  const controlDate = new Date(c.control_date)
    .toLocaleDateString('en-CA');

  return (
    controlDate === today &&
    c.status === 'PENDING'
  );
});

        setStats({
  myPatients: patients.length,
  todayControls: todayControls.length,
  recentExams: exams.length,
});

const upcoming = controls
  .filter((c) => {
    const controlDate = new Date(c.control_date)
      .toLocaleDateString('en-CA');

    return (
      c.status === 'PENDING' &&
      controlDate >= today
    );
  })
  .slice(0, 3);

setUpcomingControls(upcoming);
setRecentExams(exams.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#12223a]">My Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          {getGreeting()}, Dr. {doctorFirstName}! Here is your schedule for today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="My Patients"
          value={stats.myPatients}
          icon={Users}
          iconColor="text-blue-400"
          isLoading={isLoading}
        />
        <StatCard
          label="Today's Controls"
          value={stats.todayControls}
          icon={Calendar}
          iconColor="text-blue-400"
          isLoading={isLoading}
        />
        <StatCard
          label="Recent Examinations"
          value={stats.recentExams}
          icon={ClipboardList}
          iconColor="text-blue-400"
          isLoading={isLoading}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Control Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#12223a] mb-4">
            Upcoming Control Schedule
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : upcomingControls.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8 animate-fadeIn">
              No upcoming controls.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingControls.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100/70 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PatientAvatar
                      name={c.patient_name || c.patient?.name}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#12223a] truncate">
                        {c.patient_name || c.patient?.name || '-'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {formatDate(c.control_date || c.date)} at{' '}
                        {formatTime(c.time || c.control_time)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Examinations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#12223a] mb-4">
            Recent Examinations
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : recentExams.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8 animate-fadeIn">
              No recent examinations.
            </p>
          ) : (
            <div className="space-y-4">
              {recentExams.map((e, idx) => (
                <div
                  key={e.id || idx}
                  className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-sm font-semibold text-[#12223a] truncate">
                      {e.patient_name || e.patient?.name || '-'}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(e.date || e.examination_date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Diagnosis:</span>{' '}
                    {e.diagnosis || '-'}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Treatment:</span>{' '}
                    {e.treatment || '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
