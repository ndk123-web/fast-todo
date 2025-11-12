package handler

import (
	"context"
	"encoding/json"
	"github.com/ndk123-web/fast-todo/internal/service"
	"net/http"
)

type GoalHandler interface {
	GetUserGoals(w http.ResponseWriter, r *http.Request)
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

func NewGoalHandler(service service.GoalService) GoalHandler {
	return &goalHandler{
		service: service,
	}
}
