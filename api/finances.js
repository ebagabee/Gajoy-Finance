import { createClient } from '@supabase/supabase-js';

// Acesse as variáveis de ambiente no backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Busca todas as finanças no Supabase
    const { data, error } = await supabase
      .from('finances')
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Falha ao carregar as finanças' });
    }

    res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const newFinance = req.body;

    // Insere a nova entrada no Supabase
    const { data, error } = await supabase
      .from('finances')
      .insert([newFinance]);

    if (error) {
      return res.status(500).json({ error: 'Falha ao salvar a finança' });
    }

    res.status(200).json({ message: 'Finança adicionada com sucesso', data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;

    // Exclui uma entrada pelo ID
    const { data, error } = await supabase
      .from('finances')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Falha ao excluir a finança' });
    }

    res.status(200).json({ message: 'Finança excluída com sucesso', data });
  }

  if (req.method === 'PUT') {
    const { id, updatedFinance } = req.body;

    // Atualiza uma entrada pelo ID
    const { data, error } = await supabase
      .from('finances')
      .update(updatedFinance)
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Falha ao atualizar a finança' });
    }

    res.status(200).json({ message: 'Finança atualizada com sucesso', data });
  }
}
