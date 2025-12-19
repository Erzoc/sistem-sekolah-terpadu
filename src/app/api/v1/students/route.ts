import { NextRequest, NextResponse } from "next/server";

// Mock data - replace with real database
let students = [
  {
    id: 1,
    nis: "2024001",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@student.com",
    phone: "08123456789",
    class: "X IPA 1",
    status: "active",
    enrollmentDate: "2024-07-15",
  },
  {
    id: 2,
    nis: "2024002",
    name: "Siti Nurhaliza",
    email: "siti.nur@student.com",
    phone: "08123456790",
    class: "X IPA 1",
    status: "active",
    enrollmentDate: "2024-07-15",
  },
  {
    id: 3,
    nis: "2024003",
    name: "Budi Santoso",
    email: "budi.santoso@student.com",
    phone: "08123456791",
    class: "X IPA 2",
    status: "active",
    enrollmentDate: "2024-07-15",
  },
  {
    id: 4,
    nis: "2024004",
    name: "Dewi Lestari",
    email: "dewi.lestari@student.com",
    phone: "08123456792",
    class: "XI IPS 1",
    status: "active",
    enrollmentDate: "2023-07-15",
  },
  {
    id: 5,
    nis: "2024005",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@student.com",
    phone: "08123456793",
    class: "XI IPS 2",
    status: "inactive",
    enrollmentDate: "2023-07-15",
  },
  {
    id: 6,
    nis: "2024006",
    name: "Fitri Handayani",
    email: "fitri.handayani@student.com",
    phone: "08123456794",
    class: "XII IPA 1",
    status: "active",
    enrollmentDate: "2022-07-15",
  },
];

// GET - Fetch all students with search and filter
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const classFilter = searchParams.get("class") || "";

  let filteredStudents = students;

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredStudents = filteredStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.nis.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.class.toLowerCase().includes(searchLower)
    );
  }

  // Class filter
  if (classFilter) {
    filteredStudents = filteredStudents.filter(
      (student) => student.class === classFilter
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredStudents,
    total: filteredStudents.length,
  });
}

// POST - Create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nis, name, email, phone, class: className, enrollmentDate } = body;

    // Validation
    if (!nis || !name || !email) {
      return NextResponse.json(
        { success: false, message: "NIS, Nama, dan Email wajib diisi" },
        { status: 400 }
      );
    }

    // Check if NIS already exists
    const existingStudent = students.find((s) => s.nis === nis);
    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "NIS sudah terdaftar" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = students.find((s) => s.email === email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create new student
    const newStudent = {
      id: students.length + 1,
      nis,
      name,
      email,
      phone: phone || "",
      class: className || "",
      status: "active",
      enrollmentDate: enrollmentDate || new Date().toISOString().split("T")[0],
    };

    students.push(newStudent);

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil ditambahkan",
      data: newStudent,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan siswa" },
      { status: 500 }
    );
  }
}

// PUT - Update existing student
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nis, name, email, phone, class: className, enrollmentDate } = body;

    // Validation
    if (!id || !nis || !name || !email) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Find student
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if NIS already exists (exclude current student)
    const existingNIS = students.find((s) => s.nis === nis && s.id !== id);
    if (existingNIS) {
      return NextResponse.json(
        { success: false, message: "NIS sudah digunakan siswa lain" },
        { status: 400 }
      );
    }

    // Check if email already exists (exclude current student)
    const existingEmail = students.find((s) => s.email === email && s.id !== id);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email sudah digunakan siswa lain" },
        { status: 400 }
      );
    }

    // Update student
    students[index] = {
      ...students[index],
      nis,
      name,
      email,
      phone: phone || "",
      class: className || "",
      enrollmentDate: enrollmentDate || students[index].enrollmentDate,
    };

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diupdate",
      data: students[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate data siswa" },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Find student
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete student
    const deletedStudent = students[index];
    students.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: `Siswa ${deletedStudent.name} berhasil dihapus`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus siswa" },
      { status: 500 }
    );
  }
}

// PATCH - Bulk import students
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { students: importedStudents } = body;

    // Validation
    if (!Array.isArray(importedStudents)) {
      return NextResponse.json(
        { success: false, message: "Data tidak valid" },
        { status: 400 }
      );
    }

    if (importedStudents.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data import kosong" },
        { status: 400 }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const importedData: any[] = [];

    importedStudents.forEach((student, index) => {
      const rowNumber = index + 2; // Excel row (header is row 1)

      try {
        // Validate required fields
        if (!student.NIS || !student.Nama || !student.Email) {
          errors.push(
            `Baris ${rowNumber}: Data tidak lengkap (NIS, Nama, atau Email kosong)`
          );
          errorCount++;
          return;
        }

        // Check if NIS already exists
        const existingNIS = students.find((s) => s.nis === student.NIS);
        if (existingNIS) {
          errors.push(`Baris ${rowNumber}: NIS ${student.NIS} sudah terdaftar`);
          errorCount++;
          return;
        }

        // Check if email already exists
        const existingEmail = students.find((s) => s.email === student.Email);
        if (existingEmail) {
          errors.push(
            `Baris ${rowNumber}: Email ${student.Email} sudah terdaftar`
          );
          errorCount++;
          return;
        }

        // Check duplicate in current import batch
        const duplicateInBatch = importedData.find(
          (s) => s.nis === student.NIS || s.email === student.Email
        );
        if (duplicateInBatch) {
          errors.push(
            `Baris ${rowNumber}: NIS atau Email duplikat dalam file import`
          );
          errorCount++;
          return;
        }

        // Create new student
        const newStudent = {
          id: students.length + successCount + 1,
          nis: student.NIS.toString(),
          name: student.Nama,
          email: student.Email,
          phone: student.Telepon ? student.Telepon.toString() : "",
          class: student.Kelas ? student.Kelas.toString() : "",
          status: "active",
          enrollmentDate:
            student["Tanggal Masuk"] ||
            new Date().toISOString().split("T")[0],
        };

        importedData.push(newStudent);
        successCount++;
      } catch (error) {
        errors.push(`Baris ${rowNumber}: Error tidak terduga - ${error}`);
        errorCount++;
      }
    });

    // Add successful imports to students array
    if (importedData.length > 0) {
      students.push(...importedData);
    }

    return NextResponse.json({
      success: successCount > 0,
      message: `Import selesai: ${successCount} berhasil, ${errorCount} gagal`,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit to 10 errors for display
      totalErrors: errors.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses import" },
      { status: 500 }
    );
  }
}
