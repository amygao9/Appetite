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
	var hashedPasswords [3]string

	for index, password := range testPasswords {
		hashed, err := auth.HashPassword(password)
		if err != nil {
			t.Fatal(err)
		}
		hashedPasswords[index] = hashed
	}

	t.Run("Test correct passwords", testCorrectPassword(testPasswords, hashedPasswords))
	t.Run("Test wrong passwords", testWrongPassword(testPasswords, hashedPasswords))
}

func testCorrectPassword(testPasswords[3] string, hashedPasswords[3] string) func(*testing.T) {
	return func(t *testing.T) {
		for index, password := range testPasswords {
			checkCorrectPassword := auth.CheckPasswordHash(password, hashedPasswords[index])
			if !checkCorrectPassword {
				t.Errorf("Hash and decryption did not match when expected")
			}
		}
	}
}

func testWrongPassword(testPasswords[3] string, hashedPasswords[3] string) func(*testing.T) {
	return func(t *testing.T) {
		for index, _ := range testPasswords {
			checkWrongPassword := auth.CheckPasswordHash("Wrong", hashedPasswords[index])
			if checkWrongPassword {
				t.Errorf("Hash and decryption matched when not expected")
		}
		}
	}
}

func TestTokens(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatal(err)
	}
	readPort, portExists := os.LookupEnv("PORT")
	if !portExists {
		t.Fatal("Env vars missing")
	}
	port = readPort

	client = &http.Client{}

	t.Run("Test request without token", testAuthNoToken())
	t.Run("Test request with valid token", testAuthWithToken())
}

func testAuthNoToken() func(*testing.T) {
	return func(t *testing.T) {
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
		if string(noTokenRespData) != "Invalid auth token" {
			t.Errorf("Router returned unexpected body: got %v", string(noTokenRespData))
		}
	}
}

func testAuthWithToken() func(*testing.T) {
	return func(t *testing.T) {
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
		if string(tokenRespData) == "Invalid auth token" {
			t.Errorf("Request was not authenticated")
		}
	}
}
