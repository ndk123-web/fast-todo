package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"github.com/ndk123-web/fast-todo/internal/repository"
	"github.com/ndk123-web/fast-todo/internal/service"
)

type UserHandler interface {
	GetUserTodos(w http.ResponseWriter, r *http.Request)
	SignUpUser(w http.ResponseWriter, r *http.Request)
}

type userHandler struct {
	service service.UserService
}

type getUserTodoStruct struct {
	UserId string `json:"userId"`
}

func (h *userHandler) GetUserTodos(w http.ResponseWriter, r *http.Request) {
	var userStruct getUserTodoStruct

	err := json.NewDecoder(r.Body).Decode(&userStruct)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error()})
	}

	w.Header().Set("Content-Type", "application/json")

	userTodos, err2 := h.service.GetUserTodos(context.Background(), userStruct.UserId)
	if err2 != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err2.Error()})
	}

	json.NewEncoder(w).Encode(userTodos)
}

func (h *userHandler) SignUpUser(w http.ResponseWriter, r *http.Request) {
	var bodyResponse repository.UserStruct
	if err := json.NewDecoder(r.Body).Decode(&bodyResponse); err != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err.Error()})
		return
	}

	if bodyResponse.Email == "" || bodyResponse.Password == "" {
		json.NewEncoder(w).Encode(map[string]string{"Error": "Email/Password Empty"})
		return
	}

	result, err2 := h.service.SignUpUser(context.Background(), bodyResponse.Email, bodyResponse.Password)
	if err2 != nil {
		json.NewEncoder(w).Encode(map[string]string{"Error": err2.Error()})
		return
	}

	// why .(string) because compiler doesn't know that inside UserEmailKey is string so that we are
	// telling the compilet that inside .UserEmailKey is data which is of type string

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"response": result})
}

func NewUserHandler(service service.UserService) UserHandler {
	return &userHandler{
		service: service,
	}
}
