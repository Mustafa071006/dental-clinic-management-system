import { useState, useEffect, useMemo, memo } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import PatientAvatar from '../../components/ui/PatientAvatar';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTableRows } from '../../components/ui/Skeleton';
import examinationService from '../../services/examinationService';
import { formatDate } from '../../utils/formatDate';
import useDebounce from '../../hooks/useDebounce';

const TABLE_HEADERS = ['Tanggal', 'Pasien', 'Dokter', 'Diagnosis', 'Tindakan'];

const ExamRow = memo(({ exam }) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors duration-150">
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {formatDate(exam.date || exam.examination_date)}
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2.5">
        <PatientAvatar
          name={exam.patient_name || exam.patient?.name}
          size="sm"
        />
        <span className="text-sm font-semibold text-[#12223a] whitespace-nowrap">
          {exam.patient_name || exam.patient?.name || '-'}
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
      {exam.doctor_name || exam.doctor?.name || '-'}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {exam.diagnosis || '-'}
    </td>
    <td className="px-6 py-4 text-sm text-gray-400">
      {exam.treatment || '-'}
    </td>
  </tr>
));
ExamRow.displayName = 'ExamRow';

const AdminExaminationsPage = () => {
  const [examinations, setExaminations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await examinationService.getAll();
        setExaminations(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return examinations.filter((e) => {
      const patientName = (
        e.patient_name ||
        e.patient?.name ||
        ''
      ).toLowerCase();
      const doctorName = (
        e.doctor_name ||
        e.doctor?.name ||
        ''
      ).toLowerCase();
      const diagnosis = (e.diagnosis || '').toLowerCase();

      const matchSearch =
        !debouncedSearch ||
        patientName.includes(debouncedSearch.toLowerCase()) ||
        doctorName.includes(debouncedSearch.toLowerCase()) ||
        diagnosis.includes(debouncedSearch.toLowerCase());

      return matchSearch;
    });
  }, [examinations, debouncedSearch]);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Pemeriksaan"
        subtitle="Seluruh catatan pemeriksaan pasien di klinik."
      />

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari berdasarkan pasien, dokter, atau diagnosis..."
          className="flex-1"/>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState message="Data pemeriksaan tidak ditemukan." />
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
                  {filtered.map((exam, idx) => (
                    <ExamRow key={exam.id || idx} exam={exam} />
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

export default AdminExaminationsPage;
