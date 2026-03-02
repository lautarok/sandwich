import type CustomerContact from "./customerContact.ts"

export default interface Customer {
    id: number
    name: string
    surname?: string
    contacts: CustomerContact[]
    createdAt: Date
    updatedAt: Date
}