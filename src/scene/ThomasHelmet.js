import * as THREE from 'three';
import Experience from '../Experience.js'

import basicVertexShader from '../shaders/basic/basic.vert'
import basicFragmentShader from '../shaders/basic/basic.frag'

export default class ThomasHelmet
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resource = this.resources.items.thomasHelmet
        this.sizes = this.experience.sizes

    }

    init(){
        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        //this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)
    }
}