import {Howl, Howler} from "howler";
import Experience from "./Experience";
import Resources from "./utils/Resources";

export default class AudioEngine
{

    experience: Experience;
    resources: Resources;
    sound: Howl;

    constructor()
    {
        // Setup the new Howl.

        // Change global volume.
        Howler.volume(0.5);

        this.experience = Experience.getInstance();

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
                this.init();
        });
    }

    init()
    {
        this.sound = this.resources.items.ambientSound;
        // this.sound.play();
    }

    destroy()
    {
        // this.sound.stop();
        this.sound.unload();
    }
}

