# Run
```bash
npm run dev
```

# To Do

- get member fail(2.3.1 fail)

- add new date (ok)

- delete itinerary (ok)

- add new itinerary (ok)

- delete date (ok)

# Fetch

## Travel Details

### 2.1.3 Get a Single Activity(Travel) info by activityId & userId

- Endpoint: `GET /api/travels/activities/{activityId}?userId={userId}`
- Example: `GET /api/travels/activities/3?userId=789`
- Response:
    - Success (200 OK):
        ```json
        {
            "code": 200,
            "activity": {
                "groupId": 123,
                "name": "3-day Trip to New York",
                "description": "Exploring NYC with friends!",
                "startDate": "2025-06-10",
                "endDate": "2025-06-12",
                "participants": [
                    789,
                    456
                ]
            }
        }
        ```
    - Error (404 Activity Not Found):
        ```json
        {
            "code": 404,
            "error": "Activity not found"
        }
        ```
    - Error (404 User Not Found):
        ```json
        {
            "code": 404,
            "error": "User not found"
        }
        ```

## Itinerary

### 2.2.2 Get All Itineraries for a Travel

- Endpoint: `GET /api/travels/{travelId}/itineraries`
- Description: Retrieves all itineraries associated with a travel.
- Response (Success - 200 OK):
    ```json
    [
        {
            "itineraryId": "itinerary_001",
            "title": "Visit Statue of Liberty",
            "description": "Morning tour to the Statue of Liberty",
            "date": "2025-06-11",
            "time": "09:00",
            "location": "Statue of Liberty, NYC"
        },
        {
            "itineraryId": "itinerary_002",
            "title": "Dinner at Times Square",
            "description": "Enjoying NYC nightlife",
            "date": "2025-06-11",
            "time": "19:30",
            "location": "Times Square, NYC"
        }
    ]
    ```

## Members

### 2.3.1 Get All Group Members

- Endpoint: `GET /api/travels/{groupId}/members`
- Description: Retrieves a list of users in the travel group.
- Response:
    ```json
    [
        {
            "userId": "user_001",
            "username": "Alice",
            "role": "admin"
        },
        {
            "userId": "user_002",
            "username": "Bob",
            "role": "member"
        }
    ]
    ```

# Modify Travel

## Delete Itinerary(Trip) 刪除行程

### 2.2.4 Delete an Itinerary

- Endpoint: `DELETE /api/travels/{travelId}/itineraries/{itineraryId}`
- Description: Removes an itinerary from a travel plan.
- Response (Success - 200 OK):
    ```json
    {
        "message": "Itinerary deleted successfully"
    }
    ```

## Add Itinerary(Trip) 增加行程

### 2.2.1 Add an Itinerary

- Endpoint: `POST /api/travels/{travelId}/itineraries`
- Description: Adds an itinerary (activity) to a travel.
- Request Body (JSON):
    ```json
    {
        "title": "Visit Statue of Liberty",
        "description": "Morning tour to the Statue of Liberty",
        "date": "2025-06-11",
        "time": "09:00",
        "location": "Liberty Island, NYC"
    }
    ```
- Response (Success - 201 Created):
    ```json
    {
        "itineraryId": "itinerary_001",
        "message": "Itinerary added successfully"
    }
    ```

# Modify Date 

## 只要update travel for start or end date?

## Delete Date 刪除那天, Add Date 增加一天

### 2.1.5 Update a Travel

- Endpoint: `PUT /api/travels/{travelId}`
- Description: Updates an existing travel plan.
- Request Body (JSON):
    ```json
    {
        "name": "NYC Adventure",
        "description": "A thrilling trip to New York City!",
        "startDate": "2025-06-11",
        "endDate": "2025-06-13"
    }
    ```
- Response (Success - 200 Ok):
    ```json
    {
        "message": "Travel updated successfully"
    }
    ```