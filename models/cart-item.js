class CartItem {
    constructor(quantity, productPrice, productTitle, sum, productImage,   productDiscount, pushToken) {
        this.quantity = quantity
        this.productPrice = productPrice
        this.productTitle = productTitle

        this.sum = sum
        this.productImage = productImage
        this.productDiscount = productDiscount
        this.pushToken = pushToken
    }
}

export default CartItem