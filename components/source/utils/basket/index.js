
export function handleQuantityChange(quantity: string, maxQuantity: number, item: LimioObject, setQuantity: (number, LimioObject) => void) {
    const basketQuantity = Math.floor(quantity)
    let updatedQuantity = ""

    if (basketQuantity ? basketQuantity <= maxQuantity && quantity > 0 : quantity > 0) {
        updatedQuantity = basketQuantity
    } else if (basketQuantity > maxQuantity) {
        updatedQuantity = maxQuantity
    }

    setQuantity(updatedQuantity, item)
}

export function checkEmptyQuantityOnBlur(quantity: string, item: LimioObject, setQuantity: (number, LimioObject) => void, minQuantity: number) {
    if (quantity === "" || quantity <= minQuantity) {
        setQuantity(minQuantity, item)
    }
}