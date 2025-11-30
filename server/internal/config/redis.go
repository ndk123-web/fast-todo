package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

func InitRedis() {
	ctx := context.Background()

	// Debug: Print environment variables
	redisHost := os.Getenv("REDIS_HOST")
	redisUsername := os.Getenv("REDIS_USERNAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")

	log.Printf("Redis Config - Host: %s, Username: %s", redisHost, redisUsername)

	if redisHost == "" {
		log.Fatal("REDIS_HOST environment variable is not set")
	}
	if redisPassword == "" {
		log.Fatal("REDIS_PASSWORD environment variable is not set")
	}

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Username: redisUsername,
		Password: redisPassword,
		DB:       0,
	})

	// Test the connection
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Printf("Failed to connect to Redis: %v", err)
		panic(fmt.Sprintf("Redis connection failed: %v", err))
	}

	// Test set/get operation
	err = rdb.Set(ctx, "foo", "bar", 0).Err()
	if err != nil {
		log.Printf("Failed to set test key in Redis: %v", err)
		panic(err)
	}

	result, err := rdb.Get(ctx, "foo").Result()
	if err != nil {
		log.Printf("Failed to get test key from Redis: %v", err)
		panic(err)
	}

	log.Printf("Redis Initiated successfully!! Test result: %s", result)
}
