import { Bill } from "./bill";
import { billingAccount } from "./billingAccount";

export class User{
    id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    telephoneNo:string;
    admin:boolean;
    address?:string;
    cart?:Bill[];
    bills?:Bill[];
    billingAccounts?:billingAccount[];
    currentPlan?:string;
}