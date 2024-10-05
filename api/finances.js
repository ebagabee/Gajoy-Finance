import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./finances.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Ler o arquivo JSON e retornar os dados
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao ler o arquivo' });
      }
      res.status(200).json(JSON.parse(data));
    });
  }

  if (req.method === 'POST') {
    const updatedFinances = req.body; // Recebe o array completo de finanças

    // Sobrescreve o arquivo com o array atualizado de finanças
    fs.writeFile(filePath, JSON.stringify(updatedFinances, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao salvar o arquivo' });
      }
      res.status(200).json({ message: 'Finanças atualizadas com sucesso' });
    });
  }
}
