
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
  public image: {path: string, filename: string}[],
  public subProducts: SubProduct[],
  public category: Category,
  public preOrderPrice: number,
  public preOrder: boolean,
  public available: boolean,
  public tva: string,
  public mainCat: string,
  public printer: string,
  public longDescription: string,
  public allergens: {name: string, _id: string}[],
  public additives: {name: string, _id: string}[],
  public nutrition: {
    energy: {kJ: number, kcal: number},
    fat: {all: number, satAcids: number},
    carbs: {all: number, sugar: number},
    salts: number,
    protein: number,
  },
  public toppings: Topping[],
  public ingredients:{quantity: number, ingredient: Ingredient}[],
  public paring: Product[],
  public ings: Ing[],
  public dep: string,
  public sgrTax: boolean,
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

export class Ingredient{
  constructor(
    public _id: string,
    public name: string,
    public labelInfo: string,
    public energy: {kcal: number, kJ: number},
    public carbs: {all: number, sugar: number},
    public fat: {all: number, satAcids: number},
    public salts: number,
    public protein: number,
    public additives: {name: string, _id: string}[],
    public allergens: {name: string, _id: string}[]
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


