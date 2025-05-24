abstract class SeederModal {
    seeders:SeederModal[] = [];
    constructor(){}
    abstract execute() : Promise<void>
}

export default SeederModal;