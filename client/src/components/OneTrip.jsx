import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const OneTrip = (props) => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const { selectedTripData, updateSelectedTripData } = props
    const { tripId } = useParams()
    const [trip, setTrip] = useState({})
    const [entries, setEntries] = useState([])

    // Get trip data for header
    useEffect(() => {
        axios.get(`http://localhost:8080/api/trips/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            setTrip(res.data)
            updateSelectedTripData(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [tripId])

    if (!trip) {
        return ("Loading trip...")
    }

    // Get all journal entries for this trip
    useEffect(() => {
        axios.get(`http://localhost:8080/api/entries/all/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            setEntries(res.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [tripId, loggedUser])
    
    const deleteEntry = entryId => {
        axios.delete(`http://localhost:8080/api/entries/delete/${entryId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            // AFter deleting entry, refresh page
            setEntries(prev => prev.filter(entry => entry.id != entryId))
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    return (
        <>
            <div className="container d-flex flex-column justify-content-center">
                <div className="mx-auto">
                    <Link to={`/trips/${trip.id}/newEntry`} className="btn btn-info text-white mb-3">Add A New Journal Entry for This Trip</Link>
                </div>
                {entries.length > 0 ? (
                    entries.map((entry) => (
                    <div key={entry.id} className="card shadow mb-3 px-3 py-3">
                        <div className="card-body d-flex flex-column justify-content-evenly">
                            <h4>Journal entry on {entry.created_at}</h4>
                            <p>{entry.content}</p>
                        </div>
                        <div>
                            <Link to={`/trips/${tripId}/entries/${entry.id}/edit`} className="btn btn-primary me-4">Edit Entry</Link>
                            <button className="btn btn-danger" onClick={() => deleteEntry(entry.id)}>Delete Entry</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Start adding entries for this trip!</p>
            )}
                
                
            </div>

        </>
    )
}

export default OneTrip;