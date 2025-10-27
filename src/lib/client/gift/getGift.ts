import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';

export interface GetGiftResponse {
  giftSeq: number;
  initialGift: Gift;
  initialDetails: GiftDetail[];
}

export async function getGift(seq: number): Promise<{
  ok: boolean;
  message?: string;
  data?: GetGiftResponse;
}> {
  try {
    const res = await fetch(`/api/admin/gift/get/gift?seq=${seq}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const msg = await res.text();
      return { ok: false, message: msg || 'Request failed' };
    }

    const json = await res.json();
    return { ok: true, data: json.data };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Unexpected error' };
  }
}
