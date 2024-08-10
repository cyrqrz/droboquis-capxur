"use client"; // Necessário para importar a biblioteca use* do React

import { useEffect, useRef, useState } from 'react';
import { uploadVideo } from '../../services/appwriteClient';
import RecordButton from '../RecordButton/RecordButton'; // Importando o botão de gravação
import styles from '../../page.module.css';

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const webcamRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startRecording = async () => {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({});
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (webcamRef.current) {
          webcamRef.current.srcObject = webcamStream;
          webcamRef.current.play();
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const screenVideo = document.createElement('video');

        screenVideo.srcObject = screenStream;

        await new Promise<void>((resolve) => {
          screenVideo.onloadedmetadata = () => {
            screenVideo.play();
            resolve();
          };
        });

        canvas.width = screenVideo.videoWidth;
        canvas.height = screenVideo.videoHeight;

        const combineStreams = () => {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(webcamRef.current!, 1280, 125, 480, 270); // Configura tamanho da webcam
        };

        const intervalId = setInterval(combineStreams, 1000 / 30); // Configura a taxa de quadros

        const combinedStream = canvas.captureStream();
        const audioTracks = audioStream.getAudioTracks();
        combinedStream.addTrack(audioTracks[0]);

        mediaRecorderRef.current = new MediaRecorder(combinedStream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 1700000,
        });

        const chunks: BlobPart[] = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          clearInterval(intervalId);
          const blob = new Blob(chunks, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          setVideoUrl(videoUrl);
          await uploadVideo(blob); // Utilizando o serviço de upload
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    };

    if (recording) {
      startRecording();
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [recording]);

  return (
    <div className={styles.container}>
      <RecordButton recording={recording} onClick={() => setRecording(!recording)} /> {/* Usando o novo componente */}
      <div className={styles.webcamPreviewContainer}>
        <video ref={webcamRef} className={styles.webcamPreview} autoPlay muted />
      </div>
      {videoUrl && (
        <div className={styles.videoPreviewContainer}>
          <video className={styles.videoPreview} src={videoUrl} controls autoPlay loop />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
