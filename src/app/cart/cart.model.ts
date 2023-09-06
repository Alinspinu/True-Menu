
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
  ){}
};

export class CartProduct{
  constructor(
   public _id: string,
   public name: string,
   public price: number,
   public quantity: number,
   public total: number,
   public imgPath: string,
   public category: string,
   public sub: boolean
  ){}
};
