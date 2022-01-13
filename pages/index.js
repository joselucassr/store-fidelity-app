import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import _devQRCode from '../devAssets/gradientQR.png';
import AwardImage from '../images/award-solid.png';
import WhatsappImage from '../images/whatsapp-brands.png';

// const qrCode = new QRCodeStyling({
//   width: 300,
//   height: 300,
//   image: '',
//   dotsOptions: {
//     gradient: {
//       type: 'linear',
//       rotation: 45,
//       colorStops: [
//         { offset: 0, color: '#ef709b' },
//         { offset: 1, color: '#fa9372' },
//       ],
//     },
//     type: 'classy',
//   },
//   imageOptions: {
//     crossOrigin: 'anonymous',
//     margin: 20,
//   },
//   cornersSquareOptions: {
//     type: 'square',
//   },
//   cornersDotOptions: {
//     type: 'square',
//   },
// });

export default function Home() {
  const [windowHeight, setWindowHeight] = useState('100vh');
  const [phoneNumber, setPhoneNumber] = useState('(61) 91234-5678');
  const ref = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
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
        image: '',
        dotsOptions: {
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: '#ef709b' },
              { offset: 1, color: '#fa9372' },
            ],
          },
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
        data: phoneNumber,
      });

      qrCodeRef.current.append(ref.current);
      ref.current = null;

      // qrCodeRef.current = qrCode;
    });
  }, []);

  useEffect(() => {
    qrCodeRef.current &&
      qrCodeRef.current.update({
        data: phoneNumber,
      });
  }, [phoneNumber]);

  return (
    <div
      // style={{ minHeight: windowHeight }}
      className='flex flex-col mx-auto w-screen max-w-sm'
    >
      <div
        onClick={() => setPhoneNumber('(61) 91234-1234')}
        className='mx-auto px-4 my-4'
      >
        <div className='backdrop-blur-sm px-4 py-4 bg-sky-200/25 rounded-xl'>
          {/* <Image src={_devQRCode}></Image> */}
          <div ref={ref} />
          <p className='text-center font-mont font-bold text-nicePink'>
            Toque para trocar de número
          </p>
        </div>
      </div>

      <div className='flex flex-row mx-4 gap-x-4'>
        <div className='basis-3/4 backdrop-blur-sm px-4 py-2 rounded-xl btn-gradient-2 flex flex-col '>
          <span className='text-xl text-gradient font-mont'>Pontos:</span>
          <p className='text-9xl text-center font-mont font-bold text-gradient my-auto'>
            20
          </p>
        </div>

        <div className='basis-1/4 backdrop-blur-sm px-4 py-4 bg-sky-200/25 rounded-xl text-sm text-center font-medium flex flex-col gap-y-4'>
          <div className=''>
            <div className='w-10 mx-auto'>
              <Image src={WhatsappImage} />
            </div>
            <p className='text-mont text-gradient'>Faça seu pedido</p>
          </div>
          <div className=''>
            <div className='w-10 mx-auto'>
              <Image src={AwardImage} />
            </div>
            <p className='text-mont text-gradient'>Recompensas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
