
export interface TestRecord {
  id: string;
  testName: string; // Extracted formal name
  canonicalName: string; // English formal name for duplicate detection
  itemCount: number; // Number of questions/items in the test
  fileName: string; // Original filename
  fileData: string; // Base64 original
  mimeType: string;
  description: string; // Administration type (Self-report / Dependent of operator)
  testType: string; // e.g. Self-report, Employee test, Checklist, etc.
  administrationMethod: string; // Brief summary of administration methods
  testPurpose: string; // Brief explanation of what the test is for
  ageTarget: string;
  isSelfReport: boolean;
  extractedContent: string; // The isolated test questions/instructions
  uploadedAt: string;
  containsTest: boolean;
}

export interface AnalysisResult {
  testName: string;
  canonicalName: string;
  itemCount: number;
  description: string;
  testType: string;
  administrationMethod: string;
  testPurpose: string;
  ageTarget: string;
  isSelfReport: boolean;
  extractedContent: string;
  containsTest: boolean;
}
