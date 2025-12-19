import { NextRequest, NextResponse } from "next/server";

// Mock data teachers
let teachers = [
  {
    id: 1,
    nip: "198501012010011001",
    name: "Budi Santoso",
    email: "budi.santoso@sstf.id",
    phone: "081234567890",
    subject: "Matematika",
    status: "active",
    joinDate: "2010-01-15",
  },
  {
    id: 2,
    nip: "198703152012012002",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@sstf.id",
    phone: "081234567891",
    subject: "Bahasa Indonesia",
    status: "active",
    joinDate: "2012-03-20",
  },
  {
    id: 3,
    nip: "199001202015011003",
    name: "Ahmad Fadli",
    email: "ahmad.fadli@sstf.id",
    phone: "081234567892",
    subject: "Fisika",
    status: "active",
    joinDate: "2015-07-10",
  },
  {
    id: 4,
    nip: "198806102013012004",
    name: "Rina Wijaya",
    email: "rina.wijaya@sstf.id",
    phone: "081234567893",
    subject: "Kimia",
    status: "active",
    joinDate: "2013-09-01",
  },
  {
    id: 5,
    nip: "199205152016011005",
    name: "Dedi Kurniawan",
    email: "dedi.kurniawan@sstf.id",
    phone: "081234567894",
    subject: "Biologi",
    status: "active",
    joinDate: "2016-01-05",
  },
];

// GET all teachers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");

  let filteredTeachers = teachers;

  if (search) {
    filteredTeachers = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.nip.includes(search) ||
        teacher.subject.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredTeachers,
    total: filteredTeachers.length,
  });
}

// POST new teacher
export async function POST(request: NextRequest) {
  const body = await request.json();

  const newTeacher = {
    id: teachers.length + 1,
    nip: body.nip,
    name: body.name,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    status: body.status || "active",
    joinDate: body.joinDate || new Date().toISOString().split("T")[0],
  };

  teachers.push(newTeacher);

  return NextResponse.json({
    success: true,
    message: "Guru berhasil ditambahkan",
    data: newTeacher,
  });
}

// ... existing POST function ...

// Bulk import teachers
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { teachers: importedTeachers } = body;

  if (!Array.isArray(importedTeachers)) {
    return NextResponse.json(
      { success: false, message: "Data tidak valid" },
      { status: 400 }
    );
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  importedTeachers.forEach((teacher, index) => {
    try {
      // Validate required fields
      if (!teacher.NIP || !teacher.Nama || !teacher.Email) {
        errors.push(`Baris ${index + 2}: Data tidak lengkap`);
        errorCount++;
        return;
      }

      // Check if NIP already exists
      const exists = teachers.find((t) => t.nip === teacher.NIP);
      if (exists) {
        errors.push(`Baris ${index + 2}: NIP ${teacher.NIP} sudah ada`);
        errorCount++;
        return;
      }

      const newTeacher = {
        id: teachers.length + 1 + successCount,
        nip: teacher.NIP,
        name: teacher.Nama,
        email: teacher.Email,
        phone: teacher.Telepon || "",
        subject: teacher["Mata Pelajaran"] || "",
        status: "active",
        joinDate:
          teacher["Tanggal Bergabung"] ||
          new Date().toISOString().split("T")[0],
      };

      teachers.push(newTeacher);
      successCount++;
    } catch (error) {
      errors.push(`Baris ${index + 2}: Error tidak terduga`);
      errorCount++;
    }
  });

  return NextResponse.json({
    success: successCount > 0,
    message: `Berhasil import ${successCount} guru, gagal ${errorCount}`,
    successCount,
    errorCount,
    errors: errors.slice(0, 10), // Limit error messages
  });
}

// PUT update teacher
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  const index = teachers.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, message: "Guru tidak ditemukan" },
      { status: 404 }
    );
  }

  teachers[index] = {
    ...teachers[index],
    ...body,
  };

  return NextResponse.json({
    success: true,
    message: "Data guru berhasil diupdate",
    data: teachers[index],
  });
}

// DELETE teacher
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const index = teachers.findIndex((t) => t.id === parseInt(id));

  if (index === -1) {
    return NextResponse.json(
      { success: false, message: "Guru tidak ditemukan" },
      { status: 404 }
    );
  }

  teachers.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: "Guru berhasil dihapus",
  });
}
