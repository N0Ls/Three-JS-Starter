import Experience from "./Experience.js";
import Lighting from "./scene/Lighting.js";
import NameText from "./scene/NameText.js";
import ImagePlane from "./scene/ImagePlane.js";
import ThomasHelmet from "./scene/ThomasHelmet.js";
import AudioSpectrum from "./scene/AudioSpectrum.js";

export default class World {
    experience: Experience;
    // eslint-disable-next-line no-undef
    scene: THREE.Scene;

    resources: any;

    imagePlane: ImagePlane;
    thomasHelmet: ThomasHelmet;
    nameText: NameText;
    lighting: Lighting;
    audioSpectrum: AudioSpectrum;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.imagePlane = new ImagePlane();
            this.nameText = new NameText();
            this.lighting = new Lighting();
            this.audioSpectrum = new AudioSpectrum();
            this.thomasHelmet = new ThomasHelmet();

            this.init();
        });
    }

    init() {
        this.imagePlane.init();
        this.nameText.init("Hello, I'm Thomas.");
        this.audioSpectrum.init();
        this.thomasHelmet.init();
    }

    update() {
        if(this.audioSpectrum) this.audioSpectrum.update();
        if(this.thomasHelmet) this.thomasHelmet.update();
    }

    destroy() {
    }

}