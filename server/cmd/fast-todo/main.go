package main

import (
	"fmt"
	"log"

	"github.com/ndk123-web/fast-todo/internal/app"
	"github.com/ndk123-web/fast-todo/internal/config"
)

func main() {
	fmt.Println("Fast-Todo App Working...")

	config.InitFirebase()

	if err := app.Run(); err != nil {
		log.Fatal("Error In Running the App")
	}
}
