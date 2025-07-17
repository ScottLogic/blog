---
title: Creating Simple Web Services in Go
date: 2017-04-19 00:00:00 Z
categories:
- Tech
author: wferguson
layout: default_post
summary: Following on from making a simple particle simulation in Go, I decided to
  try and implement a simple set of web services too.
---

A few months ago I [blogged](http://blog.scottlogic.com/2016/11/01/go-particle-simulation.html) about creating a particle simulation in Go as a method of trying to learn the language. In order to expand on that, I tried to implement a more standard application - a simple set of web services supporting creation, listing, and deletion of messages.

## Initial Set Up

In order to get started, the data structures needed to be created: a message, and a list of messages. Their implementation was trivial:

{% highlight go %}
package structs

type Message struct {
	ID      int    `json:"id,omitempty"`
	Sender  string `json:"sender"`
	Message string `json:"message"`
}

type MessageList []Message
{% endhighlight %}

There's a couple of items here that weren't in my previous post, the `json` tags in the struct, and also the use of packages.

The use of multiple packages helps keep related items grouped together, and separate concerns. In this simple example I've grouped by `structs`. However it could be groups of similar structs, constants, functions, interfaces in any combination. For instance, a HTTP abstraction and its interfaces, structs and implementation can be implemented in an `abstraction` package.

In terms of the `json` tag, it simply informs Go's JSON package to map between the struct values and the JSON values. For instance, JSON object `{"id": 1, "sender": "Test", "message": "Test Message"}` would map to the `ID`, `Sender`, and `Message` fields respectively in the `Message` struct.

## Creating a Store

Now that the data structure has been defined, so can the implementation of storing messages, and the functions that would interact with the store.

{% highlight go %}
package storage

import (
	"github.com/wpferg/services/structs"
)

var store structs.MessageList
var currentMaxId = 1

func Get() structs.MessageList {
	return store
}

func Add(message structs.Message) int {
	message.ID = currentMaxId
	currentMaxId++
	store = append(store, message)
	return message.ID
}

func Remove(id int) bool {
	index := -1

	for i, message := range store {
		if message.ID == id {
			index = i
		}
	}

	if index != -1 {
		store = append(store[:index], store[index+1:]...)
	}

	// Returns true if item was found & removed
	return index != -1
}
{% endhighlight %}

The functions that were most interesting to implement from a newcomer's perspective were `Add` and `Remove`. `Add` takes a message, and sets an ID (which is an incremented value whenever `Add` is called, for a unique key), then appends it to the store. `Remove` was a tad more complicated - given an ID, it finds the message with that ID and removes it from the slice. The removal was done in an interesting way: it takes the slice of everything before that item (`store[:index]`), then appends everything after that item `store[index+1:]...` in a spread-like operation, adding each argument to a [variadic function](https://gobyexample.com/variadic-functions).

## Creating the Services

### Routing

The service routing was incredibly simplistic. The logic of the routing was choosing the handler based on the request method -- `GET` requests should return a list, whereas `POST` would create a new message and `DELETE` would remove a message.

{% highlight go %}
func HandleRequest(w http.ResponseWriter, r *http.Request) {
	log.Println("Incoming Request:", r.Method)
	switch r.Method {
	case http.MethodGet:
		List(w, r)
		break
	case http.MethodPost:
		Add(w, r)
		break
	case http.MethodDelete:
		Remove(w, r)
		break
	default:
		httpUtils.HandleError(&w, 405, "Method not allowed", "Method not allowed", nil)
		break
	}
}
{% endhighlight %}

All that was left was to start the server in the `main` function, and define what route it should listen to.

{% highlight go %}
const PORT = 8080

func createMessage(message string, sender string) structs.Message {
	return structs.Message{
		Sender:  sender,
		Message: message,
	}
}

func main() {
	log.Println("Creating dummy messages")

	storage.Add(createMessage("Testing", "1234"))
	storage.Add(createMessage("Testing Again", "5678"))
	storage.Add(createMessage("Testing A Third Time", "9012"))

	log.Println("Attempting to start HTTP Server.")

	http.HandleFunc("/", httpHandlers.HandleRequest)

	var err = http.ListenAndServe(":"+strconv.Itoa(PORT), nil)

	if err != nil {
		log.Panicln("Server failed starting. Error: %s", err)
	}
}
{% endhighlight %}

This listens on port `8080` for any request - the `/` path is a catch-all handler.


### List

Now that the store is implemented, the services could be created. Starting with listing the current messages:

{% highlight go %}
func List(w http.ResponseWriter, r *http.Request) {
	var data, err = json.Marshal(storage.Get())

	if err != nil {
		// Handle errors here
		return
	}

	log.Println("Successfully returned data")
	w.Header().Add("Content-Type", "application/json")
	w.Write(data)
}
{% endhighlight %}

The bulk of the work was done by marshalling the storage into a JSON format. Then, all that needed to be done was add the required headers and send the JSON. It also became apparent later on that this marshalling would be done many times, so I thought it best to write a utility to manage that:

{% highlight go %}
package httpUtils

import (
	"encoding/json"
	"net/http"
)

func HandleSuccess(w *http.ResponseWriter, result interface{}) {
	writer := *w

	marshalled, err := json.Marshal(result)

	if err != nil {
		HandleError(w, 500, "Internal Server Error", "Error marshalling response JSON", err)
		return
	}

	writer.Header().Add("Content-Type", "application/json")
	writer.WriteHeader(200)
	writer.Write(marshalled)
}
{% endhighlight %}

The utility does the same as the above -- takes an input, generates JSON, and writes the response. However, it comes with the bonus of having any response handling done in the one place - leading to consistency, and code reuse. It also led to simplifying the request handlers -- the function for retrieving the list became much shorter and simpler:

{% highlight go %}
func List(w http.ResponseWriter, r *http.Request) {
	httpUtils.HandleSuccess(&w, storage.Get())
}
{% endhighlight %}

I also added a utility for handling error states for much the same reason -- to reduce the repeated code and simplify the handlers.

{% highlight go %}
func HandleError(w *http.ResponseWriter, code int, responseText string, logMessage string, err error) {
	errorMessage := ""
	writer := *w

	if err != nil {
		errorMessage = err.Error()
	}

	log.Println(logMessage, errorMessage)
	writer.WriteHeader(code)
	writer.Write([]byte(responseText))
}
{% endhighlight %}

Again, relatively simple implementation - it just logs a message, the error (if applicable), and sends the provided error code and message to the client. It turned out to be a very useful utility to add to increase code readability, too.

In action, sending a GET request returned this response, as expected:

{% highlight json %}
[
  {
    "id": 1,
    "sender": "1234",
    "message": "Testing"
  },
  {
    "id": 2,
    "sender": "5678",
    "message": "Testing Again"
  },
  {
    "id": 3,
    "sender": "9012",
    "message": "Testing A Third Time"
  }
]
{% endhighlight %}

### Create/Delete

Create and delete are fairly similar, so it makes sense to cover them together. They both take some input from a POST or DELETE request body and manipulate the message list. However, there's a few subtle differences. Creation takes the input of a message object, minus the ID. Then, validation is performed on the unmarshalled JSON to ensure those fields are provided:

{% highlight go %}
func Add(w http.ResponseWriter, r *http.Request) {
	byteData, err := ioutil.ReadAll(r.Body)

	var message structs.Message

	err = json.Unmarshal(byteData, &message)

	if message.Message == "" || message.Sender == "" {
		httpUtils.HandleError(&w, 400, "Bad Request", "Unmarshalled JSON didn't have required fields", nil)
		return
	}

	id := storage.Add(message)

	log.Println("Added message:", message)

	httpUtils.HandleSuccess(&w, structs.ID{ID: id})
}
{% endhighlight %}

There was a new struct added for sending and receiving IDs, as this made more sense than responding with the same data sent in the request body plus an ID field.

If the fields are not present in the request body, then they are initialised by default to be empty values, like `""` or `0`. In this case, the message shouldn't be added as not everything's provided. For instance, sending:

{% highlight json %}
{
	"message123": "wrong",
	"sender456": "wrong"
}
{% endhighlight %}

...would result in a bad request response. In successful cases, it would return the ID:

{% highlight json %}
{
  "id": 4
}
{% endhighlight %}

Deletion is similar:

{% highlight go %}
func Remove(w http.ResponseWriter, r *http.Request) {
	requestBody, err := ioutil.ReadAll(r.Body)

	var id structs.ID

	err = json.Unmarshal(requestBody, &id)

	if id.ID == 0 {
		httpUtils.HandleError(&w, 500, "Bad Request", "ID not provided", nil)
		return
	}

	if storage.Remove(id.ID) {
		httpUtils.HandleSuccess(&w, structs.ID{ID: id.ID})
	} else {
		httpUtils.HandleError(&w, 400, "Bad Request", "ID not found", nil)
	}
}
{% endhighlight %}

Again, validation is performed to ensure that the `id` field was present on the request body. The removal also handles the case when the ID is not present in the list of messages - the return value of `storage.Remove` - in which case, it returns a bad request.

## Conclusions

Having written these few endpoints, I do feel that they could be further simplified. For example, the handlers are provided with the raw `ResponseWriter` and `Request` values, where it is potentially more useful (in this limited case, at least) to provide the request body to the handling functions and then use the return value to indicate a successful response. This could be a bit more limiting in a more complex application with additional routing and logic, etc.

Nevertheless, I've been impressed at the experience of writing Go web services. I was using the standard HTTP library and it seems powerful enough for most cases. Again, writing the code has been enjoyable, and the code produced was easy to read and clean. I feel like separating the code up into multiple packages and separating the concerns also helped achieve this, as it made the code slightly more explicit in what it was actually doing (for example, `storage.Add` is more understandable than `AddToStorage`). Go is a language worth keeping an eye on, it's used extensively in [Monzo](https://monzo.com/blog/2016/09/19/building-a-modern-bank-backend/) and will likely go on to bigger and better things.

If you want to have a look at the code, it is [available on GitHub](https://github.com/WPFerg/services).
