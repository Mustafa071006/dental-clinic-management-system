/**
 * Ambil inisial dari nama lengkap
 * "Emily Rodriguez" → "E"
 * "Dr. Sarah Jenkins" → "S"
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '?';
  // Hapus prefix "Dr." jika ada
  const cleaned = name.replace(/^Dr\.\s*/i, '');
  const parts = cleaned.trim().split(' ');
  if (parts.length === 0) return '?';
  return parts[0].charAt(0).toUpperCase();
};