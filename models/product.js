class Product {
  constructor(
    id,
    ownerId,
    ownerPushToken,
    title,
    imageUrl,
    description,
    price,
    discount,
    discountedPrice
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.pushToken = ownerPushToken;
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
    this.price = price;
    this.discount = discount;
    this.discountedPrice = discountedPrice + price - (discount / 100) * price;
  }
}

export default Product;
