import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Navigate } from "react-router-dom"

export const CustomerDetails = () => {
    const {customerId} = useParams()
    const [customer, updateCustomer] = useState({})
    const navigateToCustomerDetails = (customerId) => {
        Navigate(`/${customerId}`)
      }

    useEffect(
        () => {
            fetch(`http://localhost:8088/customers?_expand=user&id=${customerId}`)
                .then(response => response.json())
                .then((data) => {
                    const singleCustomer = data[0]
                    updateCustomer(singleCustomer)
                })
        },
        [customerId]
    )

    return <section className="customer">
        <header className="customer_header" onClick={() => {navigateToCustomerDetails(customer.id)}}>{customer?.user?.fullName}</header>
        <div>Email: {customer?.user?.email}</div>
        <div>Address: {customer?.address}</div>
        <div>Phone Number: {customer?.phoneNumber}</div>
        </section>
}