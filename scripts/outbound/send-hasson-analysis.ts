import { Resend } from 'resend';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const htmlPath = path.resolve(__dirname, '../../docs/hasson-advogados-cenario-atual-2026-04-23.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contato@digitaldog.pet',
      to: 'roland@hassonadvogados.com.br',
      subject: 'Análise de Posicionamento Digital - Hasson Advogados',
      html: `
        <p>Olá Roland,</p>
        <p>Conforme conversamos, segue em anexo e também abaixo a análise sobre o cenário atual da presença digital da Hasson Advogados.</p>
        <p>O foco do material é o posicionamento em buscas locais e a nova camada de respostas por IA.</p>
        <br/>
        <p>Atenciosamente,</p>
        <p>Equipe Digital Dog</p>
        <hr/>
        ${htmlContent}
      `,
      attachments: [
        {
          filename: 'hasson-advogados-cenario-atual-2026-04-23.html',
          content: Buffer.from(htmlContent).toString('base64'),
        }
      ]
    });

    console.log('Email enviado com sucesso:', data);
  } catch (error) {
    console.error('Erro ao enviar o email:', error);
  }
}

main();
