import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const EditEntry = (props) => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const { selectedTripData, updateSelectedTripData } = props
    const { tripId, entryId } = useParams()
    const [trip, setTrip] = useState({})
    const [entryData, setEntryData] = useState({
        "content": ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

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
    }, [tripId, loggedUser])

    if (!trip) {
        return ("Loading trip...")
    }

    // Get existing journal entry data to prepopulate form
    useEffect(() => {
        axios.get(`http://localhost:8080/api/entries/${entryId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            setEntryData({
                "content": res.data.content
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }, [entryId])

    const handleChange = e => {
        const {name, value} = e.target
        // update state variables with user input
        setEntryData(prevData => ({
            ...prevData, [name]: value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault();
        console.log(`Entry data being submitted is ${JSON.stringify(entryData)}`)
        axios.post(`http://localhost:8080/api/entries/${entryId}/edit`, entryData, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
            .then(res => {
                console.log(res.data)
                setEntryData({
                    "content": ""
                })
                navigate(`/trips/${tripId}`)
            })
            .catch(error => {
                if (error) {
                    console.log(error)
                    setErrors(error.response.data.errors)
                }
            })
    }

    return (
        <div className="container">
            <div className="card shadow px-5 py-3">
                <form onSubmit={handleSubmit}>
                    <textarea name="content" id="content" onChange={handleChange} value={entryData.content} placeholder="Share something that happened during your trip" className="form-control mb-3" rows="6" />
                    {errors.content && <p className="text-danger">{errors.content}</p>}
                    <div className="text-end"><input type="submit" value="Save entry" className="btn btn-info text-white" /></div>
                </form>
            </div>
        </div>
    )
}

export default EditEntry