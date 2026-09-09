import mammoth from "mammoth";
import pdfParse from "pdf-parse-new"; // Using the modern, ESM-compatible fork

export async function extractTextFromBuffer(buffer, mimeType) {
  try {
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value;
    } else {
      throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
    }

    // Standardize whitespace and remove non-printable control characters
    return extractedText.replace(/\s+/g, " ").trim();
  } catch (error) {
    throw new Error(`Extraction failed: ${error.message}`);
  }
}