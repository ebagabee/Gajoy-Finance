import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./api/finances.json'); // Caminho correto para o arquivo JSON

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Lê o arquivo JSON e retorna os dados
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao ler o arquivo' });
      }
      res.status(200).json(JSON.parse(data)); // Retorna os dados do JSON
    });
  }

  if (req.method === 'POST') {
    // Recebe o array completo de finanças do frontend
    const updatedFinances = req.body;

    // Escreve o array completo no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(updatedFinances, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao salvar o arquivo' });
      }
      res.status(200).json({ message: 'Finanças atualizadas com sucesso' });
    });
  }
}
