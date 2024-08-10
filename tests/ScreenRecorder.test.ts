import { test, expect } from 'playwright/test';
import { Client, Storage } from 'appwrite';

test.describe('Screen Recorder Tests', () => {

  // Configurações do AppWrite
  const client = new Client();
  const storage = new Storage(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Seu AppWrite Endpoint
    .setProject('66b3da27002675905418'); // Seu Project ID

  const bucketId = '66b3dae8000bd799df6f'; // ID do bucket

  test('Inicia e para gravação, e verifica se o arquivo foi criado no AppWrite', async ({ page }) => {
    
    // Navegar para a página onde o ScreenRecorder está implementado
    await page.goto('http://localhost:3000'); // Substitua pela URL da sua aplicação

    // Verificar se o botão "Iniciar Gravação" está visível e clicável
    const startButton = page.locator('text=Iniciar Gravação');
    await expect(startButton).toBeVisible();

    // Clicar no botão para iniciar a gravação
    await startButton.click();

    // Verificar se o botão mudou para "Parar Gravação"
    const stopButton = page.locator('text=Parar Gravação');
    await expect(stopButton).toBeVisible();

    // Aguarde alguns segundos para capturar uma parte da tela
    await page.waitForTimeout(5000); // Gravação de 5 segundos

    // Clicar no botão "Parar Gravação"
    await stopButton.click();

    // Verificar se o vídeo foi enviado e criado no AppWrite
    const files = await storage.listFiles(bucketId);
    const recordingFile = files.files.find(file => file.name === 'recording.webm');

    expect(recordingFile).toBeDefined(); // Verifica se o arquivo existe
  });
});
