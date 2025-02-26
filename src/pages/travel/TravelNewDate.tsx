import { useState } from "react"

function TravelNewDate({ newDate, setNewDate, dateInputError, onCancelAddDate, onAddDate }) {
    return (
        <div className="card border-secondary mb-3 ">
            <div className="card-body d-flex align-items-center">
                <div className="me-3">Please Select Date:</div>
                <input className="me-3" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} ></input>
                <button type="button" className="me-3 btn btn-secondary btn-sm" onClick={() => onCancelAddDate()}>Cancel</button>
                <button type="button" className="me-3 btn btn-secondary btn-sm" onClick={() => onAddDate(newDate)}>Add</button>
                {dateInputError && <div className="text-danger">Error: Input Date Exist/Empty</div>}
            </div>
        </div >
    )
}

export default TravelNewDate