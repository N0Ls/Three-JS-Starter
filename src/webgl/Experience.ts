import * as THREE from "three";
import * as dat from "lil-gui";
import Stats from "stats-gl";


import World from "./World.js";
import Camera from "./Camera.js";
import Time from "./utils/Time.js";
import Sizes from "./utils/Sizes.js";
import Renderer from "./Renderer.js";
import Resources from "./utils/Resources.js";
// import PostProcessing from "./PostProcessing.js";

import sources from "./sources.js";
import AudioEngine from "./AudioEngine.js";

export default class Experience {
    instance: Experience | null;
    static instance;

    static getInstance () {
        if (!Experience.instance) {
            Experience.instance = new Experience();
        }
        return Experience.instance;
    }

    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    time: Time;
    scene: THREE.Scene;
    camera: Camera;
    renderer: Renderer;

    resources: Resources;
    world: World;
    audioEngine: AudioEngine;

    gui: dat.GUI;
    stats: Stats;

    // postProcessing: PostProcessing;

    constructor() {
        // Singleton
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;
        window.experience = this;

        // Variables
        const canvas = document.querySelector("canvas");
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        // this.postProcessing = new PostProcessing();

        this.resources = new Resources(sources);

        this.audioEngine = new AudioEngine();

        this.world = new World();

        this.init();

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
            this.initStats();
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

    initStats() {
        const container = document.getElementById( "container" );

        this.stats = new Stats({
            logsPerSecond: 20, 
            samplesLog: 100, 
            samplesGraph: 10, 
            precision: 2, 
            horizontal: true,
            minimal: false, 
            mode: 0 
        });

        container?.appendChild( this.stats.container );

        this.stats.init(this.renderer.instance?.domElement);

        this.scene.onBeforeRender = () => {
            this.stats.begin();
        };

        this.scene.onAfterRender = () => {
            this.stats.end();
        };

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

        Experience.instance = null;

        this.audioEngine.destroy();

        const isDebug = true;

        // TODO : destroy GUI
        if(isDebug) {
            if(this.gui.active)
                this.gui.ui.destroy();
        }

        // TODO : destroy Stats
    }

}