package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ndk123-web/fast-todo/internal/service"
)

type GoalHandler interface {
	GetUserGoals(w http.ResponseWriter, r *http.Request)
	CreateUserGoal(w http.ResponseWriter, r *http.Request)
	UpdateUserGoal(w http.ResponseWriter, r *http.Request)
	DeleteUserGoal(w http.ResponseWriter, r *http.Request)
}

type goalHandler struct {
	service service.GoalService
}

func (h *goalHandler) GetUserGoals(w http.ResponseWriter, r *http.Request) {
	userId := r.PathValue("userId")
	workspaceId := r.PathValue("workspaceId")

	if userId == "" || workspaceId == "" {
		json.NewEncoder(w).Encode(map[string]string{"Error": "UserId / Workspace ID is empty in Handler"})
		return
	}

	goals, err := h.service.GetUserGoals(context.Background(), userId, workspaceId)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error()})
		return
	}

	json.NewEncoder(w).Encode(map[string]any{"response": goals})
}

type createGoalReqBody struct {
	WorkspaceId string `json:"workspaceId"`
	GoalName    string `json:"goalName"`
	TargetDays  string `json:"targetDays"`
	Category    string `json:"category"`
}

func (h *goalHandler) CreateUserGoal(w http.ResponseWriter, r *http.Request) {
	var reqBody createGoalReqBody
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error(), "success": "false"})
		return
	}

	userId := r.PathValue("userId")
	workspaceId := r.PathValue("workspaceId")

	// convert string to int
	convertedTargetDays, err := strconv.ParseInt(reqBody.TargetDays, 10, 64)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error(), "success": "false"})
		return
	}

	goal, err := h.service.CreateUserGoal(context.Background(), userId, workspaceId, reqBody.GoalName, convertedTargetDays, reqBody.Category)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error(), "success": "false"})
		return
	}

	json.NewEncoder(w).Encode(map[string]any{"response": goal, "success": "true"})
}

type updateGoalBody struct {
	UpdatedGoalName   string `json:"updatedGoalName"`
	UpdatedTargetDays int    `json:"updatedTargetDays"`
	UpdatedCategory   string `json:"updatedCategory"`
}

func (h *goalHandler) UpdateUserGoal(w http.ResponseWriter, r *http.Request) {
	var reqBody updateGoalBody
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		json.NewEncoder(w).Encode(map[string]any{"Error": err.Error()})
		return
	}

	if reqBody.UpdatedCategory == "" || reqBody.UpdatedGoalName == "" || reqBody.UpdatedTargetDays == 0 {
		json.NewEncoder(w).Encode(map[string]any{"Error": "Category/TargetDays/GoalName is Empty"})
		return
	}

	goalId := r.PathValue("goalId")

	_, err := h.service.UpdateUserGoal(context.Background(), goalId, reqBody.UpdatedGoalName, reqBody.UpdatedTargetDays, reqBody.UpdatedCategory)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]any{"Error": err.Error()})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"response": "Success Update Goal"})
}

func (h *goalHandler) DeleteUserGoal(w http.ResponseWriter, r *http.Request) {
	goalIdTobeDelete := r.PathValue("goalId")

	if goalIdTobeDelete == "" {
		json.NewEncoder(w).Encode(map[string]string{"Error": "Goal Id is Empty In Handler"})
		return
	}

	isDeleted, err := h.service.DeleteUserGoal(context.Background(), goalIdTobeDelete)
	if err != nil || !isDeleted {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error()})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"response": "Success Delete Goal"})
}

func NewGoalHandler(service service.GoalService) GoalHandler {
	return &goalHandler{
		service: service,
	}
}
