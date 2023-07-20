import Experience from './Experience.js';
import NameText from './scene/NameText.js';
import ImagePlane from './scene/ImagePlane.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on('ready', () => {
      this.imagePlane = new ImagePlane();
      this.nameText = new NameText();

      this.initPlanes()
    });
  }

  initPlanes() {
    this.imagePlane.init();
  }

}