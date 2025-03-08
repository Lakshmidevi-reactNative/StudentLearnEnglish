// src/services/api.ts
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

// Replace this with your actual API URL
const PYTHON_BASE_URL = "https://ai.learneng.app";
const FILE_UPLOAD_URL = "https://hp.kgtopg.com/file-upload-server/";
const CONTENT_API_URL = "https://ai.learneng.app/student/content"; // Updated Spring API endpoint

/**
 * Interface for content analysis result
 */
export interface ContentAnalysis {
	text: string;
	title: string;
	level: string;
	url?: string;
	sourceType: "file" | "url" | "text";
}

/**
 * Interface for content post request
 */
export interface ContentPostRequest {
	conTitle: string;
	uploadFileUrl: string;
	contLevel: string;
	conText: string;
	uploadType: string;
	studentId: number;
}

/**
 * Tests connectivity to the Spring API
 */
export const testApiConnectivity = async (): Promise<boolean> => {
	try {
		console.log("Testing API connectivity to:", CONTENT_API_URL);
		
		// Attempt a simple HEAD request to check if the API is reachable
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
		
		const response = await fetch(CONTENT_API_URL, {
			method: "HEAD",
			signal: controller.signal,
		});
		
		clearTimeout(timeoutId);
		
		console.log("API test response status:", response.status);
		return response.status < 500; // Consider any non-server error as "reachable"
	} catch (error) {
		console.error("API connectivity test failed:", error);
		return false;
	}
};

/**
 * Detects the language level of the provided text
 */
export const detectLevel = async (text: string): Promise<string> => {
	try {
		const response = await fetch(`${PYTHON_BASE_URL}/LearnEng/level_detect`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error("Failed to detect text level");
		}

		const data = await response.json();
		return data.determined_level;
	} catch (error) {
		console.error("Error detecting text level:", error);
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
		const fileName = fileUri.split("/").pop() || "file";

		// Determine mime type based on extension
		const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
		let mimeType = "application/octet-stream";

		if (fileExtension === "pdf") mimeType = "application/pdf";
		else if (["doc", "docx"].includes(fileExtension))
			mimeType = "application/msword";
		else if (["jpg", "jpeg"].includes(fileExtension)) mimeType = "image/jpeg";
		else if (fileExtension === "png") mimeType = "image/png";
		else if (fileExtension === "txt") mimeType = "text/plain";

		// Append file to form data
		formData.append("file", {
			uri: Platform.OS === "ios" ? fileUri.replace("file://", "") : fileUri,
			name: fileName,
			type: mimeType,
		} as any);

		// Upload file
		const uploadResponse = await fetch(FILE_UPLOAD_URL, {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (!uploadResponse.ok) {
			throw new Error("File upload failed");
		}

		const uploadData = await uploadResponse.json();
		return uploadData.url;
	} catch (error) {
		console.error("Error uploading file:", error);
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
		const fileName = fileUri.split("/").pop() || "file";

		// Determine mime type based on extension
		const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
		let mimeType = "application/octet-stream";

		if (fileExtension === "pdf") mimeType = "application/pdf";
		else if (["doc", "docx"].includes(fileExtension))
			mimeType = "application/msword";
		else if (["jpg", "jpeg"].includes(fileExtension)) mimeType = "image/jpeg";
		else if (fileExtension === "png") mimeType = "image/png";
		else if (fileExtension === "txt") mimeType = "text/plain";

		// Append file to form data
		formData.append("file", {
			uri: Platform.OS === "ios" ? fileUri.replace("file://", "") : fileUri,
			name: fileName,
			type: mimeType,
		} as any);

		// Extract text from file
		const extractResponse = await fetch(
			`${PYTHON_BASE_URL}/LearnEng/extract_text_file`,
			{
				method: "POST",
				body: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		if (!extractResponse.ok) {
			throw new Error("Failed to extract text from file");
		}

		const extractedData = await extractResponse.json();
		return extractedData.text;
	} catch (error) {
		console.error("Error extracting text from file:", error);
		throw error;
	}
};

/**
 * Extracts text from a URL
 */
export const extractTextFromUrl = async (url: string): Promise<string> => {
	try {
		const response = await fetch(
			`${PYTHON_BASE_URL}/LearnEng/extract_text_url`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to extract text from URL");
		}

		const data = await response.json();
		return data.text;
	} catch (error) {
		console.error("Error extracting text from URL:", error);
		throw error;
	}
};

/**
 * Posts content to the Spring API
 */
export const postContentToApi = async (contentData: ContentPostRequest): Promise<any> => {
	try {
		// Log the request details for debugging
		console.log("Posting to API URL:", CONTENT_API_URL);
		console.log("Content data being posted:", JSON.stringify(contentData, null, 2));
		
		// Add a timeout to the fetch for better error reporting
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
		
		const response = await fetch(CONTENT_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			body: JSON.stringify(contentData),
			signal: controller.signal,
		});
		
		clearTimeout(timeoutId);

		// Log the response status and headers
		console.log("API Response Status:", response.status);
		console.log("API Response Status Text:", response.statusText);
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error("API Error Response:", errorText);
			throw new Error(`Failed to post content: ${errorText}`);
		}

		const responseData = await response.json();
		console.log("API Response Data:", responseData);
		return responseData;
	} catch (error) {
		if (error.name === 'AbortError') {
			console.error("API request timed out");
			throw new Error("API request timed out. Please check your internet connection and the API server.");
		}
		console.error("Error posting content to API:", error);
		throw error;
	}
};

/**
 * Processes a file upload with all required API calls
 */
export const processFileUpload = async (
	fileUri: string,
	title: string,
	studentId: number
): Promise<ContentAnalysis> => {
	try {
		console.log("Processing file upload...");
		console.log("File URI:", fileUri);
		console.log("Title:", title);
		console.log("Student ID:", studentId);
		
		// Step 1: Upload file to get URL
		console.log("Uploading file to get URL...");
		const fileUrl = await uploadFile(fileUri);
		console.log("File URL:", fileUrl);

		// Step 2: Extract text from file
		console.log("Extracting text from file...");
		const extractedText = await extractTextFromFile(fileUri);
		console.log("Extracted text length:", extractedText.length);

		// Step 3: Detect language level
		console.log("Detecting language level...");
		const level = await detectLevel(extractedText);
		console.log("Detected level:", level);

		// Prepare data for API
		const contentData = {
			conTitle: title,
			uploadFileUrl: fileUrl,
			contLevel: level,
			conText: extractedText,
			uploadType: "1", // Changed to "1" for document type
			studentId: studentId,
		};
		
		console.log("Posting content to Spring API...");
		// Step 4: Post content to Spring API
		const apiResponse = await postContentToApi(contentData);
		console.log("Spring API response:", apiResponse);

		return {
			text: extractedText,
			title: title,
			level: level,
			url: fileUrl,
			sourceType: "file",
		};
	} catch (error) {
		console.error("Error processing file upload:", error);
		throw error;
	}
};

/**
 * Processes a URL upload with all required API calls
 */
export const processUrlUpload = async (
	url: string,
	title: string,
	studentId: number
): Promise<ContentAnalysis> => {
	try {
		console.log("Processing URL upload...");
		console.log("URL:", url);
		console.log("Title:", title);
		console.log("Student ID:", studentId);
		
		// Step 1: Extract text from URL
		console.log("Extracting text from URL...");
		const extractedText = await extractTextFromUrl(url);
		console.log("Extracted text length:", extractedText.length);

		// Step 2: Detect language level
		console.log("Detecting language level...");
		const level = await detectLevel(extractedText);
		console.log("Detected level:", level);

		// Prepare data for API
		const contentData = {
			conTitle: title,
			uploadFileUrl: url,
			contLevel: level,
			conText: extractedText,
			uploadType: "2", // URL/Link type
			studentId: studentId,
		};
		
		console.log("Posting content to Spring API...");
		// Step 3: Post content to Spring API
		const apiResponse = await postContentToApi(contentData);
		console.log("Spring API response:", apiResponse);

		return {
			text: extractedText,
			title: title,
			level: level,
			url: url,
			sourceType: "url",
		};
	} catch (error) {
		console.error("Error processing URL upload:", error);
		throw error;
	}
};

/**
 * Processes text content with all required API calls
 */
export const processTextContent = async (
	text: string,
	title: string,
	studentId: number
): Promise<ContentAnalysis> => {
	try {
		console.log("Processing text content...");
		console.log("Title:", title);
		console.log("Student ID:", studentId);
		console.log("Text length:", text.length);
		
		// Detect language level
		console.log("Detecting language level...");
		const level = await detectLevel(text);
		console.log("Detected level:", level);

		// Prepare data for API
		const contentData = {
			conTitle: title,
			uploadFileUrl: "manual-entry",
			contLevel: level,
			conText: text,
			uploadType: "3", // Text type
			studentId: studentId,
		};
		
		console.log("Posting content to Spring API...");
		// Post content to Spring API
		const apiResponse = await postContentToApi(contentData);
		console.log("Spring API response:", apiResponse);

		return {
			text: text,
			title: title,
			level: level,
			sourceType: "text",
		};
	} catch (error) {
		console.error("Error processing text content:", error);
		throw error;
	}
};