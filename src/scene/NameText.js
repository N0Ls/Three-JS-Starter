import * as THREE from "three";
import Experience from "../Experience.js";

import textVertexShader from "../shaders/text/text.vert";
import textFragmentShader from "../shaders/text/text.frag";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class NameText {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;
        this.gui = this.experience.gui;

        this.params = {
            threeTextColor: new THREE.Color(0x2e2723).convertLinearToSRGB(),
        };
    }

    init(posterName) {
        this.setGeometry(posterName);
        this.setTextures();
        this.setMaterial();
        this.setMesh();

        const isDebug = true;
        if(isDebug) {
            this.setGUI();
        }
    }

    setGeometry(name) {
        let textName = name;
        if(!name) textName = "Hello World";
        this.font = this.resources.items.nameFont;
        const capitalizedName = textName.toString().toUpperCase();

        const largeLetters = ["W", "M", "G", "N", "B", "Q"];
        const lettersArray = capitalizedName.split("");
        const nbOfLargeLetters = lettersArray.filter(letter => largeLetters.includes(letter)).length;

        const nbOfLetters = capitalizedName.length;
        const fontSize = this.getSize(nbOfLetters);
        const sizeFactor = this.getSizeFactor(nbOfLargeLetters);
        this.geometry = new TextGeometry(
            capitalizedName,
            {
                font: this.font,
                size: fontSize * sizeFactor,
                height: 0.01,
                curveSegments: 12,
            }
        );
        this.geometry.center(); 
    }

    setTextures() {
    }

    setMaterial() {
        const alphaTexture = this.resources.items.textAlphaTexture;
        this.textShader = {
            uniforms:
      {
          tAlphaTexture: { value: alphaTexture },
          uColor : { value: new THREE.Color(0x2e2723).convertLinearToSRGB() },
      },
            //blending:THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexShader: textVertexShader,
            fragmentShader: textFragmentShader
        };

        this.material = new THREE.ShaderMaterial(this.textShader);
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = -1.565;
        this.mesh.position.z = 0.92;
        this.mesh.scale.y = 1.1;
        this.scene.add(this.mesh);
        this.mesh.visible = true;
    }

    setGUI() {
        this.gui.addColor(this.params, "threeTextColor").onChange(() => {
            this.material.uniforms.uColor.value.set(this.params.threeTextColor);
        });
        this.gui.add(this.mesh.position, "y").min(-1.6).max(-1.4).step(0.0001).name("nameTextY");
    }

    getSize(nbOfLetters) {
        switch (nbOfLetters) {
        case 6:
            return 0.2;
        case 7:
            return 0.19;
        case 8:
            return 0.17;
        case 9:
            return 0.156;
        case 10:
            return 0.14;
        case 11:
            return 0.13;
        case 12:
            return 0.12;
        case 13:
            return 0.11;
        case 14:
            return 0.1;
        case 15:
            return 0.1;
        default:
            return 0.2;
        }
    }

    getSizeFactor(nbOfLargeLetters) {
        switch (nbOfLargeLetters) {
        case 1:
            return 0.98;
        case 2:
            return 0.97;
        case 3:
            return 0.95;
        case 4:
            return 0.9;
        case 5:
            return 0.9;
        case 6:
            return 0.85;
        case 7:
            return 0.8;
        case 8:
            return 0.75;
        case 9:
            return 0.75;
        default:
            return 0.75;
        }
    }
}