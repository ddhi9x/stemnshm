import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

async function run() {
  try {
    let pdfData = await pdf(fs.readFileSync('../STEM_ Architecting a Green world 2025.pdf'));
    fs.writeFileSync('pdf_out.txt', pdfData.text);
    console.log('PDF extracted');

    let docx = await mammoth.extractRawText({path: '../chat gpt.docx'});
    fs.writeFileSync('docx_out.txt', docx.value);
    console.log('DOCX extracted');
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
