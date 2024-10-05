import { createClient } from '@supabase/supabase-js';

// Acesse as variáveis de ambiente no backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Adicionando logs para verificar se as variáveis de ambiente estão acessíveis
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Key is set' : 'Key is missing');

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log(`Received a ${req.method} request`);

  if (req.method === 'GET') {
    try {
      // Busca todas as finanças no Supabase
      const { data, error } = await supabase
        .from('finances')
        .select('*');

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        return res.status(500).json({ error: 'Falha ao carregar as finanças' });
      }

      console.log('Fetched finances:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error handling GET request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const newFinance = req.body;

      // Log the payload (request body)
      console.log('Received new finance data:', newFinance);

      // Insere a nova entrada no Supabase
      const { data, error } = await supabase
        .from('finances')
        .insert([newFinance]);

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        return res.status(500).json({ error: 'Falha ao salvar a finança' });
      }

      console.log('Inserted finance data:', data);
      res.status(200).json({ message: 'Finança adicionada com sucesso', data });
    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      console.log('Received DELETE request for ID:', id);

      // Exclui uma entrada pelo ID
      const { data, error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data from Supabase:', error);
        return res.status(500).json({ error: 'Falha ao excluir a finança' });
      }

      console.log('Deleted finance data:', data);
      res.status(200).json({ message: 'Finança excluída com sucesso', data });
    } catch (error) {
      console.error('Error handling DELETE request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, updatedFinance } = req.body;

      console.log('Received PUT request for ID:', id);
      console.log('Updated finance data:', updatedFinance);

      // Atualiza uma entrada pelo ID
      const { data, error } = await supabase
        .from('finances')
        .update(updatedFinance)
        .eq('id', id);

      if (error) {
        console.error('Error updating data in Supabase:', error);
        return res.status(500).json({ error: 'Falha ao atualizar a finança' });
      }

      console.log('Updated finance data:', data);
      res.status(200).json({ message: 'Finança atualizada com sucesso', data });
    } catch (error) {
      console.error('Error handling PUT request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
