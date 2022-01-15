import Image from 'next/image';

import { motion } from 'framer-motion';

import AwardImage from '../images/award-solid.png';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';

export default function Home() {
  const awards = [
    { name: 'Tapioca de 5 Reais', pointAmount: '20' },
    { name: 'Tapioca de 3 Reais', pointAmount: '15' },
    { name: 'Lata de refrigerante', pointAmount: '10' },
  ];

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className='flex flex-col p-4 gap-8 w-screen max-w-sm mx-auto'
    >
      <div className='flex justify-center gap-2 text-center font-mont font-bold text-3xl text-gradient'>
        <div className='w-12'>
          <Image src={AwardImage} />
        </div>
        <div className='w-min'>Recompensas Disponíveis</div>
      </div>
      {awards.map((award) => (
        <div className='flex flex-col justify-between px-4 py-4 border-gradient border-2 rounded-xl'>
          <div className='font-mont font-bold text-gradient text-2xl'>
            • {award.name}:
          </div>
          <div className='font-mont font-medium text-gradient text-2xl'>
            - {award.pointAmount} Pontos
          </div>
        </div>
      ))}

      <Link href={'/'}>
        <motion.div
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
          className='flex justify-center items-center gap-2 sticky bottom-4 font-mont font-normal text-2xl text-white p-4 mx-4 bg-gradient rounded-xl'
        >
          <IoMdArrowRoundBack className='inline' /> Voltar
        </motion.div>
      </Link>
    </div>
  );
}
