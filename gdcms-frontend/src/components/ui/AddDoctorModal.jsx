import { useState } from 'react';
import Modal from './Modal';
import FormInput from './FormInput';
import Button from './Button';

const AddDoctorModal = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(form);
      setForm({
        name: '',
        email: '',
        password: '',
        specialization: ''
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Dokter"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSubmit} isLoading={isSaving}>
            Simpan Dokter
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormInput
          id="add-doctor-name"
          name="name"
          label="Nama Dokter"
          placeholder="cth. Dr. Jane Smith"
          value={form.name}
          onChange={handleChange}
        />

        <FormInput
          id="add-doctor-email"
          name="email"
          type="email"
          label="Email"
          placeholder="jane.smith@goldendental.com"
          value={form.email}
          onChange={handleChange}
        />

        <FormInput
          id="add-doctor-password"
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        <FormInput
          id="add-doctor-specialization"
          name="specialization"
          label="Spesialisasi"
          placeholder="cth. Ortodonti"
          value={form.specialization}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default AddDoctorModal;
