interface Token {
    type: "product" | "feature" | "quantity" | "conjunction" | "terminator"
    value?: number | string
    word?: string
}

export default Token 