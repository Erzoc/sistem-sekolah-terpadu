export async function GET() {
  return Response.redirect(new URL('/login?logged-out=true', process.env.NEXTAUTH_URL), 307);
}

export async function POST() {
  return Response.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}
