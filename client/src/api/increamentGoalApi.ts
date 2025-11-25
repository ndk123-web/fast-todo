import type { AxiosResponse } from "axios";
import { api } from "./globalApi";

interface IncreamentGoalParams {
  goalId: string;
  count: string;
}

const increamentGoalApi = async (goalParam: IncreamentGoalParams) => {
  try {
    if (!goalParam.goalId) {
      throw new Error("Goal ID is required to increament goal progress.");
    }

    console.log("Increamenting Goal ID:", goalParam.goalId, "by count:", goalParam.count);

    const response: AxiosResponse = await api.post(
      `/goals/increament/${goalParam.goalId}`,
      {
        count: goalParam.count,
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Error increamenting goal progress: ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Increament Goal API Error:", error);
  }
};

export default increamentGoalApi;
