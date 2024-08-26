import Header from "../components/Header"
import OneTrip from "../components/OneTrip"
import { useContext, useState } from "react";
import { LoggedInUserContext } from "../App";
import { Link } from "react-router-dom";

const DisplayOneTrip = () => {
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
                         <h3>Journal for {selectedTripData.destination} Trip</h3>
                         <h4> {selectedTripData.start_date} - {selectedTripData.end_date}</h4>
                    </div>
                ) :
                <h3>Loading trip details...</h3>}
                <Link to={`/dashboard/${loggedUser.userId}`}>Dashboard</Link>
            </Header>
            <OneTrip selectedTripData={selectedTripData} updateSelectedTripData={updateSelectedTripData} />
        </>
    )
}

export default DisplayOneTrip