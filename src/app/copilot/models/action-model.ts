export class ActionModel {
    type!: string;
    cost_change!: number;
    name!: number;
    doc!: string;
    doc_color!: string;
    kills!: number
    direction!: string;
    pre_delay!: any;
    rear_delay!: any;
    location!:any[];

    constructor() {
        this.location = [null, null]
    }
    // set location(value: any[]) {        
    //     if (value) {
    //         this.location = value;
    //     } else {
    //         this.location = [null, null]
    //     }
    // }
    // get location(){
    //     return this.location
    // }
}