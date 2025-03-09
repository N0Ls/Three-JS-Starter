import * as THREE from "three/webgpu";;
import Experience from "./Experience.js";
import Lighting from "./scene/Lighting.js";
import NameText from "./scene/NameText.js";
import Resources from "./utils/Resources.js";
import ImagePlane from "./scene/ImagePlane.js";
import ThomasHelmet from "./scene/ThomasHelmet.js";

export default class World {
    experience: Experience;
    // eslint-disable-next-line no-undef
    scene: THREE.Scene;

    resources: Resources;

    imagePlane: ImagePlane;
    thomasHelmet: ThomasHelmet;
    nameText: NameText;
    lighting: Lighting;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.imagePlane = new ImagePlane();
            // this.nameText = new NameText();
            this.lighting = new Lighting();
            this.thomasHelmet = new ThomasHelmet();

            this.init();
        });
    }

    init() {
        this.imagePlane.init();
        // this.nameText.init("Hello, I'm Thomas.");
        this.thomasHelmet.init();
    }

    update() {
        if (this.thomasHelmet) this.thomasHelmet.update();
    }

    destroy() {
    }

}