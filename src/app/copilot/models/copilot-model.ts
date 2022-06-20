import { ActionModel } from "./action-model";
import { DescriptionModel } from "./description-model";
import { OperatorModel } from "./operator-model";



export class CopilotModel {
    minimum_required: string = "v4.0";
    doc!: DescriptionModel;
    stage_name!: string;
    opers!: OperatorModel[];
    groups!: OperatorGroupModel[];
    actions!: ActionModel[];
    constructor() {
        this.opers = [];
        this.actions = [];
        this.doc = new DescriptionModel();
        this.groups = [];
    }
    load(data: CopilotModel): void {
        this.minimum_required = "v4.0";
        this.doc = data.doc;
        this.stage_name = data.stage_name;
        this.opers = data.opers;
        this.groups = data.groups;
        this.actions = data.actions;
        this.cleanUP();
    }
    cleanUP(): void {
        if (!this.groups) this.groups = [];
    }
}


export class OperatorGroupModel {
    name: string = '';
    opers!: OperatorModel[];
    constructor() {
        this.opers = [];
        this.name = '';
    }
}