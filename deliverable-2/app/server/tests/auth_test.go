package tests

import (
	auth "backapp/auth"
	"testing"
	"net/http"
	"io/ioutil"
	"os"

	"github.com/joho/godotenv"
)

func TestHashing(t *testing.T) {
	testPasswords := [3]string{"TestPassword1", "KevinBad", "?P@GQ2Jb?kcDWr4m"}

	for index, password := range testPasswords {
		hashed, err := auth.HashPassword(password)
		if err != nil {
			t.Fatal(err)
		}

		// Password matches hash
		checkCorrectPassword := auth.CheckPasswordHash(testPasswords[index], hashed)
		if !checkCorrectPassword {
			t.Errorf("Hash and decryption did not match when expected")
		}

		// Password does not match hash
		checkWrongPassword := auth.CheckPasswordHash("Wrong", hashed)
		if checkWrongPassword {
			t.Errorf("Hash and decryption matched when not expected")
		}
	}
}

func TestTokens(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatal(err)
	}
	port, portExists := os.LookupEnv("PORT")
	if !portExists {
		t.Fatal("Env vars missing")
	}

	client := &http.Client{}

	// Request without token authentication
	noTokenReq, err := http.NewRequest("GET", "http://localhost:" + port +"/restaurant", nil)
	if err != nil {
        t.Fatal(err)
	}
	noTokenResp, err := client.Do(noTokenReq)
	if err != nil {
        t.Fatal(err)
	}
	noTokenRespData, err := ioutil.ReadAll(noTokenResp.Body)
    if err != nil {
        t.Fatal(err)
	}
	const noAuth = "Invalid auth token"
	if string(noTokenRespData) != noAuth {
        t.Errorf("Router returned unexpected body: got %v", string(noTokenRespData))
	}
	
	// Request with token authentication
	token, err := auth.CreateToken("test@test.com")
	if err != nil {
        t.Fatal(err)
	}
	bearer := "Bearer " + token.AccessToken

	tokenReq, err := http.NewRequest("GET", "http://localhost:" + port +"/restaurant", nil)
	if err != nil {
        t.Fatal(err)
	}
	tokenReq.Header.Set("Authorization", bearer)
	tokenResp, err := client.Do(tokenReq)
	if err != nil {
        t.Fatal(err)
	}
	tokenRespData, err := ioutil.ReadAll(tokenResp.Body)
    if err != nil {
        t.Fatal(err)
	}
	if string(tokenRespData) == noAuth {
        t.Errorf("Request was not authenticated")
	}
}
