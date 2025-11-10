package middleware

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"strings"
)

var JwtSecret = []byte(os.Getenv("JWT_SECRET"))

// we created the custom string type to inject the userEmail in context , to forward handlers
// why ? becuase if any package also doing with same name and type string then it will overwrite
// so instead what we do is just create the new type of contextKey
type contextKey string

const UserEmailKey contextKey = "userEmail"
const UserId contextKey = "userId"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// get the Authorization
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// filter the token string
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		tokenString = strings.TrimSpace(tokenString)

		// parse and verify jwt
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			// (*jwt.SigningMethodHMAC) it means Method is interface and jwt.SigningMethodHMAC implementing the interface Method
			// thats why we wrote like .(*jwt.SigningMethodHMAC)
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}

			// return the JwtSecret to the jwt.Parse
			return JwtSecret, nil
		})

		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// now just validate the token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		userEmail, ok := claims["email"].(string)
		if !ok {
			http.Error(w, "Invalid token payload", http.StatusUnauthorized)
			return
		}

		//  Inject email into context
		ctx := context.WithValue(r.Context(), UserEmailKey, userEmail)
		//  Call next handler with updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
