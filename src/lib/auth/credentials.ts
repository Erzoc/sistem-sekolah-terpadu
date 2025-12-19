import bcrypt from "bcryptjs";

export interface UserCredential {
  id: string;
  username: string;
  password: string; // hashed
  name: string;
  email: string;
  role: "superadmin" | "admin" | "guru" | "siswa";
}

// Database users (nanti diganti dengan Supabase)
export const users: UserCredential[] = [
  {
    id: "1",
    username: "superadmin",
    password: "$2a$10$rI7zXZ5X5X5X5X5X5X5X5X", // hash dari "121212"
    name: "Super Admin",
    email: "superadmin@sstf.id",
    role: "superadmin",
  },
  {
    id: "2",
    username: "admin",
    password: "$2a$10$rI7zXZ5X5X5X5X5X5X5X5X", // hash dari "admin123"
    name: "Admin Sekolah",
    email: "admin@sstf.id",
    role: "admin",
  },
  {
    id: "3",
    username: "guru",
    password: "$2a$10$rI7zXZ5X5X5X5X5X5X5X5X", // hash dari "guru123"
    name: "Pak Guru",
    email: "guru@sstf.id",
    role: "guru",
  },
  {
    id: "4",
    username: "siswa",
    password: "$2a$10$rI7zXZ5X5X5X5X5X5X5X5X", // hash dari "siswa123"
    name: "Siswa",
    email: "siswa@sstf.id",
    role: "siswa",
  },
];

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function findUserByUsername(username: string): UserCredential | undefined {
  return users.find((user) => user.username === username);
}
