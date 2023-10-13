import * as THREE from "three";
import Experience from "../Experience.js";

import basicVertexShader from "../shaders/basic/basic.vert";
import audioDataFragmentShader from "../shaders/audioData/audioData.frag";
import Sizes from "../utils/Sizes.js";

export default class AudioData
{
    experience: Experience;
    scene: THREE.Scene;
    resources: any;
    sizes: Sizes;

    geometry: THREE.PlaneGeometry;
    texture: THREE.Texture;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;

    audioFile: any;
    audioAnalyser: any;
    
    constructor()
    {
        this.experience = Experience.getInstance();
        this.audioAnalyser = this.experience.audioAnalyser;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;

        this.audioFile = this.resources.items.testAudio;

    }

    init(){
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry()
    {
        //Basic plane
        this.geometry = new THREE.PlaneGeometry(8, 4, 1, 1);
    }

    setMaterial()
    {
        //Check webgl 2 compatibility
        const format = ( this.experience.renderer.instance.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

        // Uniforms object
        const uniforms = {
            tAudioData: { value: new THREE.DataTexture(this.audioAnalyser.audioData, this.audioAnalyser.displayRes / 2, 1, format ) }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: basicVertexShader,
            fragmentShader: audioDataFragmentShader,
            side: THREE.DoubleSide,
        });
        this.material.needsUpdate = true;
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -2);
        this.scene.add(this.mesh);
    }


    update()
    {
        this.material.uniforms.tAudioData.value.image.data = this.audioAnalyser.audioData;
        this.material.uniforms.tAudioData.value.needsUpdate = true;
    }

}