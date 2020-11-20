package tests

import (
	auth "backapp/auth"
	"testing"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"os"
	"bytes"

	"github.com/joho/godotenv"
)

func TestUsers(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatal(err)
	}
	port, portExists := os.LookupEnv("PORT")
	if !portExists {
		t.Fatal("Env vars missing")
	}

	client := &http.Client{}

	// Test authentication fail
	authDataInvalid, err := json.Marshal(map[string]interface{}{
		"Email": "user@test.com",
		"Password": "NotThePassword",
	})
	if err != nil {
        t.Fatal(err)
	}

	authReqFail, err := http.NewRequest("POST", "http://localhost:" + port +"/user/auth", bytes.NewBuffer(authDataInvalid))
	if err != nil {
        t.Fatal(err)
	}
	authReqFail.Header.Set("Content-Type", "application/json")

	authRespFail, err := client.Do(authReqFail)
	if err != nil {
        t.Fatal(err)
	}
	defer authRespFail.Body.Close()

	bodyBytes, err := ioutil.ReadAll(authRespFail.Body)
	if err != nil {
        t.Fatal(err)
	}
	bodyString := string(bodyBytes)
	if bodyString != "Invalid password" {
		t.Errorf("Auth did not fail despite invalid password")
	}

	// Test authentication pass
	authDataValid, err := json.Marshal(map[string]interface{}{
		"Email": "user@test.com",
		"Password": "TestPassword1",
	})
	if err != nil {
        t.Fatal(err)
	}

	authReqPass, err := http.NewRequest("POST", "http://localhost:" + port +"/user/auth", bytes.NewBuffer(authDataValid))
	if err != nil {
        t.Fatal(err)
	}
	authReqPass.Header.Set("Content-Type", "application/json")

	authRespPass, err := client.Do(authReqPass)
	if err != nil {
        t.Fatal(err)
	}
	authRespData, err := ioutil.ReadAll(authRespPass.Body)
    if err != nil {
        t.Fatal(err)
	}
	var tokenRet auth.Tokens
	err = json.Unmarshal(authRespData, &tokenRet)
	if err != nil {
		t.Fatal(err)
	}

	bearer := "Bearer " + tokenRet.AccessToken
	const noAuth = "Invalid auth token"

	checkAuthReq, err := http.NewRequest("GET", "http://localhost:" + port +"/restaurant", nil)
	if err != nil {
        t.Fatal(err)
	}
	checkAuthReq.Header.Set("Authorization", bearer)
	checkAuthResp, err := client.Do(checkAuthReq)
	if err != nil {
        t.Fatal(err)
	}
	checkAuthRespData, err := ioutil.ReadAll(checkAuthResp.Body)
    if err != nil {
        t.Fatal(err)
	}
	if string(checkAuthRespData) == noAuth {
        t.Errorf("Request was not authenticated")
	}
}
