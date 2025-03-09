import * as THREE from "three/webgpu";
import Camera from "./Camera.js";
import Sizes from "./utils/Sizes.js";
import Experience from "./Experience.js";

export default class Renderer {
    experience: Experience;
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: THREE.Scene;
    camera: Camera;

    instance: THREE.WebGPURenderer;
    constructor() {
        this.experience = Experience.getInstance();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setInstance();
    }

    setInstance() {

        this.instance = new THREE.WebGPURenderer({
            canvas: this.canvas!,
            antialias: true,
            forceWebGL: false,
        });

        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.setClearColor(0x000000, 1);
        // this.instance.gammaOutput = true;
        // this.instance.gammaFactor = 2.2;
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.renderAsync(this.scene, this.camera.instance);
    }

    destroy() {
        this.instance.dispose();
    }
}