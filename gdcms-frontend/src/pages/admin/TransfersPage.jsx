import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import FormSelect from '../../components/ui/FormSelect';
import FormTextarea from '../../components/ui/FormTextarea';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import transferService from '../../services/transferService';
import { formatDate } from '../../utils/formatDate';
import useToast from '../../hooks/useToast';

const AdminTransfersPage = () => {
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const [formData, setFormData] = useState({
    patient_id: '',
    new_doctor_id: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [pRes, dRes, tRes] = await Promise.allSettled([
          patientService.getAll(),
          doctorService.getAll(),
          transferService.getAll(),
        ]);

        if (pRes.status === 'fulfilled') {
          setPatients(pRes.value?.data || pRes.value || []);
        }
        if (dRes.status === 'fulfilled') {
          const all = dRes.value?.data || dRes.value || [];
          setDoctors(all.filter((u) => u.role_name === 'DOCTOR'));
        }
        if (tRes.status === 'fulfilled') {
          setTransfers(tRes.value?.data || tRes.value || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const patientOptions = patients.map((p) => ({
    value: String(p.id),
    label: p.name || p.full_name || p.mrn,
  }));

  const doctorOptions = doctors
  .filter(
    (d) =>
      d.status === 'ACTIVE' &&
      d.id !== currentDoctor?.id
  )
  .map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === 'patient_id') {
    const patient = patients.find(
      (p) => p.id === Number(value)
    );

    const doctor = doctors.find(
      (d) => d.id === patient?.doctor_id
    );

    setCurrentDoctor(doctor || null);

    setFormData((prev) => ({
      ...prev,
      patient_id: value,
      new_doctor_id: '',
    }));
  }

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }

  setSubmitError('');
  setSubmitSuccess('');
};

  const validate = () => {
  const newErrors = {};

  if (!formData.patient_id) {
    newErrors.patient_id =
      'Silakan pilih pasien.';
  }

  if (!formData.new_doctor_id) {
    newErrors.new_doctor_id =
      'Silakan pilih dokter.';
  }

  if (!formData.reason.trim()) {
    newErrors.reason =
      'Alasan transfer wajib diisi.';
  }

  if (
    currentDoctor &&
    Number(formData.new_doctor_id) === currentDoctor.id
  ) {
    newErrors.new_doctor_id =
      'Tidak dapat mentransfer ke dokter yang sama.';
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
    try {
      await transferService.create({
      patient_id: Number(formData.patient_id),
      to_doctor_id: Number(formData.new_doctor_id),
      reason: formData.reason,
      });

      setSubmitSuccess('Transfer pasien berhasil dilakukan.');
      toast.success('Transfer pasien berhasil dilakukan.');
      setFormData({ patient_id: '', new_doctor_id: '', reason: '' });

      setCurrentDoctor(null);

      // Refresh transfer list
      const tRes = await transferService.getAll();
      setTransfers(tRes?.data || tRes || []);

      const pRes = await patientService.getAll();
      setPatients(pRes?.data || pRes || []);
      } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Transfer gagal. Silakan coba lagi.';
      setSubmitError(msg);
      toast.error(msg);
      } finally {
      setIsSubmitting(false);
     }
   };

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Transfer Pasien"
        subtitle="Pindahkan pasien antar dokter di klinik."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — form */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <ArrowLeftRight size={18} className="text-[#12223a]" strokeWidth={2} />
            <h2 className="text-base font-bold text-[#12223a]">
              Mulai Transfer
            </h2>
          </div>

          {isLoadingData ? (
            <div className="space-y-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <FormSelect
                id="patient_id"
                name="patient_id"
                label="Pilih Pasien"
                placeholder="Pilih pasien"
                value={formData.patient_id}
                onChange={handleChange}
                options={patientOptions}
                error={errors.patient_id}
                required
              />

              {currentDoctor && (
                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Dokter Saat Ini</p>
                  <p className="font-semibold text-[#12223a]">{currentDoctor.name}</p>
                </div>)}

              <FormSelect
                id="new_doctor_id"
                name="new_doctor_id"
                label="Dokter Baru"
                placeholder="Pilih dokter baru"
                value={formData.new_doctor_id}
                onChange={handleChange}
                options={doctorOptions}
                error={errors.new_doctor_id}
                required
              />

              <FormTextarea
                id="reason"
                name="reason"
                label="Alasan Transfer"
                placeholder="Alasan pemindahan pasien..."
                value={formData.reason}
                onChange={handleChange}
                error={errors.reason}
                rows={4}
                required
              />

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}
              {submitSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <p className="text-emerald-600 text-sm">{submitSuccess}</p>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-3"
              >
                {isSubmitting ? 'Memproses...' : 'Selesaikan Transfer'}
              </Button>
            </form>
          )}
        </div>

        {/* Right — recent transfers */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#12223a] mb-5">
            Transfer Terbaru
          </h2>

          {isLoadingData ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-start">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              ))}
            </div>
          ) : transfers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8 animate-fadeIn">
              Belum ada transfer.
            </p>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-3 pb-2 mb-2 border-b border-gray-100">
                {['Tanggal', 'Pasien', 'Dokter'].map((h) => (
                  <span
                    key={h}
                    className="text-xs font-medium text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-4">
                {transfers.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="grid grid-cols-3 gap-2 items-start"
                  >
                    <span className="text-sm text-gray-500">
                      {formatDate(t.transferred_at ||t.transfer_date ||t.date ||t.created_at)}
                    </span>
                    <span className="text-sm font-medium text-[#12223a]">
                      {t.patient_name || t.patient?.name || '-'}
                    </span>
                    <div>
                      <p className="text-sm text-red-400 line-through">
                        {t.from_doctor_name ||
                          t.old_doctor?.name ||
                          t.previous_doctor ||
                          '-'}
                      </p>
                      <p className="text-sm text-emerald-600">
                        {t.to_doctor_name ||
                          t.new_doctor?.name ||
                          t.doctor?.name ||
                          '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransfersPage;