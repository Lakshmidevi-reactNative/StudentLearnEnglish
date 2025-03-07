// src/services/api.ts
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Replace this with your actual API URL
const PYTHON_BASE_URL = 'https://your-api-url.com';
const FILE_UPLOAD_URL = 'https://hp.kgtopg.com/file-upload-server/';

/**
 * Interface for content analysis result
 */
export interface ContentAnalysis {
  text: string;
  title: string;
  level: string;
  url?: string;
  sourceType: 'file' | 'url' | 'text';
}

/**
 * Detects the language level of the provided text
 */
export const detectLevel = async (text: string): Promise<string> => {
  try {
    const response = await fetch(`${PYTHON_BASE_URL}/LearnEng/level_detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to detect text level');
    }

    const data = await response.json();
    return data.determined_level;
  } catch (error) {
    console.error('Error detecting text level:', error);
    throw error;
  }
};

/**
 * Uploads a file to the server and returns the URL
 */
export const uploadFile = async (fileUri: string): Promise<string> => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Get file name and type
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileName = fileUri.split('/').pop() || 'file';
    
    // Determine mime type based on extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    let mimeType = 'application/octet-stream';
    
    if (fileExtension === 'pdf') mimeType = 'application/pdf';
    else if (['doc', 'docx'].includes(fileExtension)) mimeType = 'application/msword';
    else if (['jpg', 'jpeg'].includes(fileExtension)) mimeType = 'image/jpeg';
    else if (fileExtension === 'png') mimeType = 'image/png';
    else if (fileExtension === 'txt') mimeType = 'text/plain';
    
    // Append file to form data
    formData.append('file', {
      uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
      name: fileName,
      type: mimeType,
    } as any);

    // Upload file
    const uploadResponse = await fetch(FILE_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('File upload failed');
    }

    const uploadData = await uploadResponse.json();
    return uploadData.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Extracts text content from a file
 */
export const extractTextFromFile = async (fileUri: string): Promise<string> => {
  try {
    // Create form data
    const formData = new FormData();
    
    // Get file name
    const fileName = fileUri.split('/').pop() || 'file';
    
    // Determine mime type based on extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    let mimeType = 'application/octet-stream';
    
    if (fileExtension === 'pdf') mimeType = 'application/pdf';
    else if (['doc', 'docx'].includes(fileExtension)) mimeType = 'application/msword';
    else if (['jpg', 'jpeg'].includes(fileExtension)) mimeType = 'image/jpeg';
    else if (fileExtension === 'png') mimeType = 'image/png';
    else if (fileExtension === 'txt') mimeType = 'text/plain';
    
    // Append file to form data
    formData.append('file', {
      uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
      name: fileName,
      type: mimeType,
    } as any);

    // Extract text from file
    const extractResponse = await fetch(`${PYTHON_BASE_URL}/LearnEng/extract_text_file`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!extractResponse.ok) {
      throw new Error('Failed to extract text from file');
    }

    const extractedData = await extractResponse.json();
    return extractedData.text;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
};

/**
 * Extracts text from a URL
 */
export const extractTextFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(`${PYTHON_BASE_URL}/LearnEng/extract_text_url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract text from URL');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from URL:', error);
    throw error;
  }
};

/**
 * Processes a file upload with all required API calls
 */
export const processFileUpload = async (
  fileUri: string,
  title: string
): Promise<ContentAnalysis> => {
  try {
    // Step 1: Upload file to get URL
    const fileUrl = await uploadFile(fileUri);
    
    // Step 2: Extract text from file
    const extractedText = await extractTextFromFile(fileUri);
    
    // Step 3: Detect language level
    const level = await detectLevel(extractedText);
    
    return {
      text: extractedText,
      title: title,
      level: level,
      url: fileUrl,
      sourceType: 'file',
    };
  } catch (error) {
    console.error('Error processing file upload:', error);
    throw error;
  }
};

/**
 * Processes a URL upload with all required API calls
 */
export const processUrlUpload = async (
  url: string,
  title: string
): Promise<ContentAnalysis> => {
  try {
    // Step 1: Extract text from URL
    const extractedText = await extractTextFromUrl(url);
    
    // Step 2: Detect language level
    const level = await detectLevel(extractedText);
    
    return {
      text: extractedText,
      title: title,
      level: level,
      url: url,
      sourceType: 'url',
    };
  } catch (error) {
    console.error('Error processing URL upload:', error);
    throw error;
  }
};

/**
 * Processes text content with all required API calls
 */
export const processTextContent = async (
  text: string,
  title: string
): Promise<ContentAnalysis> => {
  try {
    // Detect language level
    const level = await detectLevel(text);
    
    return {
      text: text,
      title: title,
      level: level,
      sourceType: 'text',
    };
  } catch (error) {
    console.error('Error processing text content:', error);
    throw error;
  }
};