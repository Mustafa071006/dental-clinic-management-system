import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import StatusBadge from '../../components/ui/StatusBadge';
import PatientAvatar from '../../components/ui/PatientAvatar';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTableRows } from '../../components/ui/Skeleton';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import { formatDate } from '../../utils/formatDate';
import useDebounce from '../../hooks/useDebounce';
import { formatGender } from '../../utils/formatLabel';

const TABLE_HEADERS = ['Pasien', 'No. RM', 'Kontak', 'Dokter Penanggung Jawab', 'Status', 'Aksi'];

const PatientRow = memo(({ patient: p, onView }) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
    {/* Patient */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <PatientAvatar
          name={p.name || p.full_name}
          imageUrl={p.photo}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#12223a] truncate">
            {p.name || p.full_name || '-'}
          </p>
          <p className="text-xs text-gray-400">
            {formatGender(p.gender)}
            {p.date_of_birth
              ? `, ${formatDate(p.date_of_birth)}`
              : ''}
          </p>
        </div>
      </div>
    </td>
    {/* MRN */}
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {p.medical_record_number || p.mrn || '-'}
    </td>
    {/* Contact */}
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {p.phone || p.phone_number || '-'}
    </td>
    {/* Assigned Doctor */}
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {p.doctor_name ||
        p.doctor?.name ||
        p.assigned_doctor ||
        '-'}
    </td>
    {/* Status */}
    <td className="px-6 py-4">
      <StatusBadge status={p.status} />
    </td>
    {/* Actions */}
    <td className="px-6 py-4">
      <button
        onClick={() => onView(p.id)}
        className="text-gray-400 hover:text-[#12223a] active:scale-90 transition-all duration-150"
        title="Lihat detail"
        aria-label={`Lihat detail ${p.name || p.full_name || 'pasien'}`}
      >
        <Eye size={18} strokeWidth={1.8} />
      </button>
    </td>
  </tr>
));
PatientRow.displayName = 'PatientRow';

const AdminPatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pRes, dRes] = await Promise.allSettled([
  patientService.getAll(),
  doctorService.getAll(),
]);

        if (pRes.status === 'fulfilled') {
          setPatients(pRes.value?.data || pRes.value || []);
        }
        if (dRes.status === 'fulfilled') {
  const allDoctors = dRes.value?.data || [];
  setDoctors(allDoctors);
}
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'complete', label: 'Selesai' },
  { value: 'inactive', label: 'Nonaktif' },
];

  const doctorOptions = useMemo(() => {
    const opts = [{ value: '', label: 'Semua Dokter' }];
    doctors.forEach((d) => {
      opts.push({ value: String(d.id), label: d.name });
    });
    return opts;
  }, [doctors]);

  const filtered = useMemo(() => {
  return patients.filter((p) => {
    const name = (p.name || p.full_name || '').toLowerCase();

    const mrn = (
      p.medical_record_number ||
      p.mrn ||
      ''
    ).toLowerCase();

    const matchSearch =
      !debouncedSearch ||
      name.includes(debouncedSearch.toLowerCase()) ||
      mrn.includes(debouncedSearch.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (p.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchDoctor =
        !doctorFilter ||
        String(p.doctor_id || p.assigned_doctor_id) === doctorFilter;

      return matchSearch && matchStatus && matchDoctor;
    });
  }, [patients, debouncedSearch, statusFilter, doctorFilter]);

  const handleView = (id) => navigate(`/admin/patients/${id}`);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Pasien"
        subtitle="Kelola dan lihat seluruh data pasien."
        actionLabel="Tambah Pasien"
        onAction={() => navigate('/admin/patients/add')}
      />

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan nama atau No. RM..."
          className="flex-1"
        />
        <div className="flex gap-3">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className="flex-1 sm:flex-initial"
          />
          <FilterDropdown
            value={doctorFilter}
            onChange={setDoctorFilter}
            options={doctorOptions}
            className="flex-1 sm:flex-initial"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState message="Pasien tidak ditemukan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
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
                  {filtered.map((p, idx) => (
                    <PatientRow key={p.id || idx} patient={p} onView={handleView} />
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

export default AdminPatientsPage;
