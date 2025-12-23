// ============================================
// ATTENDANCE EXCEL UTILITIES
// ============================================

import * as XLSX from 'xlsx';

interface ExportAttendanceData {
  no: number;
  nisn: string;
  studentName: string;
  presentCount: number;
  absentCount: number;
  sickCount: number;
  permissionCount: number;
  totalDays: number;
  attendanceRate: number;
}

// Export attendance report to Excel
export const exportAttendanceToExcel = (
  data: any[],
  className: string,
  monthYear: string
) => {
  const exportData: ExportAttendanceData[] = data.map((row, idx) => ({
    no: idx + 1,
    nisn: row.nisn || '',
    studentName: row.studentName || row.fullName || '',
    presentCount: row.presentCount || 0,
    absentCount: row.absentCount || 0,
    sickCount: row.sickCount || 0,
    permissionCount: row.permissionCount || 0,
    totalDays: row.totalRecords || row.totalDays || 0,
    attendanceRate: row.attendanceRate || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(
    exportData.map((row) => ({
      'No': row.no,
      'NISN': row.nisn,
      'Nama Siswa': row.studentName,
      'Hadir': row.presentCount,
      'Tidak Hadir': row.absentCount,
      'Sakit': row.sickCount,
      'Izin': row.permissionCount,
      'Total Hari': row.totalDays,
      'Kehadiran (%)': row.attendanceRate,
    }))
  );

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 15 },  // NISN
    { wch: 25 },  // Nama
    { wch: 8 },   // Hadir
    { wch: 12 },  // Tidak Hadir
    { wch: 8 },   // Sakit
    { wch: 8 },   // Izin
    { wch: 10 },  // Total
    { wch: 12 },  // Persentase
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Absensi');
  
  const filename = `Absensi_${className.replace(/\s+/g, '_')}_${monthYear}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Export daily attendance to Excel
export const exportDailyAttendanceToExcel = (
  data: any[],
  className: string,
  date: string
) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map((row, idx) => ({
      'No': idx + 1,
      'NISN': row.nisn || '',
      'Nama Siswa': row.studentName || row.fullName || '',
      'Status': row.status || '',
      'Catatan': row.notes || '',
    }))
  );

  ws['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 25 },
    { wch: 12 },
    { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Absensi ${date}`);
  
  const filename = `Absensi_${className.replace(/\s+/g, '_')}_${date}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Generate attendance template for import
export const generateAttendanceTemplate = (
  students: any[],
  date: string
) => {
  const templateData = students.map((student, idx) => ({
    'No': idx + 1,
    'NISN': student.nisn || '',
    'Nama Siswa': student.fullName || student.name || '',
    'Status': 'present',
    'Catatan': '',
  }));

  const ws = XLSX.utils.json_to_sheet(templateData);
  
  ws['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Absensi');
  
  const filename = `Template_Absensi_${date}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Import attendance from Excel
export const importAttendanceFromExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};
