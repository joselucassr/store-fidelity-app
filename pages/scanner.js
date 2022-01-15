import Image from 'next/image';

import { motion } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';

import AwardImage from '../images/award-solid.png';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Scanner() {
  useEffect(() => {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult,
      countResults = 0;

    function onScanSuccess(decodedText, decodedResult) {
      if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        // Handle on success condition with the decoded message.
        console.log(`Scan result ${decodedText}`, decodedResult);
      }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });
    html5QrcodeScanner.render(onScanSuccess);
  }, []);
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

      <div id='qr-reader' style={{ width: '500px' }}></div>
      <div id='qr-reader-results'></div>

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
