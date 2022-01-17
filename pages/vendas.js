import Link from 'next/link';

import { motion } from 'framer-motion';

import { BsXLg } from 'react-icons/bs';
import { useEffect, useState } from 'react';

export default function AdminMenu() {
  const [hasLoginError, setHasLoginError] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [exitConfirmation, setExitConfirmation] = useState(false);

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

        setUser('');
        setPassword('');

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
    <div className='flex flex-col gap-8 w-screen'>
      {exitConfirmation && (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.1,
              },
            },
          }}
          onClick={() => {
            setExitConfirmation(false);
          }}
          className={`absolute z-10 bg-sky-900/50 w-screen h-screen backdrop-blur-sm`}
        >
          <div className='flex flex-col h-screen pt-36 gap-4 p-8'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                localStorage.removeItem('@store-fidelity/loginToken');
                setHasToken(false);
                setExitConfirmation(false);
              }}
              type='submit'
              className='bg-gradient text-center text-mont font-bold text-3xl rounded-md p-4 text-white hover:cursor-pointer'
            >
              Desejo sair
            </button>
          </div>
        </motion.div>
      )}

      <div className='flex justify-center p-4 mx-auto gap-2 text-center font-mont font-bold text-3xl text-gradient'>
        Painel de vendas
      </div>

      {!hasToken ? (
        <div className='max-w-sm mx-auto p-4 w-screen'>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
          >
            <input
              onChange={(e) => {
                setHasLoginError(false);
                setUser(e.target.value);
              }}
              value={user}
              type={'text'}
              className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 w-full ${
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
              className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 w-full ${
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
        </div>
      ) : (
        <div className='flex flex-col p-4 gap-8'>
          <Link href='/scanner'>
            <div className='flex flex-col justify-between px-4 py-4 border-gradient border-2 rounded-xl'>
              <div className='font-mont font-bold text-gradient text-2xl'>
                Acessar scanner
              </div>
            </div>
          </Link>

          <motion.div
            onClick={() => {
              setExitConfirmation(true);
            }}
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
            className='flex justify-center text-center items-center gap-2 sticky bottom-4 font-mont font-normal text-2xl text-red-900/60 border-nicePink/60 backdrop-blur-sm bg-sky-200/20 border-2 p-4 rounded-xl'
          >
            <BsXLg className='inline' /> Sair
          </motion.div>
        </div>
      )}
    </div>
  );
}
