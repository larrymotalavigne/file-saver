/**
 * @larrym/file-saver - A modern file-saver library with ESM support
 */

export interface SaveOptions {
  /**
   * Automatically revoke the object URL after download
   * @default true
   */
  autoBom?: boolean;
}

/**
 * Checks if the current environment supports the necessary APIs
 */
function isSupported(): boolean {
  try {
    return typeof Blob !== 'undefined' && typeof document !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Adds BOM (Byte Order Mark) to blob if needed
 */
function addBOM(blob: Blob, autoBom: boolean = true): Blob {
  if (!autoBom) {
    return blob;
  }

  // Add UTF-8 BOM for text files
  if (
    blob.type === 'text/plain' ||
    blob.type === 'text/csv' ||
    blob.type === 'application/json'
  ) {
    return new Blob(['\ufeff', blob], { type: blob.type });
  }

  return blob;
}

/**
 * Creates a download link and triggers the download
 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Save a blob/file to the user's computer
 *
 * @param data - Blob, File, or data to save
 * @param fileName - Name of the file to save
 * @param options - Save options
 *
 * @example
 * ```typescript
 * import { saveAs } from '@larrym/file-saver';
 *
 * // Save a blob
 * const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
 * saveAs(blob, 'hello.txt');
 *
 * // Save JSON data
 * const data = { name: 'John', age: 30 };
 * const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
 * saveAs(jsonBlob, 'data.json');
 * ```
 */
export function saveAs(
  data: Blob | string | ArrayBuffer,
  fileName: string,
  options: SaveOptions = {}
): void {
  if (!isSupported()) {
    throw new Error('Browser does not support file downloads');
  }

  let blob: Blob;

  // Convert different data types to Blob
  if (data instanceof Blob) {
    blob = data;
  } else if (typeof data === 'string') {
    blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: 'application/octet-stream' });
  } else {
    throw new Error('Unsupported data type. Expected Blob, string, or ArrayBuffer');
  }

  // Add BOM if needed
  blob = addBOM(blob, options.autoBom ?? true);

  // Trigger download
  downloadBlob(blob, fileName);
}

/**
 * Save text content as a file
 *
 * @param text - Text content to save
 * @param fileName - Name of the file to save
 *
 * @example
 * ```typescript
 * import { saveText } from '@larrym/file-saver';
 *
 * saveText('Hello, World!', 'hello.txt');
 * ```
 */
export function saveText(text: string, fileName: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
}

/**
 * Save JSON data as a file
 *
 * @param data - JSON data to save
 * @param fileName - Name of the file to save
 * @param pretty - Whether to format the JSON with indentation
 *
 * @example
 * ```typescript
 * import { saveJSON } from '@larrym/file-saver';
 *
 * const data = { name: 'John', age: 30 };
 * saveJSON(data, 'data.json', true);
 * ```
 */
export function saveJSON(
  data: unknown,
  fileName: string,
  pretty: boolean = true
): void {
  const jsonString = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  saveAs(blob, fileName);
}

/**
 * Save CSV data as a file
 *
 * @param csvData - CSV string or array of arrays
 * @param fileName - Name of the file to save
 *
 * @example
 * ```typescript
 * import { saveCSV } from '@larrym/file-saver';
 *
 * const data = [
 *   ['Name', 'Age'],
 *   ['John', '30'],
 *   ['Jane', '25']
 * ];
 * saveCSV(data, 'data.csv');
 * ```
 */
export function saveCSV(
  csvData: string | string[][],
  fileName: string
): void {
  let csvString: string;

  if (typeof csvData === 'string') {
    csvString = csvData;
  } else {
    csvString = csvData
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, fileName, { autoBom: true });
}

/**
 * Download a file from a URL
 *
 * @param url - URL of the file to download
 * @param fileName - Name to save the file as
 *
 * @example
 * ```typescript
 * import { downloadURL } from '@larrym/file-saver';
 *
 * downloadURL('https://example.com/file.pdf', 'document.pdf');
 * ```
 */
export async function downloadURL(url: string, fileName: string): Promise<void> {
  if (!isSupported()) {
    throw new Error('Browser does not support file downloads');
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    saveAs(blob, fileName);
  } catch (error) {
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Default export
export default {
  saveAs,
  saveText,
  saveJSON,
  saveCSV,
  downloadURL,
};
