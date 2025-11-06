package service

import (
	"context"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ndk123-web/fast-todo/internal/model"
	"github.com/ndk123-web/fast-todo/internal/repository"
)

var JWTSECRET = []byte(os.Getenv("JWT_SECRET"))

type UserService interface {
	GetUserTodos(ctx context.Context, userId string) ([]model.Todo, error)
	SignUpUser(ctx context.Context, email string, password string) (*repository.SignUpResponse, error)
}

type userService struct {
	repo repository.UserRepository
}

func (s *userService) GetUserTodos(ctx context.Context, userId string) ([]model.Todo, error) {
	return s.repo.GetUserTodos(ctx, userId)
}

func (s *userService) SignUpUser(ctx context.Context, email string, password string) (*repository.SignUpResponse, error) {
	response, err := s.repo.SignUpUser(ctx, email, password)
	if err != nil {
		return nil, err
	}

	// generate jwt token here
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}

	// give the algorithm and claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// run the algo with cliam and return string , err
	tokenString, err2 := token.SignedString(JWTSECRET)

	if err2 != nil {
		return nil, err
	}

	// inject token with response
	response.Token = tokenString

	return response, nil
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{
		repo: repo,
	}
}
