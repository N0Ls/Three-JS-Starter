import Experience from "./Experience.js";
import Lighting from "./scene/Lighting.js";
import NameText from "./scene/NameText.js";
import ImagePlane from "./scene/ImagePlane.js";
import ThomasHelmet from "./scene/ThomasHelmet.js";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.imagePlane = new ImagePlane();
            this.thomasHelmet = new ThomasHelmet();
            this.nameText = new NameText();
            this.lighting = new Lighting();

            this.init();
        });
    }

    init() {
        this.imagePlane.init();
        this.nameText.init();
        this.thomasHelmet.init();
    }

}