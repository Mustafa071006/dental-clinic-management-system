import {
  Shield,
  Phone,
  Mail,
  Pencil
} from 'lucide-react';
import LazyImage from './LazyImage';
import { formatStatus } from '../../utils/formatLabel';

const DoctorCard = ({
  doctor,
  onResetPassword,
  onToggleStatus
}) => {
  const initials = doctor?.name
    ? doctor.name
        .replace(/^Dr\.\s*/i, '')
        .charAt(0)
        .toUpperCase()
    : '?';

  const isActive =
    doctor?.status === 'ACTIVE';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden animate-fadeInUp">
      {/* Avatar */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden flex-shrink-0">
          {doctor?.photo ? (
            <LazyImage
              src={doctor.photo}
              alt={doctor.name}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-bold text-2xl">
              {initials}
            </span>
          )}
        </div>

        <h3 className="text-[#12223a] font-bold text-2xl sm:text-3xl text-center mt-4 break-words">
          {doctor?.name || '-'}
        </h3>

        <p className="text-[#d4af37] font-medium text-lg text-center">
          {doctor?.specialization || '-'}
        </p>

        <span
          className={`mt-3 px-4 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {formatStatus(doctor?.status)}
        </span>
      </div>

      {/* Info */}
      <div className="border-t border-gray-100 px-6 sm:px-8 py-6 space-y-4">
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Shield
            size={15}
            strokeWidth={1.8}
            className="flex-shrink-0"
          />
          <span className="truncate">
            ID: {doctor?.id || '-'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Phone
            size={15}
            strokeWidth={1.8}
            className="flex-shrink-0"
          />
          <span className="truncate">
            {doctor?.phone ||
              'Tidak Tersedia'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Mail
            size={15}
            strokeWidth={1.8}
            className="flex-shrink-0"
          />
          <span className="truncate">
            {doctor?.email || '-'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 p-4 space-y-2">
        <button
          onClick={() =>
            onResetPassword?.(doctor)
          }
          className="
            w-full
            py-3
            rounded-2xl
            border
            border-gray-200
            text-[#12223a]
            font-semibold
            hover:bg-gray-50
            active:scale-[0.98]
            transition-all
            duration-150
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Pencil size={18} />
          Ubah Profil
        </button>

        <button
          onClick={() =>
            onToggleStatus?.(doctor)
          }
          className={`
            w-full
            py-3
            rounded-2xl
            text-white
            font-semibold
            active:scale-[0.98]
            transition-all
            duration-150
            ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }
          `}
        >
          {isActive
            ? 'Nonaktifkan'
            : 'Aktifkan'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
