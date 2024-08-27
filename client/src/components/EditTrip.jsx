import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const EditTrip = () => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const { tripId } = useParams()
    const [allDestinations, setAllDestinations] = useState([])
    const [tripData, setTripData] = useState({
        "userId": "",
        "destinationId": "",
        "startDate": "",
        "endDate": ""
    });
    const [errors, setErrors] = useState({})

    // Get existing trip data to prepopulate form
    useEffect(() => {
        axios.get(`http://localhost:8080/api/trips/edit/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            setTripData({
                "userId": res.data.user_id,
                "destinationId": res.data.destination_id,
                "endDate": res.data.end_date,
                "startDate": res.data.start_date
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }, [tripId])
    

    // Get all destinations for select input
    useEffect(() => {
        axios.get("http://localhost:8080/api/destinations/all")
            .then((res) => {
                setAllDestinations(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    const navigate = useNavigate();

    const handleChange = e => {
        const{name, value} = e.target;
        // update state variables with user input
        setTripData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault();

        axios.post(`http://localhost:8080/api/trips/submit_edit/${tripId}`, tripData, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
            .then(res => {
                setTripData({
                    "userId": "",
                    "destinationId": "",
                    "startDate": "",
                    "endDate": ""
                })
                navigate(`/dashboard/${loggedUser.userId}`)
            })
            .catch( error => {
                if (error) {
                    // setErrors(error.response.data.errors)
                    console.log(error)
                }
            } )

    }

    return (
        <>
            <div className="container">

                <div className="card shadow px-5 py3">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="destination" className="form-label">Select destination:</label>
                                <select name="destinationId" id="destinationId" className="form-select" value={tripData.destinationId} onChange={handleChange}>
                                    {allDestinations.map((dest) =>(
                                        <option key={dest.id} value={dest.id}>{dest.name}</option>
                                    ))}
                                </select>
                                {errors.destinationId && <p className="text-danger">{errors.destinationId}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="startDate" className="startDate">Start date:</label>
                                <input type="date" name="startDate" id="startDate" className="form-control" value={tripData.startDate} onChange={handleChange}/>
                                {errors.startDate && <p className="text-danger">{errors.endDate}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="endDate" className="endDate">End date:</label>
                                <input type="date" name="endDate" id="endDate" className="form-control" value={tripData.endDate} onChange={handleChange}/>
                                {errors.endDate && <p className="text-danger">{errors.endDate}</p>}

                            </div>
                            <input type="submit" value="Add trip" className="btn btn-info text-white" />
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditTrip;