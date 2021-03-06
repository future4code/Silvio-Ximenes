import { useEffect, useState } from 'react'
import { baseUrl } from '../parameters'
import { useProtectedPage } from '../customHooks'
import axios from 'axios'
import ShowTrips from '../components/ShowTrips'
import Candidates from '../components/Candidates'
import Approved from '../components/Approved'
import  { PageTitle, TripDetailsBox }from '../styled'
import { useParams } from 'react-router'


export default function TripDetails() {

    useProtectedPage()

    const params = useParams()
    const [trip, setTrip] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        getTripDetails()
    }, [])

    const getTripDetails = async () => {

        const headers = {headers: {'auth': window.localStorage.getItem("token")}}

        try {
            const response = await axios.get(`${baseUrl}/trip/${params.id}`, headers)
            setTrip(response.data.trip)
            setLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }

    const decideCandidate = async (choice, candidateId) => {

        const body = {
            approve: choice
        }
        const headers = {headers: {'auth': window.localStorage.getItem("token")}}

        try {
            await axios.put(`${baseUrl}/trips/${params.id}/candidates/${candidateId}/decide`, body, headers)
            setLoading(true)
            getTripDetails()

        }
        catch (error) {
            console.log(error)
        }
    }
    
    return (
        <TripDetailsBox>
            <PageTitle>Detalhes da Viagem</PageTitle>

            <ShowTrips trips={[trip]}/>

            {!loading && <Candidates candidates={trip.candidates} decideCandidate={decideCandidate}/>}

            {!loading && <Approved approved={trip.approved} />}
        </TripDetailsBox>
    )
}