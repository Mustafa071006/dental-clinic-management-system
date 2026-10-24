import { useState, useEffect, useMemo, memo } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import StatusBadge from '../../components/ui/StatusBadge';
import PatientAvatar from '../../components/ui/PatientAvatar';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTableRows } from '../../components/ui/Skeleton';
import controlScheduleService from '../../services/controlScheduleService';
import { formatDate, formatTime } from '../../utils/formatDate';
import useDebounce from '../../hooks/useDebounce';

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'scheduled', label: 'Terjadwal' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const TABLE_HEADERS = ['Pasien', 'Dokter', 'Tanggal Kontrol', 'Waktu', 'Status'];

const ScheduleRow = memo(({ s }) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <PatientAvatar
          name={s.patient_name || s.patient?.name}
          size="sm"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#12223a] whitespace-nowrap">
            {s.patient_name || s.patient?.name || '-'}
          </p>
          <p className="text-xs text-gray-400">
            {s.patient_mrn || s.patient?.mrn || s.mrn || ''}
          </p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {s.doctor_name || s.doctor?.name || '-'}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {formatDate(s.control_date || s.date)}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {formatTime(s.time || s.control_time)}
    </td>
    <td className="px-6 py-4">
      <StatusBadge status={s.status} />
    </td>
  </tr>
));
ScheduleRow.displayName = 'ScheduleRow';

const AdminControlSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await controlScheduleService.getAll();
        setSchedules(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return schedules.filter((s) => {
      const patientName = (
        s.patient_name ||
        s.patient?.name ||
        ''
      ).toLowerCase();
      const doctorName = (
        s.doctor_name ||
        s.doctor?.name ||
        ''
      ).toLowerCase();

      const matchSearch =
        !debouncedSearch ||
        patientName.includes(debouncedSearch.toLowerCase()) ||
        doctorName.includes(debouncedSearch.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (s.status || '').toLowerCase() === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [schedules, debouncedSearch, statusFilter]);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Jadwal Kontrol"
        subtitle="Kelola jadwal kontrol dan tindak lanjut pasien."
      />

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan pasien atau dokter..."
          className="flex-1"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState message="Jadwal kontrol tidak ditemukan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-gray-100">
                <tr>
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
                <SkeletonTableRows rows={6} columns={TABLE_HEADERS.length} />
              ) : (
                <tbody>
                  {filtered.map((s, idx) => (
                    <ScheduleRow key={s.id || idx} s={s} />
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

export default AdminControlSchedulePage;
