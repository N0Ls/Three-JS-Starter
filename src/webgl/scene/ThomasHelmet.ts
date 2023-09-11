import * as THREE from "three";
import Experience from "../Experience.js";

export default class ThomasHelmet
{
    experience: Experience;
    scene: THREE.Scene;
    resources: any;
    resource: any;
    sizes: any;

    model: THREE.Object3D;
    constructor()
    {
        this.experience = Experience.getInstance();
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