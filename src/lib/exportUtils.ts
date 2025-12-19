import * as XLSX from "xlsx";

export function exportToExcel(data: any[], filename: string, sheetName: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;
  XLSX.writeFile(wb, fullFilename);
}

export function exportMultipleSheetsToExcel(
  sheets: { data: any[]; sheetName: string }[],
  filename: string
) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ data, sheetName }) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;
  XLSX.writeFile(wb, fullFilename);
}

// NEW: Import from Excel
export function importFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

// NEW: Download template
export function downloadTemplate(
  headers: string[],
  filename: string,
  sheetName: string
) {
  const templateData = [
    headers.reduce((obj, header) => {
      obj[header] = "";
      return obj;
    }, {} as any),
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}_template.xlsx`);
}
