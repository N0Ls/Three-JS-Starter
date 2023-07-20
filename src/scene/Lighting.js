import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Lighting
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Setup
        this.setSunLight()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 2)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3, 3, 2.25)
        this.scene.add(this.sunLight)
    }
}