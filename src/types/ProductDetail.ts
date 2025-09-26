import { StoreInfo } from '@/types/StoreInfo';

export interface ProductDetail {
  id: number;
  detailNm: string;
  detail: string;
  addDetail: string;
  imageFile: File | null;
  previewUrl: string | null;
  subSort: number;
  dateList: string[];
  isReplaceable: boolean;
  replaceIds: number[];
  isStoreInfo: boolean;
  storeInfos: StoreInfo[];
}
