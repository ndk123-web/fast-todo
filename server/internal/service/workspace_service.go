package service

import (
	"context"
	"errors"

	"github.com/ndk123-web/fast-todo/internal/model"
	"github.com/ndk123-web/fast-todo/internal/repository"
)

// WorkspaceService interface
type WorkspaceService interface {
	GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error)
	CreateWorkspace(ctx context.Context, userId string, workspaceName string) (string, error)
	UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error
	DeleteWorkspace(ctx context.Context, userId string, workspaceName string) error
	UpdateWorkspaceLayout(ctx context.Context, workspaceId string, nodes, edges []map[string]interface{}) (bool, error)
}

// workspaceService struct
type workspaceService struct {
	repo repository.WorkSpaceRepository
}

func (s *workspaceService) GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error) {
	if userId == "" {
		return nil, errors.New("UserId is Empty in Service")
	}

	// call the repo method
	return s.repo.GetAllUserWorkspace(ctx, userId)
}

func (s *workspaceService) CreateWorkspace(ctx context.Context, userId string, workspaceName string) (string, error) {
	if userId == "" || workspaceName == "" {
		return "", errors.New("UserEmail or workspaceName is Empty")
	}

	// call the repo create method
	return s.repo.CreateWorkspace(ctx, userId, workspaceName)
}

func (s *workspaceService) UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("UserId / workspace name empty in Service")
	}

	// call the repo update method
	if err := s.repo.UpdatedWorkspace(ctx, userId, workspaceName, updatedWorkspace); err != nil {
		return err
	}

	return nil
}

func (s *workspaceService) DeleteWorkspace(ctx context.Context, userId string, workspaceName string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("UserId / workspace name empty in Service")
	}

	// call the repo delete method
	if err := s.repo.DeleteWorkspace(ctx, userId, workspaceName); err != nil {
		return err
	}

	return nil
}

func (s *workspaceService) UpdateWorkspaceLayout(ctx context.Context, workspaceId string, nodes, edges []map[string]interface{}) (bool, error) {
	if workspaceId == "" {
		return false, errors.New("workspaceId is empty in Service")
	}

	// call the repo update layout method
	return s.repo.UpdateWorkspaceLayout(ctx, workspaceId, nodes, edges)
}

func NewWorkSpaceService(repo repository.WorkSpaceRepository) WorkspaceService {
	return &workspaceService{
		repo: repo,
	}
}
