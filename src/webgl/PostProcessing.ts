import * as THREE from "three/webgpu";

import Camera from "./Camera.js";
import Sizes from "./utils/Sizes.js";
import ColoramaNode, { colorama } from "./tsl/ColoramaNode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import Experience from "./Experience.js"; import { pass, renderOutput } from "three/tsl";


const COLORAMA_PARAMS = {
    color1: { r: 1.0, g: 1.0, b: 0.0 },
    color2: { r: 1.0, g: 0.0, b: 0.0 },
};

export default class PostProcessing {

    experience: Experience;
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: THREE.Scene;
    camera: Camera;

    instance: THREE.PostProcessing;
    coloramaPass: ColoramaNode;

    constructor() {
        this.experience = Experience.getInstance();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setInstance();
    }

    setInstance() {
        const scenePass = pass(this.experience.scene, this.experience.camera.instance);
        const scenePassColor = renderOutput(scenePass);
        const bloomPass = bloom(scenePassColor);

        this.coloramaPass = colorama(scenePassColor, new THREE.Color(COLORAMA_PARAMS.color1.r, COLORAMA_PARAMS.color1.g, COLORAMA_PARAMS.color1.b), new THREE.Color(COLORAMA_PARAMS.color2.r, COLORAMA_PARAMS.color2.g, COLORAMA_PARAMS.color2.b));

        this.instance = new THREE.PostProcessing(this.experience.renderer.instance);
        //this.instance.outputNode = scenePassColor.add(bloomPass);
        this.instance.outputNode = this.coloramaPass;
    }

    initGUI() {
        const folder = this.experience.gui.addFolder({ title: "Post Processing" });
        folder.addBinding(COLORAMA_PARAMS, "color1", {
            color: { type: "float" },
        }).on("change", () => {
            this.coloramaPass.color1.value = new THREE.Color(
                COLORAMA_PARAMS.color1.r,
                COLORAMA_PARAMS.color1.g,
                COLORAMA_PARAMS.color1.b,
            );
        });

        folder.addBinding(COLORAMA_PARAMS, "color2", {
            color: { type: "float" },
        }).on("change", () => {
            this.coloramaPass.color2.value = new THREE.Color(
                COLORAMA_PARAMS.color2.r,
                COLORAMA_PARAMS.color2.g,
                COLORAMA_PARAMS.color2.b,
            );
        });
    }

    resize() {
    }

    update() {
        this.instance.render();
    }

    destroy() {
    }
}