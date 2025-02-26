import { useState } from "react"
import { TravelItinerary } from "./utils/TravelItineraryInterface"

function TravelNewTrip({ date, onAddTrip, tempNum, setShowAddTrip }) {
    const [time, setTime] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")

    const onCancelClick = () => {
        setTime("")
        setTitle("")
        setDescription("")
        setLocation("")
        setShowAddTrip(false)
    }

    const onAddClick = () => {
        // only temp for frontend, will update after backend call refresh
        const itineraryId = "Temp" + tempNum
        const newTrip: TravelItinerary = {
            itineraryId,
            title,
            description,
            date,
            time,
            location,
        }

        onAddTrip(newTrip)
        onCancelClick()
        setShowAddTrip(false)
    }

    return (
        <div className="mb-3 ">
            <div className="me-3 mb-2 d-flex">
                <div className="col-2">Time:</div>
                <input className="ms-3 me-3" value={time} type="time" onChange={(e) => setTime(e.target.value)}></input>
            </div>
            <div className="me-3 mb-2 d-flex">
                <div className="col-2">Title:</div>
                <input className="ms-3 me-3" value={title} type="string" onChange={(e) => setTitle(e.target.value)}></input>
            </div>
            <div className="me-3 mb-2 d-flex">
                <div className="col-2">Description:</div>
                <input className="ms-3 me-3" value={description} type="string" onChange={(e) => setDescription(e.target.value)}></input>
            </div>
            <div className="me-3 mb-2 d-flex">
                <div className="col-2">Location:</div>
                <input className="ms-3 me-3" value={location} type="string" onChange={(e) => setLocation(e.target.value)}></input>
            </div>

            <div className="d-flex">
                <button type="button" className="me-3 btn btn-secondary btn-sm" onClick={() => onCancelClick()}>Cancel</button>
                <button type="button" className="me-3 btn btn-secondary btn-sm" onClick={() => onAddClick()}>Add</button>
            </div>
        </div >
    )
}

export default TravelNewTrip