import { api } from "./globalApi";

interface AnalyticsResponse {
  month: string;
  completed: number;
  label: string;
}

const getAnalyticsApi = async (
  userId: string,
  year: string,
  workspaceId?: string
): Promise<AnalyticsResponse[]> => {
  const response: any = await api.post(
    `/analytics/${userId}/year/${year}`,
    { year, workspaceId }
  );

  console.log("Analytics API Request:", { userId, year, workspaceId });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch analytics data");
  }

  console.log("Analytics API Response:", response);

  if (response.data.success === "false") {
    throw new Error(
      response.data.Error || "Error fetching analytics"
    );
  }
  
  return response.data.response || response.data || [];
};

export default getAnalyticsApi;