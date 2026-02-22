import { supabase } from './supabaseClient';
import { TestRecord } from '../types.ts';

export const storageService = {
  // Recupera i test (DB minuscolo -> App camelCase)
  async getAllTests(): Promise<TestRecord[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('uploadedat', { ascending: false });

    if (error) {
      console.error("Errore download:", error.message);
      return [];
    }
    
    return (data || []).map(row => ({
      ...row,
      testName: row.testname,
      canonicalName: row.canonicalname,
      itemCount: row.itemcount,
      fileName: row.filename,
      fileData: row.filedata,
      mimeType: row.mimetype,
      testType: row.testtype,
      administrationMethod: row.administrationmethod,
      testPurpose: row.testpurpose,
      ageTarget: row.agetarget,
      isSelfReport: row.isselfreport,
      extractedContent: row.extractedcontent,
      uploadedAt: row.uploadedat,
      containsTest: row.containstest
    })) as TestRecord[];
  },

  // Salva i test (App camelCase -> DB minuscolo)
  async saveTest(test: TestRecord): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .upsert({
        id: test.id,
        testname: test.testName,
        canonicalname: test.canonicalName,
        itemcount: test.itemCount,
        filename: test.fileName,
        filedata: test.fileData,
        mimetype: test.mimeType,
        description: test.description,
        testtype: test.testType,
        administrationmethod: test.administrationMethod,
        testpurpose: test.testPurpose,
        agetarget: test.ageTarget,
        isselfreport: test.isSelfReport,
        extractedcontent: test.extractedContent,
        containstest: test.containsTest
        // uploadedat viene gestito dal default now() di Supabase
      });

    if (error) {
      console.error("Errore salvataggio:", error.message);
      throw error;
    }
  },

  // ELIMINA TEST (Questa è la funzione che mancava a TypeScript!)
  async deleteTest(id: string): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Errore eliminazione:", error.message);
      throw error;
    }
  }
};
