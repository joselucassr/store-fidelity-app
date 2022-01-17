import Link from 'next/link';

import { motion } from 'framer-motion';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { useEffect, useState } from 'react';

export default function AdminMenu() {
  const [hasLoginError, setHasLoginError] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = () => {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        user: user,
        password: password,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 200) throw 'error';
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('@store-fidelity/loginToken', data.loginToken);
        setHasToken(true);
      })
      .catch((error) => {
        setHasLoginError(true);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('@store-fidelity/loginToken')) setHasToken(true);
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className='flex flex-col p-4 gap-8 w-screen max-w-sm mx-auto'
    >
      <div className='flex justify-center gap-2 text-center font-mont font-bold text-3xl text-gradient'>
        Painel de vendas
      </div>

      {!hasToken ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className='contents'
        >
          <input
            onChange={(e) => {
              setHasLoginError(false);
              setUser(e.target.value);
            }}
            value={user}
            type={'text'}
            className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 ${
              hasLoginError && 'border-4 border-red-600/70'
            }`}
            placeholder='Usuário'
          />
          <input
            onChange={(e) => {
              setHasLoginError(false);
              setPassword(e.target.value);
            }}
            value={password}
            type={'password'}
            className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 ${
              hasLoginError && 'border-4 border-red-600/70'
            }`}
            placeholder='Senha'
          />

          <motion.div
            onClick={() => submitForm()}
            initial='hidden'
            animate='visible'
            variants={{
              hidden: {
                scale: 0.8,
                opacity: 0,
              },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.4,
                },
              },
            }}
            className='flex justify-center items-center gap-2 sticky bottom-4 font-mont font-normal text-2xl text-white p-4 bg-gradient rounded-xl'
          >
            Login
          </motion.div>
        </form>
      ) : (
        <Link href='/scanner'>
          <div className='flex flex-col justify-between px-4 py-4 border-gradient border-2 rounded-xl'>
            <div className='font-mont font-bold text-gradient text-2xl'>
              Acessar scanner
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
