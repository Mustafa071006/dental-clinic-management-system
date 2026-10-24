/**
 * Label tampilan (Bahasa Indonesia) untuk nilai enum dari database.
 * Hanya untuk ditampilkan — nilai asli tetap dipakai saat kirim ke API.
 */
export const STATUS_LABELS = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  complete: 'Selesai',
  completed: 'Selesai',
  pending: 'Menunggu',
  scheduled: 'Terjadwal',
  cancelled: 'Dibatalkan',
};

export const GENDER_LABELS = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

/**
 * "ACTIVE" → "Aktif", "PENDING" → "Menunggu"
 * @param {string} status
 * @returns {string}
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return STATUS_LABELS[status.toLowerCase()] || status;
};

/**
 * "MALE" → "Laki-laki", "FEMALE" → "Perempuan"
 * @param {string} gender
 * @returns {string}
 */
export const formatGender = (gender) => {
  if (!gender) return '';
  return GENDER_LABELS[gender.toLowerCase()] || gender;
};
