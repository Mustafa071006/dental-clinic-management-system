import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import examinationService from '../../services/examinationService';
import controlScheduleService from '../../services/controlScheduleService';
import patientService from '../../services/patientService';
import FormInput from '../../components/ui/FormInput';
import FormTextarea from '../../components/ui/FormTextarea';
import Button from '../../components/ui/Button';
import useToast from '../../hooks/useToast';

const AddExaminationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [patient, setPatient] = useState(null);

  const [formData, setFormData] = useState({
  examination_date: new Date().toISOString().split('T')[0],
  complaint: '',
  diagnosis: '',
  treatment: '',
  notes: '',

  control_date: '',
  control_time: '',
});

  const [scheduleControl, setScheduleControl] =
  useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  const fetchPatient = async () => {
    try {
      const res = await patientService.getById(id);

      setPatient(res.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPatient();
}, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await examinationService.create({
        patient_id: id,
        examination_date: formData.examination_date,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes,
      });

      if (
  scheduleControl &&
  formData.control_date
) {
  await controlScheduleService.create({
    patient_id: id,
    control_date: formData.control_date,
    control_time: formData.control_time,
    status: 'PENDING',
  });
}

      toast.success('Examination saved successfully.');

      navigate(`/doctor/patients/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save examination.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="p-4 sm:p-8 max-w-4xl animate-fadeInUp">
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => navigate(`/doctor/patients/${id}`)}
        aria-label="Back to patient"
        className="text-gray-500 hover:text-[#12223a] active:scale-90 transition-all duration-150"
      >
        <ArrowLeft size={28} />
      </button>

      <div>
  <h1 className="text-3xl sm:text-4xl font-bold text-[#12223a]">
    Add Examination
  </h1>

  <p className="text-gray-500 mt-1">
    For patient: {patient?.full_name} (
    {patient?.medical_record_number})
  </p>
</div>
    </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-6"
      >
        <FormInput
          id="examination_date"
          name="examination_date"
          label="Examination Date"
          type="date"
          value={formData.examination_date}
          readOnly
        />

        <FormTextarea
          id="complaint"
          name="complaint"
          label="Complaint"
          value={formData.complaint}
          onChange={handleChange}
          rows={3}
        />

        <FormInput
          id="diagnosis"
          name="diagnosis"
          label="Diagnosis"
          type="text"
          value={formData.diagnosis}
          onChange={handleChange}
        />

        <FormTextarea
          id="treatment"
          name="treatment"
          label="Treatment"
          value={formData.treatment}
          onChange={handleChange}
          rows={3}
        />

        <FormTextarea
          id="notes"
          name="notes"
          label="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />

        <div className="border rounded-2xl p-5">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={scheduleControl}
      onChange={(e) =>
        setScheduleControl(e.target.checked)
      }
      className="w-5 h-5 accent-[#12223a]"
    />

    <span className="font-medium">
      Schedule Follow-up Control
    </span>
  </label>

  {scheduleControl && (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 animate-slideDown">
      <FormInput
        id="control_date"
        name="control_date"
        label="Control Date"
        type="date"
        min={today}
        value={formData.control_date}
        onChange={(e) =>
          setFormData({
            ...formData,
            control_date: e.target.value,
          })
        }
      />

      <FormInput
        id="control_time"
        name="control_time"
        label="Control Time"
        type="time"
        min="09:00"
        max="21:00"
        value={formData.control_time}
        onChange={(e) =>
          setFormData({
            ...formData,
            control_time: e.target.value,
          })
        }
      />
    </div>
  )}
</div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate(`/doctor/patients/${id}`)
            }
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            icon={Save}
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? 'Saving...'
              : 'Save Examination'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExaminationPage;
