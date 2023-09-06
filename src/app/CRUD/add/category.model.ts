
export class Category{
  constructor(
    public _id: string,
    public name: string,
    public order: number,
    public mainCat: string,
    public product: Product[],
    public image: {path: string, filename: string},
  ){};

};

export class Product {
  constructor(
  public  _id: string,
  public name: string,
  public qty: string,
  public price: number,
  public order: number,
  public description: string,
  public quantity: number,
  public image: {path: string, filename: string},
  public subProducts: SubProduct[],
  public category: Category,
  public available: boolean,
  ){};
};

export class SubProduct{
  constructor(
    public _id: string,
    public name: string,
    public price: number,
    public order: number,
    public quantity: number,
    public product: Product,
    public available: boolean,
  ){};
};


