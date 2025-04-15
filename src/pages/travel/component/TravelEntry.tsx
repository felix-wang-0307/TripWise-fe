import TravelButton from "./TravelButton";

function TravelEntry({ item, onDeleteTrip }) {
    return (
        <div className="card-body bg-light my-1 d-flex align-items-center">
            {/* Left Column: Time */}
            <div className="col-2">{item.time}</div>

            {/* Right Column: Details */}
            <div className="col-8 col-md-9">
                <div className="d-flex flex-wrap pb-1">
                    <div className="col-12 col-md-6" >
                        {item.title}
                    </div>
                    <div className="col-12 col-md-6 d-flex">
                        <span className="material-icons me-2">location_on</span>
                        {item.location}
                    </div>
                </div>
                <div>
                    {item.description}
                </div>
            </div>

            {/* Trip Delte Button */}
            <div className="col-2 col-md-1 align-items-center">
                <TravelButton onClick={() => onDeleteTrip(item.date, item.itineraryId)}>
                    <span className="material-icons">close</span>
                </TravelButton>
            </div>
        </div >
    )
}

export default TravelEntry