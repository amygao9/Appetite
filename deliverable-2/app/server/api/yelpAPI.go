package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"backapp/models"

	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

func (c *Collection) ScrapeRestaurants(YelpKey string) {
	query_url := "https://api.yelp.com/v3/businesses/search"
	bearer := "Bearer " + YelpKey

	req, _ := http.NewRequest("GET", query_url, nil)
	req.Header.Add("Authorization", bearer)

	queryParams := url.Values{}
	queryParams.Add("location", "1 King's College Circle, Toronto, Ontario")
	queryParams.Add("category", "restaurants")
	queryParams.Add("radius", "2000")
	queryParams.Add("limit", "50")
	queryParams.Add("offset", "0")

	for i := 0; i < 4; i++ {
		limit := 50         // Number of restaurants to return in every Yelp API call (max is 50)
		offset := limit * i // Page offset for Yelp API call
		queryParams.Set("limit", strconv.Itoa(limit))
		queryParams.Set("offset", strconv.Itoa(offset))

		req.URL.RawQuery = queryParams.Encode()

		// Call Yelp API
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			log.Print(err)
			return
		}

		// Process response into map
		var results interface{}

		body, _ := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &results)
		if err != nil {
			log.Print(err)
			return
		}

		resultsMap := results.(map[string]interface{})
		businesses := resultsMap["businesses"].([]interface{})
		for _, business := range businesses {
			businessMap := business.(map[string]interface{})

			restaurant := models.Restaurant{
				YelpID:     businessMap["id"].(string),
				Name:       businessMap["name"].(string),
				Rating:     businessMap["rating"].(float64),
				NumRatings: int(businessMap["review_count"].(float64)),
				ImageURL:   []string{businessMap["image_url"].(string)},
				Weight:     100,
			}

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

			if val, ok := businessMap["price"]; ok {
				restaurant.Price = strings.Count(val.(string), "$")
			}

			restaurantBefore := c.collection.FindOneAndReplace(c.ctx, bson.M{"yelpid": restaurant.YelpID}, restaurant, options.FindOneAndReplace().SetUpsert(true))
			err = restaurantBefore.Err()
			if err != nil {
				log.Print(err)
			}
		}
	}
}
