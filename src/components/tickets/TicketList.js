import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Ticket } from "./Ticket"
import "./Tickets.css"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [employees, setEmployees] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => {
                return ticket.description.toLowerCase().startsWith(searchTermState.toLowerCase())
            })
            setFiltered(searchedTickets)
        },
        [ searchTermState ]
    )
    
    useEffect(
        () => {
            if (emergency) {
               const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
               setFiltered(emergencyTickets)
            }
            else{
                setFiltered(tickets)
            }
        },
        [emergency]
    )

    const getAllTickets = () => {
        fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`)
                .then(response => response.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })
    }

    useEffect(
        () => {
            getAllTickets()

            fetch(`http://localhost:8088/employees?_expand=user`)
                .then(response => response.json())
                .then((employeeArray) => {
                    setEmployees(employeeArray)
                })
            // console.log("Initial state of tickets", tickets) // View the initial state of tickets
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect(
        () => {
            if (honeyUserObject.staff) {
                // For employees
                setFiltered(tickets)
            }
            else {
                // For customers
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [tickets]
    )

    useEffect(
        ()=> {
            if (openOnly){
                const openTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFiltered(openTicketArray)
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [ openOnly ]
    )
    return <>
        {
            honeyUserObject.staff
                ? <> 
                <button onClick={() => { setEmergency(true)}} >Emergency Only</button>
                <button onClick={() => { setEmergency(false)}} >Show All</button>
                </>
                :<> <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
                    <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
                    <button onClick={() => updateOpenOnly(false)}>All My Tickets</button>
                </>
        }
        
        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                // tickets.map( change to filtered tickets, so not to show all of the tickets
                filteredTickets.map(
                    (ticket) => <Ticket employees={employees}
                    getAllTickets={getAllTickets}
                    currentUser={honeyUserObject} 
                    ticketObject={ticket}/>
                    //use implicit return
                    // create a prop-ticketObject- who's value is current ticket
                    // {ticket} is the parameter for our call back function for map
                    //as this iterates it will create a brand new ticket component
                    //add another prop component-isStaff- to see if ticket holder is customer or not. value ={honeyUserObject}- from TicketList
                    //pass entire employees array as a prop. Why? on inital getting info from the API, do logic in this component. 
                )
            }
        </article>
    </>
}

// code above on line 55-60 shows that the emergency filter button will only show for users that are staff (honeyUserObject.staff) or will execute second instructions if they aren't staff which is the option for creating a ticket

        
// Created a whole new component to keep the TicketList page clean and legible. Then, passed down isStaff and ticketObject from parent element as props to use them in the child element (<Ticket />)