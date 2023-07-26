import Experience from "../Experience.js";

export default class ThomasHelmet
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.thomasHelmet;
        this.sizes = this.experience.sizes;

    }

    init(){
        this.setModel();
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        this.model.rotation.y = Math.PI;
        this.scene.add(this.model);
    }
}