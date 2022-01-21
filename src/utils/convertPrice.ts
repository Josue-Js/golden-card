

export function convertPrice(price: string) {

    const priceFormat = parseFloat(String(Number(price) / 100)).toFixed(2)
    return priceFormat
}