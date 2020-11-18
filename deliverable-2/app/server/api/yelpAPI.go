package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

func ScrapeRestaurants() {
	query_url := "https://api.yelp.com/v3/businesses/search"
	bearer := "Bearer LR3os-3Cj_WRIBY5GrpHvKNBuy3Me4iw9tHpGmw9BVqWeKvKVDOwIMRvKBo_tgMLhIn9QvD83vjtxkunJaGEmkPf2CsL_bxpszp-ER0SCjbGcw9jWYJPaKX5VcesX3Yx"

	req, _ := http.NewRequest("GET", query_url, nil)
	req.Header.Add("Authorization", bearer)

	q := url.Values{}
	q.Add("location", "1 King's College Circle, Toronto, Ontario")
	q.Add("category", "restaurants")
	q.Add("radius", "2000")
	q.Add("limit", "2")
	q.Add("offset", "0")

	req.URL.RawQuery = q.Encode()

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}

	var f interface{}

	body, _ := ioutil.ReadAll(resp.Body)
	err = json.Unmarshal(body, &f)
	if err != nil {
		fmt.Println("Error in decoding JSON")
		return
	}
	fmt.Println(f)
}
