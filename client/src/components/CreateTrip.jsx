import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const CreateTrip = (props) => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const { updateSelectedTripData } = props
    const { tripId } = useParams()
    const [allDestinations, setAllDestinations] = useState([])
    const [newTripData, setNewTripData] = useState({
        "userId": "",
        "destinationId": "",
        "startDate": "",
        "endDate": ""
    });
    const [errors, setErrors] = useState({})
    const [loading, setLoading] =  useState(true)

    // Get destinations from database
    // If destinations not yet populated, get them from REST Countries API

    useEffect(() => {
        axios.get("http://localhost:8080/api/destinations/all")
            .then((res) => {
                if (res.data.length > 0) {
                    setAllDestinations(res.data)
                    console.log(`Length is ${res.data.length}`)
                    // Set default value for first destination
                    setNewTripData(prev => ({...prev, destinationID: res.data[0].id}))
                    setLoading(false)
                } else {
                    console.log("No destinations found")
                    axios.get("http://localhost:8080/api/destinations/populate_all")
                    // Set allDestinations after populating
                        .then((res) => {
                            setAllDestinations(res.data)
                            if (res.data.length > 0) {
                            setNewTripData(prev => ({ ...prev, destinationId: res.data[0].id }))
                            setLoading(false)
                    }
                        })
                }
                
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }, []);

    
    // useEffect(() => {
    //     axios.get("http://localhost:8080/api/destinations/all")
    //         .then((res) => {
    //             setAllDestinations(res.data)
    //             // Set default value for destination
    //             if (res.data.length > 0) {
    //                 setNewTripData(prevData => ({
    //                     ...prevData,
    //                     destinationId: res.data[0].id
    //                 }));
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }, []);

    const navigate = useNavigate();

    const handleChange = e => {
        const{name, value} = e.target;
        // update state variables with user input
        setNewTripData( prev => ( { ...prev, [name]: value } ) )
        
    }

    const handleSubmit = e => {
        e.preventDefault();
        // include user id from context in data submission
        const userId = loggedUser.userId
        const tripData = { ...newTripData, userId }

        // console.log(`Trip data being submitted is ${tripData}`)
        axios.post("http://localhost:8080/api/trips/new", tripData, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
            .then(res => {
                // console.log(res.data)
                const tripId = res.data.trip_id
                setNewTripData({
                    "userId": "",
                    "destinationId": "",
                    "startDate": "",
                    "endDate": ""
                })
                navigate(`/trips/${tripId}`)
            })
            .catch( error => {
                if (error) {
                    setErrors(error.response.data.errors)
                }
            } )

    }

    if (loading) {
        return <div>Loading destinations...</div>
    }

    return (
        <>
            <div className="container">

                <div className="card shadow px-5 py-3">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="destination" className="form-label">Select destination:</label>
                                <select name="destinationId" id="destinationId" className="form-select" onChange={handleChange}>
                                    {allDestinations.map((dest) =>(
                                        <option key={dest.id} value={dest.id}>{dest.name}</option>
                                    ))}
                                </select>
                                {errors.destinationId && <p className="text-danger">{errors.destinationId}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="startDate" className="startDate">Start date:</label>
                                <input type="date" name="startDate" id="startDate" className="form-control" onChange={handleChange}/>
                                {errors.startDate && <p className="text-danger">{errors.endDate}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="endDate" className="endDate">End date:</label>
                                <input type="date" name="endDate" id="endDate" className="form-control" onChange={handleChange}/>
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

export default CreateTrip;