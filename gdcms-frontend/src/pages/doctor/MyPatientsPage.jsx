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
import useDebounce from '../../hooks/useDebounce';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'complete', label: 'Complete' },
  { value: 'inactive', label: 'Inactive' },
];

const TABLE_HEADERS = ['Patient', 'MRN', 'Contact', 'Assigned Doctor', 'Status', 'Manage'];

const PatientRow = memo(({ patient: p, onView }) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
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
  {p.gender
    ? `${p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase()}`
    : ''}
  {p.date_of_birth
    ? `, ${new Date(p.date_of_birth).toLocaleDateString('id-ID')}`
    : ''}
</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
  {p.medical_record_number || '-'}
</td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {p.phone || p.phone_number || '-'}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {p.doctor_name || p.doctor?.name || '-'}
    </td>
    <td className="px-6 py-4">
      <StatusBadge status={p.status} />
    </td>
    <td className="px-6 py-4">
      <button
        onClick={() => onView(p.id)}
        className="text-gray-400 hover:text-[#12223a] active:scale-90 transition-all duration-150"
        aria-label={`View details for ${p.name || p.full_name || 'patient'}`}
      >
        <Eye size={18} strokeWidth={1.8} />
      </button>
    </td>
  </tr>
));
PatientRow.displayName = 'PatientRow';

const DoctorMyPatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await patientService.getAll();
        setPatients(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
  return patients.filter((p) => {
    const keyword = debouncedSearch.toLowerCase();

    const name = (
      p.name ||
      p.full_name ||
      ''
    ).toLowerCase();

    const mrn = (
      p.medical_record_number ||
      ''
    ).toLowerCase();

    const matchSearch =
      !keyword ||
      name.includes(keyword) ||
      mrn.includes(keyword);

    const matchStatus =
      !statusFilter ||
      (p.status || '').toLowerCase() === statusFilter;

    return matchSearch && matchStatus;
  });
}, [patients, debouncedSearch, statusFilter]);

  const handleView = (id) => navigate(`/doctor/patients/${id}`);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
  title="My Patients"
  subtitle="View and manage patients assigned to you."
/>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or MRN..."
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
          <EmptyState message="No patients found." />
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

export default DoctorMyPatientsPage;
