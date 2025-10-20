// yyyymmddHHMMSS → ISO
export function isoFromYYYYMMDDHHMMSS(s?: string | null) {
  if (!s || s.length < 8) return '';
  const yyyy = Number(s.slice(0, 4));
  const mm = Number(s.slice(4, 6)) - 1;
  const dd = Number(s.slice(6, 8));
  const HH = Number(s.slice(8, 10) || '0');
  const MM = Number(s.slice(10, 12) || '0');
  const SS = Number(s.slice(12, 14) || '0');
  const d = new Date(yyyy, mm, dd, HH, MM, SS);
  return d.toISOString();
}

// 예: "2024년05월" → "2024-05-01T00:00:00.000Z"
export function toFirstDayISOFromLabel(label: string) {
  const m = label.match(/(\d{4})년(\d{2})월/);
  if (!m) return '';
  const yyyy = Number(m[1]);
  const mm = Number(m[2]) - 1;
  return new Date(yyyy, mm, 1).toISOString();
}
