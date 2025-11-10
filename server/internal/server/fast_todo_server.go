package server

import (
	"net/http"

	"github.com/ndk123-web/fast-todo/internal/handler"
	"github.com/ndk123-web/fast-todo/internal/middleware"
)

type Server struct {
	todoHandler      handler.TodoHandler
	userHandler      handler.UserHandler
	goalHandler      handler.GoalHandler
	workspaceHandler handler.WorkspaceHandler
}

func NewServer(todoHandler handler.TodoHandler, userHandler handler.UserHandler, goalHandler handler.GoalHandler, workspaceHandler handler.WorkspaceHandler) *Server {
	return &Server{
		todoHandler:      todoHandler,
		userHandler:      userHandler,
		goalHandler:      goalHandler,
		workspaceHandler: workspaceHandler,
	}
}

func (s *Server) Start(port string) error {

	// custom mux (not default mux)
	// in short its custom router
	mux := http.NewServeMux()

	// For Admin Purpose
	mux.Handle("GET /api/v1/todos/all-user-todos", middleware.AuthMiddleware(http.HandlerFunc((s.todoHandler.GetTodos))))

	// we need to add here JWT Middleware
	mux.HandleFunc("POST /api/v1/todos/create-todo", s.todoHandler.CreateTodo)
	mux.HandleFunc("PUT /api/v1/todos/update-todo", s.todoHandler.UpdateTodo)
	mux.HandleFunc("DELETE /api/v1/todos/delete-todo", s.todoHandler.DeleteTodo)

	// middleware for Get User Todos
	mux.Handle("GET /api/v1/todos/get-user-todos", middleware.AuthMiddleware(http.HandlerFunc(s.userHandler.GetUserTodos)))

	// No Need Of Middleware
	mux.HandleFunc("POST /api/v1/users/signup", s.userHandler.SignUpUser)
	mux.HandleFunc("POST /api/v1/users/signin", s.userHandler.SignInUser)

	// for the refresh token routes (Currently No Need)
	mux.HandleFunc("POST /api/v1/user/refresh-token", s.userHandler.RefreshToken)

	// Goals Routes (Need Auth Middleware)
	mux.Handle("GET /api/v1/users/goals/get-user-goals", middleware.AuthMiddleware(http.HandlerFunc(s.goalHandler.GetUserGoals)))

	// workspace Routes (Need Auth Middleware)
	mux.Handle("GET /api/v1/workspaces/get-user-workspaces", middleware.AuthMiddleware(http.HandlerFunc(s.workspaceHandler.GetAllUserWorkspace)))
	mux.Handle("POST /api/v1/workspaces/create-workspace", middleware.AuthMiddleware(http.HandlerFunc(s.workspaceHandler.CreateWorkspace)))

	// it means cors -> log -> actual handler(mux)
	// global logging and cors middleware
	wrappedMux := middleware.LoggingMiddleware(middleware.CorsMiddleware(mux))
	return http.ListenAndServe(port, wrappedMux)
}

/*
mux.m = {
   "/todos": HandlerFunc(getTodos),
   "/users": HandlerFunc(getUsers),
}

Request: /todos
↓
mux.ServeHTTP()
↓
mux.Handler() → returns HandlerFunc(getTodos)
↓
HandlerFunc.ServeHTTP()
↓
calls getTodos(w, r)

*/
