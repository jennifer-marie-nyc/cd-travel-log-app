import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

const Dashboard = () => {
    const [allTrips, setAllTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const { loggedUser } = useContext(LoggedInUserContext)
    const { user_id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedUser && loggedUser.token) {
            axios.get(`http://localhost:8080/api/dashboard/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            })
            .then((res) => {
                setAllTrips(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
            // If user is not logged in, redirect to login page
        } else if (!loggedUser || !loggedUser.token) {
            navigate("/login")
        }
    }, [user_id,loggedUser]);

    const deleteTrip = tripId => {
        axios.delete(`http://localhost:8080/api/trips/delete/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            // After deleting trip, refresh list
            setAllTrips(prev => prev.filter(trip => trip.id !== tripId))
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    if (loading) {
        return <div>Dashboard Loading...</div>
    }

    return (
        <>
            <div className="container">
                <div className="card shadow">
                    <div className="card-body d-flex justify-content-evenly">
                        <h2 className="card-title">My trips</h2>
                        <Link to={`/trips/new`} className="btn btn-info text-white">Add a new trip</Link>
                    </div>
                    <div className="px-4 py-3">
                        {allTrips.map((trip) => (
                            <div key={trip.id} className="d-flex justify-content-between mb-3">
                                <p>{trip.destination}</p>
                                <p>{trip.start_date} - {trip.end_date}</p>
                                <Link to={`/trips/${trip.id}`} className="btn btn-info text-white">View Journal</Link>
                                <Link to={`/trips/${trip.id}/edit`} className="btn btn-primary">Edit Trip</Link>
                                {/* <Link to={`/trips/${trip.id}/delete`} className="btn btn-danger">Delete Trip</Link> */}
                                <button className="btn btn-danger" onClick={() => deleteTrip(trip.id)}>Delete Trip</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;