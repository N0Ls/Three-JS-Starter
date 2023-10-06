import Experience from "./Experience.js";
import Lighting from "./scene/Lighting.js";
import NameText from "./scene/NameText.js";
import ImagePlane from "./scene/ImagePlane.js";
import ThomasHelmet from "./scene/ThomasHelmet.js";
import AudioData from "./scene/AudioData.js";

export default class World {
    experience: Experience;
    // eslint-disable-next-line no-undef
    scene: THREE.Scene;

    resources: any;

    imagePlane: ImagePlane;
    thomasHelmet: ThomasHelmet;
    nameText: NameText;
    lighting: Lighting;
    audioData: AudioData;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.imagePlane = new ImagePlane();
            this.thomasHelmet = new ThomasHelmet();
            this.nameText = new NameText();
            this.lighting = new Lighting();
            this.audioData = new AudioData();

            this.init();
        });
    }

    init() {
        this.imagePlane.init();
        this.nameText.init("Hello, I'm Thomas.");
        this.thomasHelmet.init();
        this.audioData.init();
    }

    update() {
        if(this.audioData) this.audioData.update();
    }

    destroy() {
        this.audioData.destroy();
    }

}