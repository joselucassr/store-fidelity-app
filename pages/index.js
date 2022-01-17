import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { motion } from 'framer-motion';

import _devQRCode from '../devAssets/gradientQR.png';
import QRCodePlaceholder from '../images/QRCodePlaceholder.png';
import AwardImage from '../images/award-solid.png';
import WhatsappImage from '../images/whatsapp-brands.png';
import { BsTelephoneFill } from 'react-icons/bs';
import Link from 'next/link';

export default function Home() {
  const whatsappMsg = `Olá, desejo fazer um pedido.`;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);
  const [pointTotal, setPointTotal] = useState(0);
  const qrCodeDivRef = useRef(null);
  const qrCodeRef = useRef(null);

  //Fetch points
  useEffect(() => {
    if (localStorage.getItem('@store-fidelity/phoneNumber'))
      setPointTotal(localStorage.getItem('@store-fidelity/pointTotal'));

    if (phoneNumber !== '' && phoneNumber !== undefined)
      try {
        fetch('/api/get-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ phoneNumber: phoneNumber }),
        })
          .then((res) => res.json())
          .then((data) => {
            setPointTotal(data.points);
            localStorage.setItem('@store-fidelity/pointTotal', data.points);
          });
      } catch (error) {
        console.log(error);
      }
  }, [phoneNumber]);

  // QR Code setup
  useEffect(() => {
    let startPhoneNumber = localStorage.getItem('@store-fidelity/phoneNumber');
    if (startPhoneNumber) {
      setPhoneNumber(startPhoneNumber);
      setTempPhoneNumber(startPhoneNumber);
    } else startPhoneNumber = '(##) #####-####';

    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const sizeRatio = 0.66;
    const backupRatio = 0.8;

    let canvasSize = innerHeight * sizeRatio;

    if (canvasSize > innerWidth) canvasSize = innerWidth * backupRatio;

    // Dynamically import qr-code-styling only client-side
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      qrCodeRef.current = new QRCodeStyling({
        width: canvasSize,
        height: canvasSize,
        image: '/icon-192x192.png',
        dotsOptions: {
          color: '#703549',
          // gradient: {
          //   type: 'linear',
          //   rotation: 45,
          //   colorStops: [
          //     { offset: 0, color: '#ef709b' },
          //     { offset: 1, color: '#fa9372' },
          //   ],
          // },
          type: 'classy',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 20,
        },
        cornersSquareOptions: {
          type: 'square',
        },
        cornersDotOptions: {
          type: 'square',
        },
        backgroundOptions: {
          color: 'none',
        },
        data: startPhoneNumber,
      });

      qrCodeRef.current.append(qrCodeDivRef.current);
      qrCodeDivRef.current = null;

      // qrCodeRef.current = qrCode;
    });
  }, []);

  // Update QR Code
  useEffect(() => {
    qrCodeRef.current &&
      qrCodeRef.current.update({
        data: phoneNumber,
      });
  }, [phoneNumber]);

  const [isPhoneValid, setIsPhoneValid] = useState(true);

  // Update phone
  const updatePhone = () => {
    if (tempPhoneNumber.length !== 15) {
      return setIsPhoneValid(false);
    }

    setPhoneNumber(tempPhoneNumber);
    setIsConfigOpen(false);
    setIsPhoneValid(true);

    localStorage.setItem('@store-fidelity/phoneNumber', tempPhoneNumber);
  };

  const exitConfigCleanup = () => {
    setTempPhoneNumber(phoneNumber);
    setIsPhoneValid(true);
  };

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div
      // style={{ minHeight: windowHeight }}
      onContextMenu={(e) => e.preventDefault()}
      className='flex flex-col w-screen max-w-sm'
    >
      {/* Set Phone */}
      {isConfigOpen && (
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
            setIsConfigOpen(false);
            exitConfigCleanup();
          }}
          className={`absolute z-10 bg-sky-900/50 w-screen h-screen backdrop-blur-sm`}
        >
          <div className='flex flex-col h-screen pt-36 gap-4 p-8'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePhone();
              }}
              className='contents'
            >
              <NumberFormat
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  setIsPhoneValid(true);
                  setTempPhoneNumber(e.target.value);
                }}
                className={`text-center text-mont text-3xl rounded-md p-4 font-bold text-white backdrop-blur-sm bg-sky-200/20 ${
                  !isPhoneValid && 'border-4 border-red-600/70'
                }`}
                placeholder='(##) #####-####'
                format='(##) #####-####'
                mask=''
                value={tempPhoneNumber}
                min='15'
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                type='submit'
                className='bg-gradient text-center text-mont font-bold text-3xl rounded-md p-4 text-white hover:cursor-pointer'
              >
                <BsTelephoneFill className='inline' /> SALVAR
              </button>
            </form>
          </div>
        </motion.div>
      )}

      <div className='mx-auto px-4 my-4'>
        <div
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className='backdrop-blur-sm px-4 py-4 bg-sky-200/25 rounded-xl'
        >
          <div
            className={`w-auto ${
              phoneNumber ? 'invisible absolute' : undefined
            }`}
          >
            <Image src={QRCodePlaceholder}></Image>
          </div>

          <div className={!phoneNumber ? 'invisible absolute' : undefined}>
            <div ref={qrCodeDivRef} />
            <p className='text-center font-mont font-bold text-nicePink'>
              Toque para trocar de número
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-row mx-4 gap-x-4'>
        <div className='basis-3/4 backdrop-blur-sm px-4 py-2 rounded-xl border-gradient flex flex-col '>
          <span className='text-xl text-gradient font-mont'>Pontos:</span>
          <p className='text-9xl text-center font-mont font-bold text-gradient my-auto'>
            {pointTotal}
          </p>
        </div>

        <div className='basis-1/4 backdrop-blur-sm px-4 py-4 bg-sky-200/25 rounded-xl text-sm text-center font-medium flex flex-col gap-y-4'>
          <a
            href={`https://wa.me/5561981485731?text=${encodeURI(whatsappMsg)}`}
            target='_blank'
          >
            <div className=''>
              <div className='w-10 mx-auto'>
                <Image src={WhatsappImage} />
              </div>
              <p className='text-mont text-gradient'>Faça seu pedido</p>
            </div>
          </a>
          <Link href='/recompensas'>
            <div className=''>
              <div className='w-10 mx-auto'>
                <Image src={AwardImage} />
              </div>
              <p className='text-mont text-gradient'>Recompensas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
