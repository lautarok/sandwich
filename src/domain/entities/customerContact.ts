export default interface customerContact {
    id: number
    type: "whatsapp" | "instagram" | "facebook"
    value: string
    createdAt: Date
    updatedAt: Date
}