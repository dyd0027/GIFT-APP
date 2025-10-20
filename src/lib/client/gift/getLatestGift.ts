export async function getLatestGift() {
  try {
    const res = await fetch('/api/admin/gift/get/latestGift');

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Request failed');
    }

    const json = await res.json();
    return { ok: true, data: json.data };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Unexpected error' };
  }
}
