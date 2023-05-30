package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"time"
)

func assertEqual(expected, actual string) {
	var expectedJSON, actualJSON interface{}
	err := json.Unmarshal([]byte(expected), &expectedJSON)
	if err != nil {
		fmt.Println("Failed to parse expected JSON:", err)
		os.Exit(1)
	}

	err = json.Unmarshal([]byte(actual), &actualJSON)
	if err != nil {
		fmt.Println("Failed to parse actual JSON:", err)
		os.Exit(1)
	}

	if !areEqual(expectedJSON, actualJSON) {
		fmt.Println("Assertion failed:")
		fmt.Println("Expected: '", expected, "'")
		fmt.Println("Actual  : '", actual, "'")
		// Stop the servers
		fmt.Println("Stopping servers...")
		exec.Command("pkill", "-f", "python ../run/server.py").Run()
		exec.Command("pkill", "-f", "node ../playground/server.js").Run()
		os.Exit(1)
	}
}

func areEqual(expected, actual interface{}) bool {
	expectedBytes, err := json.Marshal(expected)
	if err != nil {
		return false
	}

	actualBytes, err := json.Marshal(actual)
	if err != nil {
		return false
	}

	return string(expectedBytes) == string(actualBytes)
}

func main() {
	fmt.Println("Starting Python server...")
	exec.Command("python", "../run/server.py").Start()

	time.Sleep(3 * time.Second)

	fmt.Println("Starting Javscript server...")
	exec.Command("tsc").Run()
	exec.Command("node", "../playground/server.js").Start()

	time.Sleep(3 * time.Second)

	// Define the endpoints to test
	endpoints := []string{
		"/comp-482/catalog",
		"/comp/levels/200",
		"/comp-482/spring-2023/schedule",
		"/profs/comp/43",
	}

	// Loop through the endpoints and test them
	for _, endpoint := range endpoints {
		fmt.Println("Testing endpoint:", endpoint)

		// Send requests to both servers and compare responses
		pythonResponse, _ := http.Get("http://localhost:2222" + endpoint)
		tsResponse, _ := http.Get("http://localhost:3333" + endpoint)

		pythonResponseBody, _ := ioutil.ReadAll(pythonResponse.Body)
		tsResponseBody, _ := ioutil.ReadAll(tsResponse.Body)

		assertEqual(string(pythonResponseBody), string(tsResponseBody))
	}
}
