import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./api/database.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Lê o arquivo JSON e retorna os dados
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao ler o arquivo' });
      }
      try {
        const finances = JSON.parse(data || '[]'); // Certifica que o JSON existe
        res.status(200).json(finances); // Retorna o conteúdo de `database.json`
      } catch (err) {
        return res.status(500).json({ error: 'Erro ao parsear o JSON' });
      }
    });
  }

  if (req.method === 'POST') {
    const updatedFinances = req.body; // Recebe o array de finanças

    // Salva o array atualizado no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(updatedFinances, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao salvar o arquivo' });
      }
      res.status(200).json({ message: 'Finanças atualizadas com sucesso' });
    });
  }
}
