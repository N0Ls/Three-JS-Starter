import * as THREE from "three";
import * as dat from "lil-gui";


import World from "./World.js";
import Camera from "./Camera.js";
import Time from "./utils/Time.js";
import Sizes from "./utils/Sizes.js";
import Renderer from "./Renderer.js";
import Resources from "./utils/Resources.js";
import PostProcessing from "./PostProcessing.js";

import sources from "./sources.js";

let instance = null;

export default class Experience {
    constructor(canvas) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;
        window.experience = this;

        // Variables
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        //this.postProcessing = new PostProcessing();

        this.resources = new Resources(sources);

        this.world = new World();

        this.init();

        this.namePoster = null;

        // Resize event
        this.sizes.on("resize", () => {
            this.resize();
        });

        // Time tick event
        this.time.on("tick", () => {
            this.update();
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        //this.postProcessing.resize();
    }

    update() {
        this.camera.update();
        this.renderer.update();
        //this.postProcessing.update();
    }

    init() {

        const isDebug = true;
        if(isDebug) {
            this.initGUI();
        }
    }

    initGUI() {
        this.gui = new dat.GUI();
        
        const functionButton = {
            doSomething: () => {
                this.onDoSomething();
            },
        };
        this.gui.add(functionButton, "doSomething").name("Function Button");

        this.gui.close();

    }

    onDoSomething() {
        console.log("Do something");
    }

    destroy() {
        this.sizes.off("resize");
        this.time.off("tick");

        this.renderer.destroy();

        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === "function")
                    {
                        value.dispose();
                    }
                }
            }
        });

        instance = null;

        const isDebug = true;
        if(isDebug) {
            if(this.gui.active)
                this.gui.ui.destroy();
        }
    }

}