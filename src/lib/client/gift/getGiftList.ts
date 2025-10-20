export async function getGiftList(): Promise<{ ok: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch('/api/admin/gift/get/giftList', {
      method: 'GET',
    });

    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, message: txt || 'Request failed' };
    }

    const json = await res.json();
    return { ok: true, data: json };
  } catch (error: any) {
    return { ok: false, message: error?.message || 'Unexpected error' };
  }
}
