import { useState, useEffect } from 'react';
import Modal from './Modal';
import FormInput from './FormInput';
import Button from './Button';

const EditDoctorModal = ({
  isOpen,
  onClose,
  doctor,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || '',
        email: doctor.email || '',
        specialization: doctor.specialization || '',
        password: '',
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(form);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Profil Dokter"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSubmit} isLoading={isSaving}>
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="edit-doctor-name"
          name="name"
          label="Nama"
          value={form.name}
          onChange={handleChange}
        />

        <FormInput
          id="edit-doctor-email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
        />

        <FormInput
          id="edit-doctor-specialization"
          name="specialization"
          label="Spesialisasi"
          value={form.specialization}
          onChange={handleChange}
        />

        <FormInput
          id="edit-doctor-password"
          type="password"
          name="password"
          label="Password Baru (opsional)"
          placeholder="Kosongkan jika tidak ingin mengganti password"
          value={form.password}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default EditDoctorModal;
