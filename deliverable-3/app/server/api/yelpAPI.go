package api

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/csc301-fall-2020/team-project-31-appetite/server/models"

	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

func (data *DB) ScrapeRestaurants(w http.ResponseWriter, r *http.Request) {
	config := getConfig()
	query_url := "https://api.yelp.com/v3/businesses/search"
	bearer := "Bearer " + config.YelpKey

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
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// Process response into map
		var results interface{}

		body, _ := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &results)
		if err != nil {
			log.Print(err)
			w.WriteHeader(http.StatusInternalServerError)
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

			result := data.db.Collection("restaurant").FindOne(data.ctx, bson.M{"yelpid": restaurant.YelpID})
			err = result.Err()
			if err != nil {
				restaurant.Weight = 100
			} else {
				var existingRestaurant models.Restaurant
				result.Decode(&existingRestaurant)
				restaurant.Weight = existingRestaurant.Weight
			}

			result = data.db.Collection("restaurant").FindOneAndReplace(data.ctx, bson.M{"yelpid": restaurant.YelpID}, restaurant, options.FindOneAndReplace().SetUpsert(true))
			err = result.Err()
			if err != nil {
				log.Print(err)
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}

func getYelpDetails(yelpID string) (map[string]interface{}, error) {

	config := getConfig()
	query_url := "https://api.yelp.com/v3/businesses/" + yelpID
	bearer := "Bearer " + config.YelpKey

	req, _ := http.NewRequest("GET", query_url, nil)
	req.Header.Add("Authorization", bearer)

	// Call Yelp API
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Print(err)
		return nil, errors.New("Call to Yelp detials API failed")
	}

	// Process response into map
	var result interface{}

	body, _ := ioutil.ReadAll(resp.Body)
	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Print(err)
		return nil, errors.New("Parsing response from Yelp details API failed")
	}

	return result.(map[string]interface{}), nil
}

func getYelpReviews(yelpID string) ([]interface{}, error) {

	config := getConfig()
	query_url := "https://api.yelp.com/v3/businesses/" + yelpID + "/reviews"
	bearer := "Bearer " + config.YelpKey

	req, _ := http.NewRequest("GET", query_url, nil)
	req.Header.Add("Authorization", bearer)

	// Call Yelp API
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Print(err)
		return nil, errors.New("Call to Yelp reviews API failed")
	}

	// Process response into map
	var result interface{}

	body, _ := ioutil.ReadAll(resp.Body)
	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Print(err)
		return nil, errors.New("Parsing response from Yelp reviews API failed")
	}

	return result.(map[string]interface{})["reviews"].([]interface{}), nil
}
