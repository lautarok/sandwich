export default interface CustomerContact {
    id: number
    customerId: number
    type: "whatsapp" | "instagram" | "facebook"
    value: string
    createdAt: Date
    updatedAt: Date
}