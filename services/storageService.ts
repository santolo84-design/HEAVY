import { supabase } from './supabaseClient';
import { TestRecord } from '../types.ts';

export const storageService = {
  async getAllTests(): Promise<TestRecord[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('uploadedat', { ascending: false });

    if (error) return [];
    
    // Converte dal database (minuscolo) all'app (maiuscolo)
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

  async saveTest(test: TestRecord): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .upsert({
        id: test.id,
        testname: test.testName, // Mappa app -> DB minuscolo
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
      });

    if (error) {
      console.error("Errore DB:", error.message);
      throw error;
    }
  }
};
