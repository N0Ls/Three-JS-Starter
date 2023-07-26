import * as THREE from "three";
import Experience from "../Experience.js";

import basicVertexShader from "../shaders/basic/basic.vert";
import basicFragmentShader from "../shaders/basic/basic.frag";

export default class ImagePlane
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;

        this.refAspect = 1920 / 1080;
    }

    init(){
        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
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
                tTexture: { value: this.texture },
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
        this.mesh.position.set(0, -1.1, 0);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.scene.add(this.mesh);
    }

}