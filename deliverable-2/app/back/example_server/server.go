package main

import (
	"fmt"
	"html"
	"net/http"
	"strconv"
	"strings"
	"time"

	"backapp/example_server/roman"
)

// http://localhost:5000/roman_numeral/{number}
func index(w http.ResponseWriter, r *http.Request) {
	urlPathElements := strings.Split(r.URL.Path, "/")
	if urlPathElements[1] == "roman_numeral" {
		number, err := strconv.Atoi(strings.TrimSpace(urlPathElements[2]))
		if err != nil {
			panic(err)
		}
		if number < 0 || number > 10 {
			http.Error(w, "404 - Not Found", http.StatusNotFound)
		} else {
			val := html.EscapeString(roman.Numerals[number])
			fmt.Fprintf(w, "%q", val)
		}
	} else {
		http.Error(w, "404 - Bad Request", http.StatusBadRequest)
	}
}

func main() {
	http.HandleFunc("/", index)
	s := http.Server{
		Addr:           ":5000",
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
