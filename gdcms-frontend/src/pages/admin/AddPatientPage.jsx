import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import FormTextarea from '../../components/ui/FormTextarea';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import useToast from '../../hooks/useToast';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const AdminAddPatientPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
  name: '',
  phone: '',
  gender: '',
  date_of_birth: '',
  address: '',
  doctor_id: '',
});

  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await doctorService.getAll();

      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setDoctors([]);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  fetchDoctors();
}, []);

  const doctorOptions = (doctors || []).map((doctor) => ({
  value: String(doctor.id),
  label: doctor.name,
}));

  const handleChange = (e) => {
  let { name, value } = e.target;

  // Validasi khusus Phone Number
  if (name === "phone") {
    value = value.replace(/\D/g, ""); // Hanya angka
    value = value.slice(0, 13);       // Maksimal 13 digit
  }

  setFormData((prev) => ({ ...prev, [name]: value }));

  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  if (submitError) {
    setSubmitError("");
  }
};

  const validate = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Nama lengkap wajib diisi.';
  }

  if (!formData.phone.trim()) {
    newErrors.phone = 'Nomor telepon wajib diisi.';
  }

  if (!formData.gender) {
    newErrors.gender = 'Jenis kelamin wajib dipilih.';
  }

  if (!formData.date_of_birth) {
    newErrors.date_of_birth = 'Tanggal lahir wajib diisi.';
  }

  if (!formData.doctor_id) {
    newErrors.doctor_id = 'Silakan pilih dokter penanggung jawab.';
  }

  return newErrors;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await patientService.create({
        ...formData,
        doctor_id: Number(formData.doctor_id),
      });
      toast.success('Pasien berhasil ditambahkan.');
      navigate('/admin/patients');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Gagal menambahkan pasien. Silakan coba lagi.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BackButton to="/admin/patients" />
        <div>
          <h1 className="text-2xl font-bold text-[#12223a]">Tambah Pasien Baru</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Daftarkan pasien baru ke dalam sistem.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 max-w-4xl">
        {/* Avatar placeholder + MRN */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#12223a] mb-1.5">
              Nomor Rekam Medis (Otomatis)
            </label>
            <div className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
              Akan dibuat otomatis oleh sistem
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1: Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <FormInput
  id="name"
  name="name"
  label="Nama Lengkap"
  placeholder="cth. Budi Santoso"
  value={formData.name}
  onChange={handleChange}
  error={errors.name}
  required
/>
            <FormInput
              id="phone"
              name="phone"
              label="Nomor Telepon"
              placeholder="+62 812 3456 7890"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
          </div>

          {/* Row 2: Gender + DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <FormSelect
              id="gender"
              name="gender"
              label="Jenis Kelamin"
              placeholder="Pilih Jenis Kelamin"
              value={formData.gender}
              onChange={handleChange}
              options={GENDER_OPTIONS}
              error={errors.gender}
              required
            />
            <FormInput
              id="date_of_birth"
              name="date_of_birth"
              label="Tanggal Lahir"
              type="date"
              placeholder="hh/bb/tttt"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth}
              required
            />
          </div>

          {/* Row 3: Address */}
          <div className="mb-5">
            <FormTextarea
              id="address"
              name="address"
              label="Alamat"
              placeholder="Alamat tempat tinggal lengkap"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Row 4: Assign Doctor */}
          <div className="mb-8">
            {isLoadingDoctors ? (
              <div className="flex items-center gap-2 py-3">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-400">Memuat data dokter...</span>
              </div>
            ) : (
              <FormSelect
                id="doctor_id"
                name="doctor_id"
                label="Dokter Penanggung Jawab"
                placeholder="Pilih Dokter"
                value={formData.doctor_id}
                onChange={handleChange}
                options={doctorOptions}
                error={errors.doctor_id}
                required
              />
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slideDown">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/patients')}
              type="button"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Pasien'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddPatientPage;