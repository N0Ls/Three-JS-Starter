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
    audioCtx: AudioContext;
    audioAnalyser: AnalyserNode;
    audioData: Uint8Array;
    mediaSource: MediaStreamAudioSourceNode;
    sound: THREE.Audio;
    listener: THREE.AudioListener;
    analyser: THREE.AudioAnalyser;

    fftSize: number;
    displayRes: number;
    
    constructor()
    {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;

        this.audioFile = this.resources.items.testAudio;

        this.listener = new THREE.AudioListener();
        // this.experience.camera.instance.add( this.listener );

        this.fftSize = 512;
        this.displayRes = 64;

        this.audioCtx = new AudioContext();
        this.audioAnalyser = this.audioCtx.createAnalyser();
        this.audioAnalyser.fftSize = this.fftSize;
    }

    init(){
        //this.setAudio();
        this.initMicrophone();
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setAudio()
    {
        // Create audio source
        this.sound = new THREE.Audio(this.listener);
        this.sound.setBuffer( this.audioFile );
        this.sound.setVolume(0.5);
        this.sound.setLoop(true);
        this.sound.play();

        // Add audio analyser
        this.analyser = new THREE.AudioAnalyser( this.sound, this.fftSize );
    }

    initMicrophone() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            navigator.mediaDevices.getUserMedia({ audio: true, video : false }).then((stream) => {

                this.mediaSource = this.audioCtx.createMediaStreamSource(stream);
                this.mediaSource.connect(this.audioAnalyser);
                // animate();
                // context.resume();
            }).catch(function (error) {

                console.error("Unable to access the microphone.", error);

            });
        }

        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
        
        this.audioAnalyser.getByteFrequencyData(this.audioData);
    }


    setGeometry()
    {
        //Basic plane
        this.geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    }

    setMaterial()
    {
        //Check webgl 2 compatibility
        const format = ( this.experience.renderer.instance.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

        // Uniforms object
        const uniforms = {
            tAudioData: { value: new THREE.DataTexture(this.audioData, this.displayRes / 2, 1, format ) }
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

    updateFFT()
    {
        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
        
        this.audioAnalyser.getByteFrequencyData(this.audioData);
        
    }

    update()
    {
        this.updateFFT();
        // Update the analyser and the uniforms
        // this.analyser.getFrequencyData();
        this.material.uniforms.tAudioData.value.image.data = this.audioData;
        this.material.uniforms.tAudioData.value.needsUpdate = true;
    }

    destroy()
    {
        this.scene.remove(this.mesh);

        // destroy audio context
        this.audioAnalyser.disconnect(); 
        this.audioCtx.close();
        //dispose audio

    }

}