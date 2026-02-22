import { supabase } from './supabaseClient';
import { TestRecord } from '../types.ts';

export const storageService = {
  // Recupera tutti i test dal cloud di Supabase
  async getAllTests(): Promise<TestRecord[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('uploadedAt', { ascending: false });

    if (error) {
      console.error("Errore nel recupero dati:", error);
      throw error;
    }
    return data as TestRecord[];
  },

  // Salva un nuovo test su Supabase
  async saveTest(test: TestRecord): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .upsert(test); // Invia l'oggetto così com'è, rispettando le maiuscole

    if (error) {
      console.error("Errore nel salvataggio:", error);
      throw error;
    }
  },

  // Elimina un test dal cloud
  async deleteTest(id: string): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Errore nell'eliminazione:", error);
      throw error;
    }
  }
};
