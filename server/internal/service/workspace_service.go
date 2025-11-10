package service

import (
	"context"
	"errors"

	"github.com/ndk123-web/fast-todo/internal/model"
	"github.com/ndk123-web/fast-todo/internal/repository"
)

type WorkspaceService interface {
	GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error)
	CreateWorkspace(ctx context.Context, userId string, workspaceName string) error
	UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error
}

type workspaceService struct {
	repo repository.WorkSpaceRepository
}

func (s *workspaceService) GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error) {
	if userId == "" {
		return nil, errors.New("UserId is Empty in Service")
	}

	return s.repo.GetAllUserWorkspace(ctx, userId)
}

func (s *workspaceService) CreateWorkspace(ctx context.Context, userId string, workspaceName string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("UserEmail or workspaceName is Empty")
	}

	return s.repo.CreateWorkspace(ctx, userId, workspaceName)
}

func (s *workspaceService) UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("UserId / workspace name empty in Service")
	}

	if err := s.repo.UpdatedWorkspace(ctx, userId, workspaceName,updatedWorkspace); err != nil {
		return err
	}

	return nil
}

func NewWorkSpaceService(repo repository.WorkSpaceRepository) WorkspaceService {
	return &workspaceService{
		repo: repo,
	}
}
