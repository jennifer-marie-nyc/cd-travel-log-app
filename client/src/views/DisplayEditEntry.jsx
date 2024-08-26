import { useContext, useState } from "react";
import { LoggedInUserContext } from "../App";
import { Link } from "react-router-dom";
import EditEntry from "../components/EditEntry";
import Header from "../components/Header";

const DisplayEditEntry = () => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const [ selectedTripData, setSelectedTripData ] = useState({})

    const updateSelectedTripData = data => {
        setSelectedTripData(data)
    }

    return (
        <>
            <Header>
            {selectedTripData && selectedTripData.start_date ? (
                    <div>
                         <h3>Update Journal Entry for {selectedTripData.destination} Trip</h3>
                         <h4> {selectedTripData.start_date} - {selectedTripData.end_date}</h4>
                    </div>
                ) :
                <h3>Loading trip details...</h3>}
                <Link to={`/dashboard/${loggedUser.userId}`}>Dashboard</Link>
            </Header>
            <EditEntry updateSelectedTripData={updateSelectedTripData} />
        </>
    )
}

export default DisplayEditEntry;