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

    fftSize: number;
    displayRes: number;
    
    constructor()
    {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;

        this.audioFile = this.resources.items.testAudio;

        this.fftSize = 128;
        this.displayRes = 128;

        this.audioCtx = new AudioContext();
        this.audioAnalyser = this.audioCtx.createAnalyser();
        this.audioAnalyser.fftSize = this.fftSize;
    }

    init(){
        this.initMicrophone();
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    initMicrophone() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            const constraints = 
            { 
                audio: true,
                video: false 
            };
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

                this.mediaSource = this.audioCtx.createMediaStreamSource(stream);
                this.mediaSource.connect(this.audioAnalyser);

                // Display sample rate
                // console.log("Sample rate :", stream.getAudioTracks()[0].getSettings().sampleRate);

                // Display browser capabilities
                // let track = stream.getAudioTracks()[0];
                // console.log(track.getCapabilities());

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
        this.geometry = new THREE.PlaneGeometry(8, 4, 1, 1);
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
        // Update the analyser and the uniforms
        this.updateFFT();
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