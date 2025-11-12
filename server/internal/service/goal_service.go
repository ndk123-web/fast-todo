package service

import (
	"context"
	"errors"

	"github.com/ndk123-web/fast-todo/internal/model"
	"github.com/ndk123-web/fast-todo/internal/repository"
)

type GoalService interface {
	GetUserGoals(ctx context.Context, userId string, workspaceId string) ([]model.Goals, error)
}

type goalService struct {
	repo repository.GoalRepository
}

func (s *goalService) GetUserGoals(ctx context.Context, userId string, workspaceId string) ([]model.Goals, error) {
	if userId == "" || workspaceId == "" {
		return nil, errors.New("UserId / WorkspaceID is Empty in Service")
	}

	return s.repo.GetUserGoals(ctx, userId, workspaceId)
}

func NewGoalService(repo repository.GoalRepository) GoalService {
	return &goalService{
		repo: repo,
	}
}
