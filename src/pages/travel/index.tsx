import { useState, useEffect } from "react"
import Bubble from "./TravelBubble"
import styles from "./travel.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TravelDateEntry from "./TravelDateEntry";
import TravelButton from "./TravelButton";
import TravelNewDate from "./TravelNewDate";
import { TravelItinerary } from "./utils/TravelItineraryInterface";
import { organizeItinerary } from "./utils/organizeItinerary";
import { findInsertionId } from "./utils/findInsertionId";
import { useParams, useSearchParams } from "react-router-dom";
import axios from 'axios';

interface TravelData {
  groupId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number[]; // Assuming userId is a number
}

interface Member {
  userId: string;
  username: string;
  role: string;
}

function Travel() {
  const MAXBUBBLES = 4;

  // expect /travel/${activity.groupId}?userId=${userId})
  const { activityId } = useParams();  // Get `activityId` from the path
  const [searchParams] = useSearchParams();
  const USER_ID = searchParams.get("userId");

  const [travelDetail, setTravelList] = useState<TravelData | null>(null);
  const [itineraryList, setItineraryList] = useState<{ [date: string]: TravelItinerary[] }>({});
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [dateInputError, setDateInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Travel Details
        const travelResponse = await axios.get(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/activities/${activityId}?userId=${USER_ID}`);
        setTravelList(travelResponse.data.activity);
        console.log("Travel Detail:", travelResponse.data.activity);

        // groupId is the same as activityId
        const groupId = travelResponse.data.activity.groupId;

        // Fetch Itinerary
        const itineraryResponse = await axios.get(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/${activityId}/itineraries`);
        setItineraryList(organizeItinerary(itineraryResponse.data));

        // Fetch Members
        const groupResponse = await axios.get(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/groups/${groupId}/members`);
        setMembersList(groupResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityId]); // Dependency array ensures this runs only once on mount and when TRAVEL_ID changes


  // TODO: Need to Update Database Accordingly
  const onDeleteTrip = async (date: string, itineraryId: string) => {
    try {
      // Call delete API
      await axios.delete(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/${activityId}/itineraries/${itineraryId}`);

      // Update local state
      const updatedItinerary = { ...itineraryList };
      if (updatedItinerary[date]) {
        updatedItinerary[date] = updatedItinerary[date].filter(
          item => item.itineraryId !== itineraryId
        );
      }

      setItineraryList(updatedItinerary);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  }

  // TODO: Need to Update Database Accordingly
  const onDeleteDate = async (date) => {
    try {
      // Check if it's the start or end date
      const isStartDate = date === travelDetail.startDate;
      const isEndDate = date === travelDetail.endDate;

      if (isStartDate || isEndDate) {
        const updatedTravel = { ...travelDetail };
        if (isStartDate) {
          updatedTravel.startDate = Object.keys(itineraryList).find(d => d > date) || date;
        }
        if (isEndDate) {
          updatedTravel.endDate = Object.keys(itineraryList).reverse().find(d => d < date) || date;
        }
        // Update travel dates using API 2.1.5
        await axios.put(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/${activityId}`, updatedTravel);
        setTravelList(updatedTravel);
      }
      // update local state
      const updatedItinerary = { ...itineraryList };
      if (updatedItinerary[date]) {
        delete updatedItinerary[date];
      }

      setItineraryList(updatedItinerary);
    } catch (error) {
      console.error("Failed to delete date:", error);
    }
  };

  const onCancelAddDate = () => {
    setNewDate("");
    setShowAddDate(false)
    setDateInputError(false)
  }

  // TODO: Need to Update Database Accordingly
  const onAddDate = async (date) => {
    if (itineraryList[date] || date.length === 0) {
      setDateInputError(true)
      return
    }
    try {
      // Check if the new date is before the start date or after the end date
      const isBeforeStart = date < travelDetail.startDate;
      const isAfterEnd = date > travelDetail.endDate;

      // Update travel dates if necessary
      if (isBeforeStart || isAfterEnd) {
        const updatedTravel = { ...travelDetail };
        if (isBeforeStart) {
          updatedTravel.startDate = date;
        }
        if (isAfterEnd) {
          updatedTravel.endDate = date;
        }
        await axios.put(`http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/${activityId}`, updatedTravel);
        setTravelList(updatedTravel);
      }

      // Update local state
      const updatedItinerary = {};

      const sortedDates = Object.keys(itineraryList)
      const insertionId = findInsertionId(sortedDates, date)
      sortedDates.splice(insertionId, 0, date);

      sortedDates.forEach(d => {
        updatedItinerary[d] = itineraryList[d] || []
      });

      setItineraryList(updatedItinerary);
      onCancelAddDate()

    } catch (error) {
      console.error("Failed to add date:", error);
    }
  }

  // TODO: Need to Update Database Accordingly
  const onAddTrip = async (trip: TravelItinerary) => {
    try {
      // POST new itinerary
      const response = await axios.post(
        `http://tripwise-backend-env.eba-w2ypwqet.us-east-2.elasticbeanstalk.com/api/travels/${activityId}/itineraries`,
        trip
      );

      // Update local state with server-generated ID
      const newTrip = { ...trip, itineraryId: response.data.itineraryId };
      const updatedItinerary = { ...itineraryList };

      const sortedItinerary = updatedItinerary[trip.date] || [];
      const insertionId = findInsertionId(sortedItinerary, newTrip, item => item.time);
      sortedItinerary.splice(insertionId, 0, newTrip);

      updatedItinerary[trip.date] = sortedItinerary;
      setItineraryList(updatedItinerary);
    } catch (error) {
      console.error("Failed to add trip:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!travelDetail) {
    return <div>No travel data available.</div>;
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