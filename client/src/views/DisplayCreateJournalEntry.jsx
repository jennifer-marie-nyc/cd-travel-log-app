import CreateJournalEntry from "../components/CreateJournalEntry";
import Header from "../components/Header";
import { useContext, useState } from "react";
import { LoggedInUserContext } from "../App";
import { Link } from "react-router-dom";

const DisplayCreateJournalEntry = () => {
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
                         <h3>New Journal Entry for {selectedTripData.destination} Trip</h3>
                         <h4> {selectedTripData.start_date} - {selectedTripData.end_date}</h4>
                    </div>
                ) :
                <h3>Loading trip details...</h3>}
                <Link to={`/dashboard/${loggedUser.userId}`}>Dashboard</Link>
            </Header>
            <CreateJournalEntry updateSelectedTripData={updateSelectedTripData} />
        </>
    )
}

export default DisplayCreateJournalEntry;