export const extractItemAndPrice = (transcript: string): { itemName: string; price: number } | null => {
  // Bersihkan spasi di awal dan akhir
  transcript = transcript.trim();

  // Pola 1: Format dengan kata "ribu" (contoh: "nasi goreng 10 ribu")
  const rupiahPattern = /^(.+?)\s+(\d{1,3}(?:[.\d{3}]+)?)\s*ribu$/i;
  const rupiahMatch = transcript.match(rupiahPattern);
  if (rupiahMatch) {
    // Hapus titik ribuan, misal "10.000" jadi "10000"
    const rawNumber = rupiahMatch[2].replace(/\./g, '');
    return {
      itemName: rupiahMatch[1].trim(),
      price: parseInt(rawNumber) * 1000,
    };
  }

  // Pola 2: Format "ribu lima ratus" (contoh: "nasi goreng 10 ribu lima ratus")
  const complexPattern = /^(.+?)\s+(\d{1,3})\s*ribu\s+lima\s*ratus$/i;
  const complexMatch = transcript.match(complexPattern);
  if (complexMatch) {
    return {
      itemName: complexMatch[1].trim(),
      price: parseInt(complexMatch[2]) * 1000 + 500,
    };
  }

  // Pola 3: Format angka biasa tanpa "ribu" (contoh: "nasi goreng 10000" atau "nasi goreng 10.000")
  const numberPattern = /^(.+?)\s+(\d{1,3}(?:[.\d{3}]+)?)$/i;
  const numberMatch = transcript.match(numberPattern);
  if (numberMatch) {
    const rawNumber = numberMatch[2].replace(/\./g, '');
    return {
      itemName: numberMatch[1].trim(),
      price: parseInt(rawNumber),
    };
  }

  return null;
};
