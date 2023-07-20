import Experience from './Experience.js'

export default class App {

  constructor({ canvas }) {
    this.canvas = canvas

    this.experience = new Experience(this.canvas)
  }
  
  destroy() {
    this.experience.destroy()
    this.experience = null
  }
  
}

const canvas = document.querySelector('canvas');
const app = new App({
    canvas
});