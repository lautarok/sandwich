import customerContact from "./customerContact.ts"

export default interface Customer {
    id: number
    name: string
    surname?: string
    contacts: customerContact[]
    createdAt: Date
    updatedAt: Date
}