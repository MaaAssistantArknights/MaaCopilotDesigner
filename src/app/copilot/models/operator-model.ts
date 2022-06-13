export class OperatorModel {
    name!: string;
    skill!: any;
    skill_usage!: number;
    constructor() {
        this.name = '';
        this.skill = null;
        this.skill_usage = 0;
    }
}