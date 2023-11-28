export class Cart {
  constructor(
    public name: string,
    public price: string,
    public category: string,
    public color: string,
    public description: string,
    public URL: string,
    public userId: number,
    public ProductId: number,
    public id?: number,
    public quantity?: number
  ) {}
}

export class PriceSummary {
  constructor(
    public price: number,
    public tax: number,
    public delivery: number,
    public discount: number,
    public total: number
  ) {}
}
export class Order {
  constructor(
    public email: string,
    public address: string,
    public contact: string,
    public userId?:number,
    public totalPrice?:number,
    public id?:number
  ) {}
}
