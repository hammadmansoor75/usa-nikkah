'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [passwordResetStatus, setPasswordResetStatus] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/reset-password', { token, password });
      if (res.status === 200) {
        setPasswordResetStatus(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
            <div className='bg-white shadow-lg flex items-center justify-start px-7 md:px-10 py-3 w-full' >
                <Link href='/auth/forgot-password' className="cursor-pointer" ><Image src='/assets/back-icon.svg' alt='backIcon' height={30} width={30} /></Link>
                <div className='w-full' >
                    <h1 className='text-center text-xl font-semibold text-us_blue' >Change Password</h1>
                </div>
            </div>

        {passwordResetStatus ? (<div className='mt-10' >
                <div className='min-h-screen bg-us_blue rounded-t-3xl w-full flex items-center justify-center' >
                    <div className='flex items-center justify-center flex-col px-5' >
                        <h1 className='text-white text-center text-[24px] font-semibold tracking-wide' >Success</h1>
                        <p className='text-white mt-5 text-center text-[16px]' >Your password has been successfully changed. </p>
                        <p className='text-white tracking-wide mt-5 text-center text-[16px] font-semibold' ><Link href = '/auth/login' className='text-green-400 underline' >Sign In</Link></p>
                    </div>
                </div>
            </div>) : (<div className='mt-10 container-sm mx-auto'>
          <div className='flex items-center justify-center' >
            <div className='flex flex-col gap-2' >
              <label className='text-sm text-sub_text_2' >New Password</label>
              <div className='input' >
              <input className='text-sm text-black' type='password' placeholder='New Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </div>


          <div className='flex items-center justify-center mt-10' >
            <div className='flex flex-col gap-2' >
              <label className='text-sm text-sub_text_2' >Confrim Password</label>
              <div className='input' >
              <input className='text-sm text-black' type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
          </div>

          {error && <p className='text-red-500 text-sm text-center mt-5' >{error}</p>}

          <div className='flex items-center justify-center mt-10' ><button onClick={handleSubmit} className='blue-button' >SUBMIT</button></div>
        </div>)}
      </section>
    </main>
  );
}
