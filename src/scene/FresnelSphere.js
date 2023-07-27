import * as THREE from "three";
import Experience from "../Experience.js";

import basicVertexShader from "../shaders/fresnel/fresnel.vert";
import basicFragmentShader from "../shaders/fresnel/fresnel.frag";


export default class FresnelSphere
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;

        this.fresnelSettings = {
            mRefractionRatio: 1.02,
            mFresnelBias: 0.1,
            mFresnelScale: 4.0, //2.0 - default
            mFresnelPower: 2.0, //1.0 - default
        };

        this.colorFactor = 0;

        this.time.on("tick", () => {
            this.update();
        });
    }

    addCubeRenderTarget() {
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilter,
            encoding: THREE.SRGBColorSpace,
        });
    
        this.cubeCamera = new THREE.CubeCamera(0.1, 1200, this.cubeRenderTarget);
        //this.setTCube(this.resources.items.environmentMapTexture);
        this.setTCube(this.cubeRenderTarget.texture);

    }

    setTCube(tCube) {
        if (this.material) {
            console.log("setTCube");
            console.log(tCube);
            this.material.uniforms.tCube.value = tCube;
        }
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
                uTime: { value: 0 },
                tCube: { value: 0 },
                uColorFactor: { value: this.colorFactor },
                mRefractionRatio: { value: this.fresnelSettings.mRefractionRatio },
                mFresnelBias: { value: this.fresnelSettings.mFresnelBias },
                mFresnelScale: { value: this.fresnelSettings.mFresnelScale },
                mFresnelPower: { value: this.fresnelSettings.mFresnelPower },
            },
            vertexShader: basicVertexShader,
            fragmentShader: basicFragmentShader,
            side: THREE.FrontSide,
        });
        this.material.needsUpdate = true;
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(5 , 5, 5);
        this.scene.add(this.mesh);

        this.addCubeRenderTarget();
    }

    setGUI()
    {
        this.gui = this.experience.gui;

        const fresnelFolder = this.gui.addFolder("Fresnel");
        fresnelFolder.add(this.fresnelSettings, "mRefractionRatio").min(0).max(1).step(0.001).name("mRefractionRatio").onChange(() => {
            this.material.uniforms.mRefractionRatio.value = this.fresnelSettings.mRefractionRatio;
        });
        fresnelFolder.add(this.fresnelSettings, "mFresnelBias").min(0).max(1).step(0.001).name("mFresnelBias").onChange(() => {
            this.material.uniforms.mFresnelBias.value = this.fresnelSettings.mFresnelBias;
        });
        fresnelFolder.add(this.fresnelSettings, "mFresnelScale").min(0).max(10).step(0.001).name("mFresnelScale").onChange(() => {
            this.material.uniforms.mFresnelScale.value = this.fresnelSettings.mFresnelScale;
        });
        fresnelFolder.add(this.fresnelSettings, "mFresnelPower").min(0).max(10).step(0.001).name("mFresnelPower").onChange(() => {
            this.material.uniforms.mFresnelPower.value = this.fresnelSettings.mFresnelPower;
        });
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
        if (this.cubeRenderTarget && this.cubeCamera) {
            //Fixs feedback loop, because now it does not need itself in order to draw the rest of the scene
            this.visible = false;
            this.cubeCamera.update(this.experience.renderer.instance, this.scene);
            this.visible = true;
        }
    }

}