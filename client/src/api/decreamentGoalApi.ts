import type { AxiosResponse } from "axios";
import { api } from "./globalApi";

interface DecreamentGoalReq {
  goalId: string;
  count: string;
}

const decreamentGoalApi = async (data: DecreamentGoalReq) => {
  try {
    if (!data.goalId) {
      throw new Error("Goal ID is required");
    }

    const response: AxiosResponse = await api.post(
      `/goals/decreament/${data.goalId}`,
      {
        count: data.count,
      }
    );

    console.log("Decreament Goal API Response:", response.data);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error in decreamentGoalApi:", error);
  }
};

export default decreamentGoalApi;
