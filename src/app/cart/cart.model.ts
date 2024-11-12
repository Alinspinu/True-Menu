
export class Cart{
  constructor(
    public _id: string,
    public products: CartProduct[],
    public total: number,
    public masa: number,
    public tips: number,
    public totalProducts: number,
    public cashBack: number,
    public discount: number,
    public productCount: number,
    public userId: string,
    public toGo: boolean,
    public pickUp: boolean,
    public userName: string,
    public userTel: string,
    public preOrderPickUpDate: string,
  ){}
};

export class Order{
  constructor(
    public _id: string,
    public soketId: string,
    public masa: number,
    public masaRest: Table,
    public productCount: number,
    public tips: number,
    public totalProducts: number,
    public total: number,
    public discount: number,
    public status: string,
    public endTime: string,
    public preOrderPickUpDate: string,
    public toGo: boolean,
    public index: number,
    public createdAt: string,
    public pickUp: boolean,
    public completetime: number,
    public pending: boolean,
    public paymentMethod: string,
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public payment: {
      cash: number,
      card: number,
      viva: number,
      voucher: number,
      online: number,
    },
    public userName: string,
    public userTel: string,
    public cif: string,
    public show: boolean,
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
   public toppings: Topping[],
   public payToGo: boolean,
   public preOrder: boolean,
   public ings: Ing[],
   public mainCat: string,
   public newEntry: boolean,
   public printer: string,
   public sentToPrint: boolean,
   public imgUrl: string,
   public discount: number,
   public tva: string,
   public dep: string,
   public qty: string,
   public sgrTax: boolean,
   public subProductId: string,
   public productId: string
  ){}
};

export class Table{
  constructor(
    public _id: string,
    public index: number,
    public bills: Order[]
  ){}
}

export class Topping {
  constructor(
    public name: string,
    public price: number,
    public qty: number,
    public ingPrice: number,
    public um: string
  ){}
}

export class Ing{
  constructor(
    public name: String,
    public qty: Number,
    public price: number
  ){}
}




export class Bill{
  constructor(
    public _id: string,
    public soketId: string,
    public index: number,
    public masaRest: any,
    public production: boolean,
    public masa: number,
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
    public payment: {
        cash: number,
        card: number,
        viva: number,
        voucher: number,
        online: number,
    },
    public employee: {
      access: number,
      fullName: string,
      position: string,
      user: string,
    },
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public clientInfo: {
      name: string,
      telephone: string,
      userId: string,
      cashBack: number,
    },
    public cif: string,
    public show: boolean,
    public setName: boolean,
    public name: string,
    public products: BillProduct[],
    public createdAt: any,
  ){}
}


export class BillProduct{
  constructor(
   public _id: string,
   public name: string,
   public price: number,
   public quantity: number,
   public total: number,
   public imgPath: string,
   public category: string,
   public mainCat: string,
   public newEntry: boolean,
   public sub: boolean,
   public toppings: Topping[],
   public ings: Ing[],
   public payToGo: boolean,
   public imgUrl: string,
   public printer: string,
   public sentToPrint: boolean,
   public comment: string,
   public tva: string,
   public dep: string,
   public sgrTax: boolean,
   public subProductId: string,
   public productId: string
  ){}
}




