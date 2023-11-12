
export class Cart{
  constructor(
    public _id: string,
    public products: CartProduct[],
    public total: number,
    public masa: number,
    public tips: number,
    public totalProducts: number,
    public cashBack: number,
    public productCount: number,
    public userId: string,
    public toGo: boolean,
    public pickUp: boolean,
    public userName: string,
    public userTel: string,
  ){}
};

export class Order{
  constructor(
    public _id: string,
    public masa: number,
    public masaRest: Table,
    public productCount: number,
    public tips: number,
    public totalProducts: number,
    public total: number,
    public discount: number,
    public status: string,
    public toGo: boolean,
    public pickUp: boolean,
    public completetime: number,
    public paymentMethod: string,
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public userName: string,
    public userTel: string,
    public cif: string,
    public products: CartProduct[]
  ){}
}

export class CartProduct{
  constructor(
   public _id: string,
   public name: string,
   public price: number,
   public quantity: number,
   public total: number,
   public imgPath: string,
   public category: string,
   public sub: boolean,
   public toppings: string[],
   public payToGo: boolean,
  ){}
};

export class Table{
  constructor(
    public _id: string,
    public index: number,
    public bills: Order[]
  ){}
}




