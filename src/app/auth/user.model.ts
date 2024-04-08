export default class User {
  constructor(
    public _id: string,
    public name: string,
    public telephone: string,
    public token: string,
    public cashBack: number,
    public cashBackProcent: number,
    public admin: number,
    public status: string,
    public email: string,
    public locatie: string,
    public tokenExpirationDate: string,
    public employee: {fullName: string, position: string, user: string, access: number},
    public discount: {
      general: number,
      category: {
        precent: number
        name: string,
        cat: string
      }[]
  },
  ){}
  };

