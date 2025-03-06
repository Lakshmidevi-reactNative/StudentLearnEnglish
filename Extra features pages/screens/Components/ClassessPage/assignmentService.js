// api/assignmentService.js
import axios from "axios";

// Update this URL to your actual API endpoint
const BASE_URL = "https://dev.learnengspring";

// Add a timeout and handle CORS if needed
const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const fetchStudentAssignments = async (studentId, schoolId) => {
	try {
		const response = await apiClient.get(
			`/assignment/get-student-manage/${studentId}/${schoolId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching assignments:", error);
		// Return mock data while API is not available
		return getMockAssignmentData();
		// throw error; // Uncomment this and remove the mock data line when API is ready
	}
};

// Add this function to provide mock data while API is unavailable
const getMockAssignmentData = () => {
	return {
		assessments: [
			{
				assignment_id: 12128,
				score: 100.0,
				student_assg_master_id: 1195,
				staff_id: 948,
				assignment_title: "TPR-1",
				created_date: "2025-02-17T18:30:00.000+00:00",
				completed: true,
				type: "Type Practice(TP)",
			},
			{
				assignment_id: 12099,
				score: 57.0,
				student_assg_master_id: 1195,
				staff_id: 948,
				assignment_title: "Assessment on Blog",
				created_date: "2025-01-31T18:30:00.000+00:00",
				completed: true,
				type: "Type Practice(TP)",
			},
			{
				assignment_id: 12100,
				score: 0.0,
				student_assg_master_id: 1194,
				staff_id: 948,
				assignment_title: "Grammar",
				created_date: "2025-02-02T18:30:00.000+00:00",
				completed: true,
				type: "Language Practice(LP)",
			},
		],
		assignments: [
			{
				assignment_id: 12104,
				score: 0.0,
				student_assg_master_id: 1186,
				staff_id: 948,
				assignment_title: "English Assignment language",
				created_date: "2025-02-07T18:30:00.000+00:00",
				completed: false,
				type: "Language Practice(LP)",
			},
			{
				assignment_id: 12126,
				score: 26.0,
				student_assg_master_id: 1192,
				staff_id: 948,
				assignment_title: "tp-11",
				created_date: "2025-02-17T18:30:00.000+00:00",
				completed: true,
				type: "Type Practice(TP)",
			},
			{
				assignment_id: 12125,
				score: 0.0,
				student_assg_master_id: 1192,
				staff_id: 948,
				assignment_title: "Typing Practice -22",
				created_date: "2025-02-17T18:30:00.000+00:00",
				completed: true,
				type: "Type Practice(TP)",
			},
			{
				assignment_id: 12107,
				score: 0.0,
				student_assg_master_id: 1192,
				staff_id: 948,
				assignment_title: "Typing -1",
				created_date: "2025-02-12T18:30:00.000+00:00",
				completed: true,
				type: "Type Practice(TP)",
			},
			{
				assignment_id: 12097,
				score: 0.0,
				student_assg_master_id: 1193,
				staff_id: 948,
				assignment_title: "Sports Conversation",
				created_date: "2025-01-31T18:30:00.000+00:00",
				completed: true,
				type: "Role-Play(RP)",
			},
		],
	};
};

// Transform API data to match the format expected by components
export const transformAssignmentsData = (apiData) => {
	if (!apiData || !apiData.assessments || !apiData.assignments) {
		return {
			assessments: { completed: [] },
			assignments: { pending: [], completed: [] },
		};
	}

	// Process assessments
	const processedAssessments = {
		completed: apiData.assessments
			.filter((item) => item.completed)
			.map((item) => ({
				id: item.assignment_id,
				title: item.assignment_title,
				completedDate: new Date(item.created_date).toLocaleDateString(),
				type: mapAssignmentType(item.type),
				score: item.score,
				feedback: "", // API doesn't provide feedback
			})),
	};

	// Process assignments
	const processedAssignments = {
		pending: apiData.assignments
			.filter((item) => !item.completed)
			.map((item) => ({
				id: item.assignment_id,
				title: item.assignment_title,
				dueDate: new Date(item.created_date).toLocaleDateString(),
				type: mapAssignmentType(item.type),
			})),
		completed: apiData.assignments
			.filter((item) => item.completed)
			.map((item) => ({
				id: item.assignment_id,
				title: item.assignment_title,
				completedDate: new Date(item.created_date).toLocaleDateString(),
				type: mapAssignmentType(item.type),
				score: item.score,
				feedback: "", // API doesn't provide feedback
			})),
	};

	return {
		assessments: processedAssessments,
		assignments: processedAssignments,
	};
};

// Map API assignment types to app types
const mapAssignmentType = (apiType) => {
	const typeMap = {
		"Type Practice(TP)": "Typing",
		"Language Practice(LP)": "Language",
		"Role-Play(RP)": "RolePlay",
		"Writing Practice(WP)": "Writing",
	};

	return typeMap[apiType] || apiType;
};
