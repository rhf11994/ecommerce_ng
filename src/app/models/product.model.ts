export class Product {
  constructor(
    public name: string,
    public price: string,
    public category: string,
    public color: string,
    public description: string,
    public URL: string,
    public id:number,
    public quantity?:number
  ) {}
}
