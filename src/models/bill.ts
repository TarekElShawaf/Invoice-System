export class Bill{
    billNum:number;
    type:string;
    status:string
    dueDate:string;
    units?:number;
    id?:string;

    //telephone related attributes
    accountNum?:string;
    offerValue?:number;
    offerPlan?:string;
}