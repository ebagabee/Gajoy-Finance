import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./finances.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao ler o arquivo' });
      }
      res.status(200).json(JSON.parse(data));
    });
  }

  if (req.method === 'POST') {
    const newFinance = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Falha ao ler o arquivo' });
      }

      const finances = JSON.parse(data);
      finances.push(newFinance);

      fs.writeFile(filePath, JSON.stringify(finances), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Falha ao salvar o arquivo' });
        }
        res.status(200).json({ message: 'Entrada adicionada com sucesso' });
      });
    });
  }
}
