import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const CreateJournalEntry = (props) =>{
    const { loggedUser } = useContext(LoggedInUserContext)
    const { updateSelectedTripData } = props
    const { tripId } = useParams()
    const [newEntry, setNewEntry] = useState({
        "userId": "",
        "tripId": "",
        "content": ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:8080/api/trips/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then((res) => {
            updateSelectedTripData(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [tripId])

    const handleChange = e => {
        const{name, value} = e.target;
        // update state variables with user input
        setNewEntry( prev => ( { ...prev, [name]: value } ) )
    }

    const handleSubmit = e => {
        e.preventDefault()
        // include user id from context in data submission
        const userId = loggedUser.userId
        const entryData = {...newEntry, "userId": userId, "tripId": tripId
        }
        // console.log(`Entry data being submitted is ${JSON.stringify(entryData)}`)
        axios.post("http://localhost:8080/api/entries/new", entryData, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        .then(res => {
            console.log(res.data)
            setNewEntry({
                "userId": "",
                "tripId": "",
                "content": ""
            })
            navigate(`/trips/${tripId}`)
        })
        .catch(err => {
            // setErrors(err.response.data.errors)
            console.log(err)
        })
    }

    return (
        <div className="container">
            <div className="card shadow px-5 py-3">
                <form onSubmit={handleSubmit}>
                    <textarea name="content" id="content" onChange={handleChange} value={newEntry.content} placeholder="Share something that happened during your trip" className="form-control mb-3" rows="6" />
                    {errors.content && <p className="text-danger">{errors.content}</p>}
                    <div className="text-end"><input type="submit" value="Save entry" className="btn btn-info text-white" /></div>
                </form>
            </div>
        </div>

    )
}

export default CreateJournalEntry;