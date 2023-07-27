import * as THREE from "three";
import Experience from "../Experience.js";

import { MeshTransmissionMaterial } from "../utils/materials/MeshTransmissionMaterial.js";


export default class TransmissionSphere
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;

        this.time.on("tick", () => {
            this.update();
        });
    }

    init(){
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.setGUI();
    }

    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
    }

    setTextures()
    {
        this.texture = this.resources.items.uvTest;
        this.texture.colorSpace = THREE.LinearSRGBColorSpace;
        this.texture.SRGBColorSpace = true;
    }

    setMaterial()
    {
        this.material = Object.assign(new MeshTransmissionMaterial(10), {
            clearcoat: 1,
            clearcoatRoughness: 0,
            transmission: 1,
            chromaticAberration: 0.08,
            anisotrophicBlur: 0.1,
            // Set to > 0 for diffuse roughness
            roughness: 0,
            thickness: 0.9,
            ior: 1.5,
            // Set to > 0 for animation
            distortion: 0.1,
            distortionScale: 0.2,
            temporalDistortion: 0.68
        });
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(3, 3, 3);
        this.scene.add(this.mesh);
    }

    setGUI()
    {
        this.gui = this.experience.gui;
        this.params = {
            chromaticAberration: 0.05,
            anisotrophicBlur: 0.1,
            time: 0,
            distortion: 0.1,
            distortionScale: 0.2,
            temporalDistortion: 0.68,
            transmission: 1,
            roughness: 0,
            thickness: 0.9,
            ior: 1.5
        };
        const transmissionFolder = this.gui.addFolder("Transmission");
        transmissionFolder.open();
        transmissionFolder
            .add(this.params, "chromaticAberration")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.uniforms.chromaticAberration.value =
              this.params.chromaticAberration;
            });
        transmissionFolder
            .add(this.params, "anisotrophicBlur")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.uniforms.anisotrophicBlur.value =
                this.params.anisotrophicBlur;
            });
        transmissionFolder
            .add(this.params, "distortion")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.uniforms.distortion.value = this.params.distortion;

            });
        transmissionFolder
            .add(this.params, "distortionScale")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.uniforms.distortionScale.value =
                this.params.distortionScale;
            });
        transmissionFolder
            .add(this.params, "temporalDistortion")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.uniforms.temporalDistortion.value =
                this.params.temporalDistortion;
            });
        transmissionFolder
            .add(this.params, "transmission")
            .min(0.01)
            .max(1)
            .step(0.001)
            .onChange(() => {
                console.log(this.material);
                this.material.transmission =
                this.params.transmission;
            }
            );
        transmissionFolder
            .add(this.params, "roughness")
            .min(0)
            .max(1)
            .step(0.001)
            .onChange(() => {
                this.material.roughness = this.params.roughness;
            }
            );
        transmissionFolder
            .add(this.params, "thickness")
            .min(0)
            .max(10)
            .step(0.001)
            .onChange(() => {
                this.material.thickness = this.params.thickness;
            }
            );
        transmissionFolder
            .add(this.params, "ior")
            .min(1)
            .max(5)
            .step(0.001)
            .onChange(() => {
                this.material.ior = this.params.ior;
            }
            );
    }

    update()
    {
        this.material.uniforms.time.value = this.time.elapsed * 0.0001;
    }

}