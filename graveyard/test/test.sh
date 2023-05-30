#!/bin/bash

assert_equal() {
  local expected="$1"
  local actual="$2"

  local expected_len="${#expected}"
  local actual_len="${#actual}"
  local max_len=$((expected_len > actual_len ? expected_len : actual_len))

  local mismatched_index=-1
  for ((i = 0; i < max_len; i++)); do
    if [ "${expected:i:1}" != "${actual:i:1}" ]; then
      mismatched_index=$i
      break
    fi
  done

  if [ $mismatched_index -ge 0 ]; then
    echo "Assertion failed:"
    echo "Expected: '$expected'"
    echo "Actual  : '$actual'"
    echo "Mismatch at index $mismatched_index"
    # Stop the servers
    echo "Stopping servers..."
    pkill -f "python ../run/server.py"
    pkill -f "node ../playground/server.js"
    exit 1
  fi
}


echo "Starting Python server..."
python ../../run/server.py &


sleep 3


echo "Starting Javscript server..."
tsc
node ../server.js &


sleep 3

# Define the endpoints to test
endpoints=(
  "/comp-482/catalog"
  "/comp/levels/200"
  "/comp-482/spring-2023/schedule"
  "/profs/comp"
  "/profs/comp/43"
)

# Loop through the endpoints and test them
for endpoint in "${endpoints[@]}"; do
  echo "Testing endpoint: $endpoint"

  # Send requests to both servers and compare responses
  python_response=$(curl -s "http://localhost:2222$endpoint")
  ts_response=$(curl -s "http://localhost:3333$endpoint")

  assert_equal "$python_response" "$ts_response"
done


