import * as THREE from "three/webgpu";;
import Experience from "../Experience.js";
import Resources from "../utils/Resources.js";

type EnvironmentMap = {
    intensity: number;
    texture: THREE.Texture;
    updateMaterials: () => void;
};

export default class Lighting {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;

    sunLight: THREE.DirectionalLight;
    environmentMap: EnvironmentMap;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Setup
        this.setSunLight();
        this.setEnvironmentMap();
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, 2.25);
        this.scene.add(this.sunLight);
    }
    setEnvironmentMap() {
        this.environmentMap = { intensity: 0.6, texture: this.resources.items.environmentMapTexture, updateMaterials: () => { } };
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        };
        this.environmentMap.updateMaterials();
    }

}