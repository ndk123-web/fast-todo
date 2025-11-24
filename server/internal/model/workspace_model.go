package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Workspace struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UserId        primitive.ObjectID `bson:"userId,omitEmpty" json:"userId,omitempty"`
	WorkspaceName string             `bson:"workspaceName" json:"worskpaceName"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
	Todos         []Todo             `bson:"todos,omitempty" json:"todos"`
	Goals         []Goals            `bson:"goals,omitempty" json:"goals"`
}
