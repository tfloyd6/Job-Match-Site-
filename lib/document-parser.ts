import { parseBuffer as parsePdf } from "pdf-parse"
import mammoth from "mammoth"

export interface ParsedDocument {
  text: string
  metadata?: {
    pageCount?: number
    wordCount?: number
    fileSize?: number
  }
}

export class DocumentParserService {
  async parseDocument(buffer: Buffer, mimeType: string, fileName: string): Promise<ParsedDocument> {
    try {
      let result: ParsedDocument

      switch (mimeType) {
        case "application/pdf":
          result = await this.parsePdf(buffer)
          break
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          result = await this.parseWord(buffer)
          break
        case "text/plain":
          result = this.parseText(buffer)
          break
        default:
          throw new Error(`Unsupported file type: ${mimeType}`)
      }

      // Ensure we have valid text content
      if (!result.text || result.text.trim().length === 0) {
        throw new Error("No text content could be extracted from the document")
      }

      return result
    } catch (error) {
      console.error("Error parsing document:", error)
      // Rethrow with more context
      throw new Error(`Failed to parse ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async parsePdf(buffer: Buffer): Promise<ParsedDocument> {
    try {
      // Use a simpler approach for PDF parsing to avoid potential issues
      const result = await parsePdf(buffer)

      return {
        text: this.cleanText(result.text),
        metadata: {
          pageCount: result.numpages,
          wordCount: result.text.split(/\s+/).length,
          fileSize: buffer.length,
        },
      }
    } catch (error) {
      console.error("PDF parsing error:", error)
      throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async parseWord(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer })

      return {
        text: this.cleanText(result.value),
        metadata: {
          wordCount: result.value.split(/\s+/).length,
          fileSize: buffer.length,
        },
      }
    } catch (error) {
      console.error("Word document parsing error:", error)
      throw new Error(`Word document parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private parseText(buffer: Buffer): ParsedDocument {
    try {
      const text = buffer.toString("utf-8")

      return {
        text: this.cleanText(text),
        metadata: {
          wordCount: text.split(/\s+/).length,
          fileSize: buffer.length,
        },
      }
    } catch (error) {
      console.error("Text parsing error:", error)
      throw new Error(`Text parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private cleanText(text: string): string {
    if (!text) return ""

    return (
      text
        // Remove excessive whitespace
        .replace(/\s+/g, " ")
        // Remove special characters that might interfere with processing
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        // Normalize line breaks
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        // Remove multiple consecutive line breaks
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    )
  }
}
