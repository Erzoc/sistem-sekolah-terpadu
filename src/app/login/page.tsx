'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SimpleLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/guru';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Email atau password salah!');
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', width: '300px' }}>
        <h2>Login Guru</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label><br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem', background: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
          Masuk
        </button>
      </form>
    </div>
  );
}
