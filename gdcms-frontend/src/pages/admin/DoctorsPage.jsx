import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import DoctorCard from '../../components/ui/DoctorCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import EditDoctorModal from '../../components/ui/EditDoctorModal';
import AddDoctorModal from '../../components/ui/AddDoctorModal';
import doctorService from '../../services/doctorService';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';

const AdminDoctorsPage = () => {
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await doctorService.getAll();
        const allUsers = res?.data || res || [];

const doctors = allUsers.filter(
  (u) => u.role === 'DOCTOR' || u.role_name === 'DOCTOR'
);

setDoctors(doctors);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
  return doctors.filter((d) => {
    const name = (d.name || '').toLowerCase();
    const spec = (d.specialization || '').toLowerCase();

    const matchSearch =
      name.includes(debouncedSearch.toLowerCase()) ||
      spec.includes(debouncedSearch.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : d.status === statusFilter;

    return matchSearch && matchStatus;
  });
}, [doctors, debouncedSearch, statusFilter]);

const handleEditDoctor = (doctor) => {
  setSelectedDoctor(doctor);
  setIsEditModalOpen(true);
};

const handleCreateDoctor = async (formData) => {
  try {
    await doctorService.create(formData);

    const res = await doctorService.getAll();
    const allUsers = res?.data || res || [];

    const doctors = allUsers.filter(
      (u) =>
        u.role === 'DOCTOR' ||
        u.role_name === 'DOCTOR'
    );

    setDoctors(doctors);

    setIsAddModalOpen(false);
    toast.success('Doctor created successfully.');
  } catch (error) {
    console.error(error);
    toast.error('Failed to create doctor.');
  }
};

const handleSaveDoctor = async (formData) => {
  try {
    await doctorService.updateDoctor(
      selectedDoctor.id,
      formData
    );

    const res = await doctorService.getAll();
    const allUsers = res?.data || res || [];

    const doctors = allUsers.filter(
      (u) =>
        u.role === 'DOCTOR' ||
        u.role_name === 'DOCTOR'
    );

    setDoctors(doctors);

    setIsEditModalOpen(false);
    setSelectedDoctor(null);
    toast.success('Doctor profile updated.');
  } catch (error) {
    console.error(error);
    toast.error('Failed to update doctor.');
  }
};

const handleToggleStatus = async (doctor) => {
  try {
    await doctorService.toggleStatus(
      doctor.id
    );

    const res = await doctorService.getAll();
    const allUsers = res?.data || res || [];

    const doctors = allUsers.filter(
      (u) =>
        u.role === 'DOCTOR' ||
        u.role_name === 'DOCTOR'
    );

    setDoctors(doctors);
    toast.success(
      doctor.status === 'ACTIVE'
        ? 'Doctor deactivated.'
        : 'Doctor activated.'
    );
  } catch (error) {
    console.error(error);
    toast.error('Failed to update doctor status.');
  }
};

return (
    <div className="p-4 sm:p-8">
      <PageHeader
  title="Doctor Management"
  subtitle="Manage clinic staff and doctors."
  actionLabel="Add Doctor"
  onAction={() => setIsAddModalOpen(true)}
/>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
  <SearchBar
    value={search}
    onChange={setSearch}
    placeholder="Search doctors by name or specialization..."
    className="max-w-md"
  />

  <div className="flex flex-wrap gap-2 mt-4">
    <button
      onClick={() => setStatusFilter('ALL')}
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
        statusFilter === 'ALL'
          ? 'bg-[#12223a] text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      All ({doctors.length})
    </button>

    <button
      onClick={() => setStatusFilter('ACTIVE')}
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
        statusFilter === 'ACTIVE'
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      Active (
      {doctors.filter(
        (d) => d.status === 'ACTIVE'
      ).length}
      )
    </button>

    <button
      onClick={() => setStatusFilter('INACTIVE')}
      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
        statusFilter === 'INACTIVE'
          ? 'bg-red-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      Inactive (
      {doctors.filter(
        (d) => d.status === 'INACTIVE'
      ).length}
      )
    </button>
  </div>
</div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No doctors found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doctor, idx) => (
  <DoctorCard
  key={doctor.id || idx}
  doctor={doctor}
  onResetPassword={handleEditDoctor}
  onToggleStatus={handleToggleStatus}
/>
))}
        </div>
      )}
      <EditDoctorModal
  isOpen={isEditModalOpen}
  doctor={selectedDoctor}
  onClose={() => {
    setIsEditModalOpen(false);
    setSelectedDoctor(null);
  }}
  onSave={handleSaveDoctor}
/>

<AddDoctorModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onSave={handleCreateDoctor}
/>
    </div>
  );
};

export default AdminDoctorsPage;