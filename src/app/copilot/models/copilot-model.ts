import { ActionModel } from "./action-model";
import { DescriptionModel } from "./description-model";
import { OperatorModel } from "./operator-model";

export class CopilotModel {
    minimum_required: string = "v4.0";
    doc!: DescriptionModel;
    stage_name!: string;
    opers!: OperatorModel[];
    actions!: ActionModel[];
    constructor() {
        this.opers = [];
        this.actions = [];
        this.doc = new DescriptionModel();
    }
}