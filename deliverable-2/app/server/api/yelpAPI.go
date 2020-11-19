package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"backapp/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (c *Collection) ScrapeRestaurants() {
	query_url := "https://api.yelp.com/v3/businesses/search"
	bearer := "Bearer LR3os-3Cj_WRIBY5GrpHvKNBuy3Me4iw9tHpGmw9BVqWeKvKVDOwIMRvKBo_tgMLhIn9QvD83vjtxkunJaGEmkPf2CsL_bxpszp-ER0SCjbGcw9jWYJPaKX5VcesX3Yx"

	req, _ := http.NewRequest("GET", query_url, nil)
	req.Header.Add("Authorization", bearer)

	q := url.Values{}
	q.Add("location", "1 King's College Circle, Toronto, Ontario")
	q.Add("category", "restaurants")
	q.Add("radius", "2000")
	q.Add("limit", "50")
	q.Add("offset", "0")

	for i := 0; i < 4; i++ {
		limit := 50
		offset := limit * i
		q.Set("limit", strconv.Itoa(limit))
		q.Set("offset", strconv.Itoa(offset))

		req.URL.RawQuery = q.Encode()

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}

		var results interface{}

		body, _ := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &results)
		if err != nil {
			fmt.Println("Error in decoding JSON")
			return
		}

		resultsMap := results.(map[string]interface{})
		businesses := resultsMap["businesses"].([]interface{})
		for _, business := range businesses {
			businessMap := business.(map[string]interface{})

			var restaurant models.Restaurant
			restaurant.ID = primitive.NewObjectID()
			restaurant.YelpID = businessMap["id"].(string)
			restaurant.Name = businessMap["name"].(string)
			restaurant.Rating = businessMap["rating"].(float64)
			restaurant.NumRatings = int(businessMap["review_count"].(float64))

			restaurant.ImageURL = []string{businessMap["image_url"].(string)}

			coordinates := businessMap["coordinates"].(map[string]interface{})
			restaurant.Lat = coordinates["latitude"].(float64)
			restaurant.Lng = coordinates["longitude"].(float64)

			addressMap := businessMap["location"].(map[string]interface{})
			restaurant.Address = addressMap["address1"].(string)

			restaurant.Categories = []string{}
			for _, category := range businessMap["categories"].([]interface{}) {
				categoryMap := category.(map[string]interface{})
				restaurant.Categories = append(restaurant.Categories, categoryMap["alias"].(string))
			}

			restaurant.Weight = 100

			_, err = c.collection.InsertOne(c.ctx, restaurant)
			if err != nil {
				fmt.Println(err)
			}
		}
	}
}
