import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import NumberFormat from 'react-number-format';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

import { AiOutlineQrcode } from 'react-icons/ai';
import {
  BsPlusLg,
  BsDashLg,
  BsCheckLg,
  BsXLg,
  BsArrowRepeat,
} from 'react-icons/bs';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { set } from 'mongoose';

export default function Scanner() {
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPointAmountValid, setIsPointAmountValid] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pointAmount, setPointAmount] = useState();
  const [currentPointAmount, setCurrentPointAmount] = useState();
  const [opType, setOpType] = useState('');
  const [stage, setStage] = useState(1);
  const [waitingResultStage, setWaitingResultStage] = useState(0);
  const [waitText, setWaitText] = useState(1); // 1: Aguarde, coletando valores.; 2: data ; 3: Ocorreu um erro.
  const [isLoadingReader, setIsLoadingReader] = useState(true);
  const qrCodeReader = useRef(null);

  const checkForm = (operation) => {
    if (phoneNumber.length !== 15) return setIsPhoneValid(false);
    if (pointAmount <= 0 || !pointAmount) return setIsPointAmountValid(false);

    if (operation === '+') setOpType('+');
    else setOpType('-');

    try {
      setWaitText(1);
      fetch('/api/get-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.msg && data.msg === 'not found') {
            setCurrentPointAmount(0);
            setWaitText(2);

            return 0;
          }
          setCurrentPointAmount(data.points);
          setWaitText(2);
        });
    } catch (error) {
      console.log(error);
      setWaitText(3);
    }

    setStage(3);
  };

  const submitForm = () => {
    setWaitingResultStage(1);
    try {
      fetch('/api/update-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          operation: opType,
          points: pointAmount,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          setWaitingResultStage(2);
          setStage(4);
        });
    } catch (error) {
      setWaitingResultStage(3);
      console.log(error);
    }
  };

  const resetFields = () => {
    setCurrentPointAmount();
    setOpType('');
    setPhoneNumber('');
    setPointAmount();
  };

  useEffect(() => {
    const innerWidth = window.innerWidth;
    try {
      if (qrCodeReader.current !== null) qrCodeReader.current.stop();
    } catch (error) {}

    setIsLoadingReader(true);

    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          console.log(devices);
          var cameraId = devices[0].id;
          // .. use this to start scanning.

          qrCodeReader.current = new Html5Qrcode('reader', {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          });

          qrCodeReader.current
            .start(
              { facingMode: 'environment' }, // retreived in the previous step.
              {
                fps: 10, // sets the framerate to 10 frame per second
                qrbox: innerWidth * 0.8,
                aspectRatio: 1,
              },
              (qrCodeMessage) => {
                // do something when code is read. For example:
                // console.log(`QR Code detected: ${qrCodeMessage}`);
                qrCodeReader.current
                  .stop()
                  .then((ignore) => {
                    // QR Code scanning is stopped.
                    // console.log('QR Code scanning stopped.');
                    setPhoneNumber(qrCodeMessage);
                    setStage(1);
                  })
                  .catch((err) => {
                    // Stop failed, handle it.
                    console.log('Unable to stop scanning.');
                  });
              },
              (errorMessage) => {
                // parse error, ideally ignore it. For example:
                // console.log(`QR Code no longer in front of camera.`);
              },
            )
            .then(() => {
              console.log('started');
              setIsLoadingReader(false);
            })
            .catch((err) => {
              // Start failed, handle it. For example,
              console.log(`Unable to start scanning, error: ${err}`);
            });
        }
      })
      .catch((err) => {
        // handle err
      });

    return function cleanup() {
      try {
        if (qrCodeReader.current !== null) qrCodeReader.current.stop();
      } catch (error) {}
    };
  }, [stage]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className='flex flex-col p-4 gap-8 w-screen max-w-sm mx-auto'
    >
      <div className='flex justify-center gap-2 text-center font-mont font-bold text-3xl text-gradient'>
        Gerenciar Pontos
      </div>

      {/* Data gathering */}

      {stage === 1 && (
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between'>
            <NumberFormat
              onChange={(e) => {
                setIsPhoneValid(true);
                setPhoneNumber(e.target.value);
              }}
              className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 ${
                !isPhoneValid && 'border-4 border-red-600/70'
              }`}
              placeholder='(##) #####-####'
              format='(##) #####-####'
              mask=''
              value={phoneNumber}
              min='15'
            />

            <motion.div
              onClick={() => setStage(2)}
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
              <AiOutlineQrcode className='inline' />
            </motion.div>
          </div>
          <input
            onChange={(e) => {
              setIsPointAmountValid(true);
              setPointAmount(e.target.value);
            }}
            value={pointAmount}
            type={'number'}
            className={`p-4 text-mont rounded-md font-bold backdrop-blur-sm bg-sky-200/20 ${
              !isPointAmountValid && 'border-4 border-red-600/70'
            }`}
            placeholder='Número de pontos'
          />
          <div className='flex justify-between'>
            <button
              onClick={() => checkForm('-')}
              type='submit'
              className='bg-red-200 text-center text-mont font-bold rounded-md p-4 text-red-900 hover:cursor-pointer'
            >
              <BsDashLg className='inline' /> Remover
            </button>
            <button
              onClick={() => checkForm('+')}
              type='submit'
              className='bg-green-200 text-center text-mont font-bold rounded-md p-4 text-green-900 hover:cursor-pointer'
            >
              <BsPlusLg className='inline' /> Adicionar
            </button>
          </div>
        </div>
      )}
      {/* QR Code Reader */}
      {stage === 2 && (
        <div className='flex flex-col gap-8'>
          {isLoadingReader && (
            <div className='flex flex-col items-center gap-8 p-4 text-mont rounded-md backdrop-blur-sm bg-gradient text-white'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <BsArrowRepeat className='text-8xl' />
              </motion.div>
              <div className='font-bold text-2xl text-center'>Aguarde</div>
            </div>
          )}
          <div id='reader'></div>
          <motion.div
            onClick={() => setStage(1)}
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
        </div>
      )}

      {/* Transaction confirmation */}
      {stage === 3 && (
        <div className='flex flex-col gap-8 p-4 text-mont rounded-md backdrop-blur-sm bg-sky-200/20 text-sky-900'>
          <div className='text-xl'>Confirmação de transação:</div>
          <div className='flex flex-col gap-2'>
            <div>
              Cliente: <span className='font-bold'>{phoneNumber}</span>
            </div>
            <div>
              Operação:{' '}
              <span className='font-bold'>
                {opType === '+' ? 'Adicionar' : 'Remover'} {pointAmount} pontos
              </span>
            </div>
            <div>
              Saldo atual:{' '}
              <span className='font-bold'>
                {waitText === 1 && 'Aguarde, coletando valores.'}{' '}
                {waitText === 2 && currentPointAmount}{' '}
                {waitText === 3 && 'Ocorreu um erro.'}
              </span>
            </div>
            <div>
              Saldo após:{' '}
              <span className='font-bold'>
                {waitText === 1 && 'Aguarde, coletando valores.'}{' '}
                {waitText === 2 &&
                  (opType === '+'
                    ? parseInt(currentPointAmount) + parseInt(pointAmount)
                    : parseInt(currentPointAmount) -
                      parseInt(pointAmount))}{' '}
                {waitText === 3 && 'Ocorreu um erro.'}
              </span>
            </div>
          </div>
          <div className='flex justify-between'>
            <button
              onClick={() => setStage(1)}
              type='submit'
              className='border-gradient border-2 text-center text-mont font-bold rounded-md p-4 text-nicePink hover:cursor-pointer'
            >
              <IoMdArrowRoundBack className='inline' /> Voltar
            </button>

            <button
              onClick={() => {
                submitForm();
                setStage(4);
              }}
              type='submit'
              className='bg-gradient text-center text-mont font-bold rounded-md p-4 text-white hover:cursor-pointer'
            >
              <BsCheckLg className='inline' /> SALVAR
            </button>
          </div>
        </div>
      )}

      {/* Transaction confirmed */}
      {stage === 4 && (
        <div className='flex flex-col gap-8'>
          {waitingResultStage === 1 && (
            <div className='flex flex-col items-center gap-8 p-4 text-mont rounded-md backdrop-blur-sm bg-gradient text-white'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <BsArrowRepeat className='text-8xl' />
              </motion.div>
              <div className='font-bold text-2xl text-center'>Aguarde</div>
            </div>
          )}
          {waitingResultStage === 2 && (
            <div className='flex flex-col items-center gap-8 p-4 text-mont rounded-md backdrop-blur-sm bg-green-500 text-green-200'>
              <BsCheckLg className='text-8xl' />
              <div className='font-bold text-2xl text-center'>
                Transação realizada
              </div>
            </div>
          )}
          {waitingResultStage === 3 && (
            <div className='flex flex-col items-center gap-8 p-4 text-mont rounded-md backdrop-blur-sm bg-red-500/90 text-white'>
              <BsXLg className='text-8xl' />
              <div className='font-bold text-2xl text-center'>
                Ocorreu um erro
              </div>
            </div>
          )}
          <motion.div
            onClick={() => {
              resetFields();
              setStage(1);
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
            className='flex justify-center text-center items-center gap-2 sticky bottom-4 font-mont font-normal text-2xl text-sky-900 border-gradient border-2 p-4 rounded-xl'
          >
            <IoMdArrowRoundBack className='inline' /> Escanear novo código
          </motion.div>
        </div>
      )}
    </div>
  );
}
