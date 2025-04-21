import { useState } from "react"
import Bubble from "./component/TravelBubble"
import styles from "./travel.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TravelDateEntry from "./component/TravelDateEntry";
import TravelButton from "./component/TravelButton";
import TravelNewDate from "./component/TravelNewDate";
import { TravelItinerary } from "./utils/TravelItineraryInterface";
import { organizeItinerary } from "./utils/organizeItinerary";
import { findInsertionId } from "./utils/findInsertionId";

// -------------- Test Data -------------- 
const travel = {
  "travelId": "travel_456",
  "name": "3-day Trip to New York",
  "description": "Exploring NYC with friends!",
  "startDate": "2025-06-10",
  "endDate": "2025-06-1"
}

const itinerary = [
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
  },
  {
    "itineraryId": "itinerary_003",
    "title": "Central Park Walk",
    "description": "Leisurely morning stroll through Central Park",
    "date": "2025-06-12",
    "time": "08:30",
    "location": "Central Park, NYC"
  },
  {
    "itineraryId": "itinerary_004",
    "title": "Metropolitan Museum of Art Visit",
    "description": "Exploring art and history at The Met",
    "date": "2025-06-12",
    "time": "11:00",
    "location": "Metropolitan Museum of Art, NYC"
  },
  {
    "itineraryId": "itinerary_005",
    "title": "Broadway Show",
    "description": "Watching a Broadway performance",
    "date": "2025-06-12",
    "time": "19:00",
    "location": "Broadway Theater District, NYC"
  },
  {
    "itineraryId": "itinerary_006",
    "title": "Empire State Building Visit",
    "description": "Enjoying the city skyline from the top",
    "date": "2025-06-13",
    "time": "10:00",
    "location": "Empire State Building, NYC"
  },
  {
    "itineraryId": "itinerary_007",
    "title": "Shopping at Fifth Avenue",
    "description": "Exploring luxury shopping and iconic stores",
    "date": "2025-06-13",
    "time": "14:00",
    "location": "Fifth Avenue, NYC"
  },
  {
    "itineraryId": "itinerary_008",
    "title": "Dinner Cruise on Hudson River",
    "description": "A scenic dinner cruise with stunning NYC views",
    "date": "2025-06-13",
    "time": "19:30",
    "location": "Hudson River, NYC"
  }
]

const members = [
  {
    "userId": "user_001",
    "username": "Alice",
    "role": "admin"
  },
  {
    "userId": "user_002",
    "username": "Bob",
    "role": "member"
  },
  {
    "userId": "user_003",
    "username": "Charlie",
    "role": "moderator"
  },
  {
    "userId": "user_004",
    "username": "David",
    "role": "member"
  },
  {
    "userId": "user_005",
    "username": "Eve",
    "role": "admin"
  },
  {
    "userId": "user_006",
    "username": "Frank",
    "role": "member"
  },
  {
    "userId": "user_007",
    "username": "Grace",
    "role": "moderator"
  }
];
// ----------------- End ----------------- 


function Travel() {
  const MAXBUBBLES = 4;

  const [travelDetail, setTravelList] = useState(travel)
  const [itineraryList, setItineraryList] = useState(organizeItinerary(itinerary))
  const [membersList, setMembersList] = useState(members);
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [dateInputError, setDateInputError] = useState(false);

  // const { groupId = "None" } = useParams<{ groupId: string }>();
  // 这样可以在URL中传递参数，例如：http://localhost:xxx/travel/123
  // 然后利用groupId向后端请求数据
  // 如有必要，需做权限校验

  // TODO: Need to Update Database Accordingly
  const onDeleteTrip = (date, itineraryId) => {
    const updatedItinerary = { ...itineraryList };
    if (updatedItinerary[date]) {
      updatedItinerary[date] = updatedItinerary[date].filter(item => item.itineraryId !== itineraryId);
    }

    setItineraryList(updatedItinerary);
  }

  // TODO: Need to Update Database Accordingly
  const onDeleteDate = (date) => {
    const updatedItinerary = { ...itineraryList };
    if (updatedItinerary[date]) {
      delete updatedItinerary[date];
    }

    setItineraryList(updatedItinerary);
  }

  const onCancelAddDate = () => {
    setNewDate("");
    setShowAddDate(false)
    setDateInputError(false)
  }

  // TODO: Need to Update Database Accordingly
  const onAddDate = (date) => {
    if (itineraryList[date] || date.length === 0) {
      setDateInputError(true)
      return
    }

    const updatedItinerary = {};

    const sortedDates = Object.keys(itineraryList)
    const insertionId = findInsertionId(sortedDates, date)
    sortedDates.splice(insertionId, 0, date);

    sortedDates.forEach(d => {
      updatedItinerary[d] = itineraryList[d] || []
    });

    setItineraryList(updatedItinerary);
    onCancelAddDate()
  }

  // TODO: Need to Update Database Accordingly
  const onAddTrip = (trip: TravelItinerary) => {
    const updatedItinerary = { ...itineraryList };

    const sortedItinerary = updatedItinerary[trip.date]
    const insertionId = findInsertionId(sortedItinerary, trip, item => item.time)
    sortedItinerary.splice(insertionId, 0, trip);

    updatedItinerary[trip.date] = sortedItinerary

    setItineraryList(updatedItinerary);
  }

  return (
    <div className="w-75 mx-auto">
      {/* Trip Title */}
      <div className="d-flex align-items-center mx-auto my-4">
        <h1 className="col-6"><strong>{travelDetail.name}</strong></h1>
        <div className={`col-6 ${styles.bubbleContainer}`}>
          {membersList.slice(0, MAXBUBBLES).map(item => <Bubble key={item.userId} desc={item.username} />)}
          {membersList.length > MAXBUBBLES && <Bubble desc={`+${membersList.length - MAXBUBBLES}`}></Bubble>}
        </div>
      </div >

      {/* Anchor for all days */}
      <div className="d-flex">
        {Object.keys(itineraryList).map((date) => (
          <TravelButton key={date} className="me-2 mb-3 btn-sm">
            <a href={`#${date}`} className="text-decoration-none" style={{ color: "inherit" }} >
              {date}
            </a>
          </TravelButton>
        ))}
        <TravelButton className="me-2 mb-3 btn-sm">
          <a href="#newDate" className="d-flex text-decoration-none align-items-center justify-content-center" style={{ color: "inherit" }} >
            <span className="material-icons">add</span>
          </a>
        </TravelButton>
      </div>

      {/* Trip Content */}
      <div>
        {Object.entries(itineraryList).map(([date, items]) => (
          <TravelDateEntry key={date} date={date} items={items} onDeleteTrip={onDeleteTrip} onDeleteDate={onDeleteDate} onAddTrip={onAddTrip}>
          </TravelDateEntry>
        ))}
      </div>

      {/* Add New Date */}
      <div id="newDate" className="mb-3">
        {showAddDate && <TravelNewDate newDate={newDate} setNewDate={setNewDate} dateInputError={dateInputError} onCancelAddDate={onCancelAddDate} onAddDate={onAddDate}></TravelNewDate>}
        {!showAddDate && <TravelButton className="w-100 justify-content-center" onClick={() => setShowAddDate(true)}>
          <span className="material-icons me-2">add</span>
          Add New Date
        </TravelButton>}
      </div>
    </div >
  );
}

export default Travel;