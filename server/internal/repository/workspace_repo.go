package repository

import (
	"context"
	"errors"

	"fmt"
	"github.com/ndk123-web/fast-todo/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type WorkSpaceRepository interface {
	GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error)
	CreateWorkspace(ctx context.Context, userId string, workspaceName string) error
	UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error
}

type workspaceRepository struct {
	workspaceCollection *mongo.Collection
}

func (r *workspaceRepository) GetAllUserWorkspace(ctx context.Context, userId string) ([]model.Workspace, error) {
	if userId == "" {
		return nil, errors.New("UserId in Repo is Empty")
	}
	// convert userId -> oid
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return nil, err
	}

	// filter for finding only workspaces of user
	filter := bson.M{"userId": oid}

	// get the workspaces here
	cursor, err := r.workspaceCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	// fetch workspaces
	var workspaces []model.Workspace
	for cursor.Next(ctx) {
		var workspace model.Workspace
		cursor.Decode(&workspace)
		workspaces = append(workspaces, workspace)
	}

	// finally return the workspaces
	return workspaces, nil
}

type createWorkspaceInDb struct {
	UserId        primitive.ObjectID `json:"userId" bson:"userId"`
	WorkspaceName string             `json:"workspaceName" bson:"workspaceName"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}

func (r *workspaceRepository) CreateWorkspace(ctx context.Context, userId string, workspaceName string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("User Email / workspaceName is Empty in Repo")
	}

	// convert first string to objectId
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return err
	}

	// check if workspace already exists for user
	filter := bson.M{"userId": oid, "workspaceName": workspaceName}
	res := r.workspaceCollection.FindOne(ctx, filter)

	// check for error
	err = res.Err()

	// if no error, workspace exists
	if err == nil {
		//  Document found → duplicate
		return errors.New("workspace already exists for this user")
	} else if !errors.Is(err, mongo.ErrNoDocuments) {
		// Some DB issue
		return err
	}

	// structure for stroring inside db
	insertDoc := createWorkspaceInDb{
		UserId:        oid,
		WorkspaceName: workspaceName,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// insert inside db
	insertResult, err := r.workspaceCollection.InsertOne(ctx, insertDoc)
	if err != nil {
		return err
	}

	// InsertId is interface {} and .(primitive.ObjectId) it means inside that there is value in form of ObjectId and using .Hex() we conver Object id into Readable Hex String
	fmt.Println("Insert Result: ", insertResult.InsertedID.(primitive.ObjectID).Hex())
	return nil
}

func (r *workspaceRepository) UpdatedWorkspace(ctx context.Context, userId string, workspaceName string, updatedWorkspace string) error {
	if userId == "" || workspaceName == "" {
		return errors.New("UserId / Workspace name Empty")
	}

	// convert userId to oid
	oid, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return err
	}

	// update the workspace name
	filter := bson.M{"userId": oid, "workspaceName": workspaceName}
	update := bson.M{"$set": bson.M{
		"workspaceName": updatedWorkspace,
		"updatedAt":     time.Now(),
	}}

	// perform the update
	res, err := r.workspaceCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	// check if any document was modified or not
	// if no document matched the filter, it means workspace doesn't exist
	if res.MatchedCount == 0 {
		return errors.New("No workspace found for given userId and workspaceName")
	}

	// debug
	fmt.Println("Updated Workspace Count:", res.ModifiedCount)

	// success
	return nil
}

func NewWorkspaceRepository(workspaceCollection *mongo.Collection) WorkSpaceRepository {
	return &workspaceRepository{
		workspaceCollection: workspaceCollection,
	}
}
