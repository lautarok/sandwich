export default interface CustomerContact {
    id: number
    type: "whatsapp" | "instagram" | "facebook"
    value: string
    createdAt: Date
    updatedAt: Date
}