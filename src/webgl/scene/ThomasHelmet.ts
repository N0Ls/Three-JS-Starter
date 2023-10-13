import * as THREE from "three";
import Experience from "../Experience.js";

export default class ThomasHelmet
{
    experience: Experience;
    scene: THREE.Scene;
    resources: any;
    resource: any;
    sizes: any;

    audioData: Uint8Array;
    audioParams: { audioIndex: number };
    audioIndex : number = 0;

    gui: any;

    model: THREE.Object3D;
    constructor()
    {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.thomasHelmet;
        this.sizes = this.experience.sizes;
        this.gui = this.experience.gui;

        this.audioParams = {
            audioIndex: 0,
        };

    }

    init(){
        this.setModel();
        this.setGUI();
        this.audioData = this.experience.audioAnalyser.audioData;
    }

    setGUI() {
        this.gui.add(this.audioParams, "audioIndex").min(0).max((this.experience.audioAnalyser.fftSize / 2.0) - 1).step(1).name("Audio Index");
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        this.model.rotation.y = Math.PI;
        this.scene.add(this.model);
    }

    update()
    {
        this.model.rotation.y += 0.01;
        this.audioData = this.experience.audioAnalyser.audioData;

        let bass = this.audioData[this.audioParams.audioIndex] / 255;
        bass = Math.max(bass, 0.2);
        this.model.scale.set( 
            0.1 + bass,
            0.1 + bass,
            0.1 + bass
        );

    }
}