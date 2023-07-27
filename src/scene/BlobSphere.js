import * as THREE from "three";
import Experience from "../Experience.js";

import basicVertexShader from "../shaders/blob/basic.vert";
import basicFragmentShader from "../shaders/blob/basic.frag";


export default class BlobSphere
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
        this.material = new THREE.ShaderMaterial({
            uniforms:
            {
                uColor1 : { value: new THREE.Color(0xff8c2e) },
                uColor2 : { value: new THREE.Color(0x7300ff) },
                uColorAccent : { value: new THREE.Color(0xf18cf2) },
                uTime : { value: 0 },
            },
            vertexShader: basicVertexShader,
            fragmentShader: basicFragmentShader,
            side: THREE.DoubleSide,
        });
        this.material.needsUpdate = true;
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(1000, 1000, 1000);
        this.scene.add(this.mesh);
    }

    setGUI()
    {
        this.gui = this.experience.gui;
        this.params = {
            color1: "#ff8c2e",
            color2: "#7300ff",
            colorAccent: "#f18cf2",
        };
        this.gui.addColor(this.params, "color1").onChange(() => {
            this.material.uniforms.uColor1.value.set(this.params.color1);
        });
        this.gui.addColor(this.params, "color2").onChange(() => {
            this.material.uniforms.uColor2.value.set(this.params.color2);
        });
        this.gui.addColor(this.params, "colorAccent").onChange(() => {
            this.material.uniforms.uColorAccent.value.set(this.params.colorAccent);
        });
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
    }

}