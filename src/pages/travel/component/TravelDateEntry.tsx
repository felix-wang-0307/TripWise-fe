import TravelEntry from "./TravelEntry"
import { useState } from "react";
import TravelButton from "./TravelButton";
import TravelNewEntry from "./TravelNewTrip";


function TravelDateEntry({ date, items, onDeleteTrip, onDeleteDate, onAddTrip }) {
    const [isDateFocused, setIsDateFocused] = useState(false)
    const [showAddTrip, setShowAddTrip] = useState(false)

    const handleBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDateFocused(false);
        }
    };

    return (
        <div id={date} className="card text-dark mb-3">
            {/* Date Title */}
            <div tabIndex={date} onFocus={() => setIsDateFocused(true)} onBlur={handleBlur} className="card-header d-flex justify-content-between">
                <h3>{date}</h3>
                {isDateFocused && <TravelButton onClick={() => onDeleteDate(date)}>
                    <span className="material-icons me-2">close</span>
                    Remove
                </TravelButton>}
            </div>

            {/* Items in Date */}
            <div>
                {items.map((item) => (
                    <TravelEntry key={item.itineraryId} item={item} onDeleteTrip={onDeleteTrip} />
                ))}
            </div>
            <div className="card-footer align-items-center">
                {showAddTrip && <TravelNewEntry date={date} onAddTrip={onAddTrip} tempNum={items.length} setShowAddTrip={setShowAddTrip}></TravelNewEntry>}
                {!showAddTrip && <TravelButton onClick={() => setShowAddTrip(true)}>
                    <span className="material-icons me-2">add</span>
                    Add a place
                </TravelButton>}
            </div>
        </div >
    )
}

export default TravelDateEntry