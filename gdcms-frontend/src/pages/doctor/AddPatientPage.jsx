import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

import BackButton from '../../components/ui/BackButton';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import FormTextarea from '../../components/ui/FormTextarea';
import Button from '../../components/ui/Button';

import patientService from '../../services/patientService';
import useToast from '../../hooks/useToast';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const DoctorAddPatientPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (submitError) {
      setSubmitError('');
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
      await patientService.create(formData);

      toast.success('Pasien berhasil ditambahkan.');
      navigate('/doctor/patients');
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
        <BackButton to="/doctor/patients" />

        <div>
          <h1 className="text-2xl font-bold text-[#12223a]">
            Tambah Pasien Baru
          </h1>

          <p className="text-gray-500 text-sm mt-0.5">
            Daftarkan pasien baru ke dalam sistem.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 max-w-4xl">
        {/* MRN */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#12223a] mb-1.5">
            Nomor Rekam Medis (Otomatis)
          </label>

          <div className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
            Akan dibuat otomatis oleh sistem
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1 */}
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

          {/* Row 2 */}
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
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth}
              required
            />
          </div>

          {/* Address */}
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

          {submitError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slideDown">
              <p className="text-red-600 text-sm">
                {submitError}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/doctor/patients')}
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

export default DoctorAddPatientPage;
