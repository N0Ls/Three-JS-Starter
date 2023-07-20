import EventEmitter from './EventEmitter.js'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()

        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.fontLoader = new FontLoader();
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                      this.sourceLoaded(source, file)
                    },
                )
            }
            else if(source.type === 'font')
            {
                this.fontLoader.load(
                    source.path.default,
                    (file) =>
                    {
                      this.sourceLoaded(source, file)
                    },
                    ( xhr ) => {

                    },
                    ( err ) => {
                        console.log( 'An error happened' + err );
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}