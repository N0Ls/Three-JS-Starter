import * as THREE from 'three';
import Experience from '../Experience.js'

import basicVertexShader from '../shaders/basic/basic.vert'
import basicFragmentShader from '../shaders/basic/basic.frag'

export default class ImagePlane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.gui = this.experience.gui

        this.refAspect = 1920 / 1080

        this.debugObject = {
            progress: 0,
            progress2: 0,
        }
    }

    init(){
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setGUI()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 2, 20, 20)
    }

    setTextures()
    {
        this.texture = this.resources.items.uvTest
        this.texture.colorSpace = THREE.LinearSRGBColorSpace
        this.texture.SRGBColorSpace = true
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            uniforms:
            {
                progress : { value: 0 },
                progress2 : { value: 1 },
                tTexture: { value: this.texture },
            },
            vertexShader: basicVertexShader,
            fragmentShader: basicFragmentShader,
            side: THREE.DoubleSide,
        })
        this.material.wireframe = false
        this.material.needsUpdate = true
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        // this.mesh.position.set(0, -1.1, 0)
        // this.mesh.rotation.x = -Math.PI * 0.5
        this.scene.add(this.mesh)
    }

    setGUI()
    {
        this.gui.add(this.debugObject, 'progress').min(0).max(1).step(0.001).onChange(() =>
        {
            this.material.uniforms.progress.value = this.debugObject.progress
        }
        )
        this.gui.add(this.debugObject, 'progress2').min(0).max(1).step(0.001).onChange(() =>
        {
            this.material.uniforms.progress2.value = this.debugObject.progress2
        }
        )
    }


}