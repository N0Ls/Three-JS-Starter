import Experience from "./Experience";

export default class AudioAnalyser {

    experience: Experience;

    fftSize: number;
    displayRes: number;

    audioCtx: AudioContext;
    audioAnalyser: AnalyserNode;
    audioData: Uint8Array;
    mediaSource: MediaStreamAudioSourceNode;

    constructor()
    {
        this.experience = Experience.getInstance();

        this.fftSize = 128;
        this.displayRes = 128;

        this.audioCtx = new AudioContext();
        this.audioAnalyser = this.audioCtx.createAnalyser();
        this.audioAnalyser.fftSize = this.fftSize;
    }

    init(){
        this.initMicrophone();
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

    updateFFT()
    {
        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
        this.audioAnalyser.getByteFrequencyData(this.audioData);
    }

    update()
    {
        // Update the analyser
        this.updateFFT();
    }

    destroy()
    {
        // destroy audio context
        this.audioAnalyser.disconnect(); 
        this.audioCtx.close();
    }
}