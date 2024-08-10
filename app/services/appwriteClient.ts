import { Client, Storage } from 'appwrite';

const client = new Client();
const storage = new Storage(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66b3da27002675905418');

export const uploadVideo = async (blob: Blob) => {
  const file = new File([blob], 'recording.webm', { type: 'video/webm' });

  try {
    await storage.createFile('66b3dae8000bd799df6f', 'unique()', file);
    alert('Upload bem-sucedido!');
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
  }
};
