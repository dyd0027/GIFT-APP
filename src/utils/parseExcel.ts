// utils/parseExcel.ts
import * as XLSX from 'xlsx';

export interface UserExcelRow {
  phone: string;
  name: string;
  company?: string;
  hq?: string;
  dept?: string;
}

export function parseExcelFile(file: File): Promise<UserExcelRow[] | string> {
  return new Promise(async (resolve) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [header, ...body] = rows;
      const headerSort = ['전화번호', '이름', '회사명', '본부명', '팀명'];
      const isValidHeader =
        Array.isArray(header) &&
        header.length === headerSort.length &&
        header.every((col, idx) => col === headerSort[idx]);
      if (!isValidHeader) {
        return resolve('엑셀의 첫 줄은 [전화번호, 이름, 회사명, 본부명, 팀명] 순이어야 합니다.');
      }

      const insertData: UserExcelRow[] = [];
      const phoneSet = new Set<string>();
      const duplicates: string[] = [];

      for (const row of body) {
        const [phoneRaw, name, company, hq, dept] = row;
        const phone = String(phoneRaw).replace(/[^0-9]/g, '');

        if (!phone) return resolve('전화번호가 없는 행이 있습니다.');
        if (!name) return resolve(`${phone} 번호에 해당하는 이름이 없습니다.`);
        if (phone === 'sangsangin') continue;

        if (phoneSet.has(phone)) {
          duplicates.push(phone);
          continue;
        }

        phoneSet.add(phone);
        insertData.push({ phone, name, company, hq, dept });
      }

      if (duplicates.length > 0) {
        return resolve(`중복된 전화번호가 있습니다: ${duplicates.join(', ')}`);
      }

      resolve(insertData);
    } catch (e) {
      resolve('엑셀 파싱 중 오류가 발생했습니다.');
    }
  });
}
