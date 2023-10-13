export default [
    {
        name: "uvTest",
        type: "texture",
        path: "./textures/uv-test.png"
    },
    {
        name: "thomasHelmet",
        type: "gltfModel",
        path: "./models/thomas-helmet/thomas-helmet.gltf"
    },
    {
        name: "nameFont",
        type: "font",
        path : "./fonts/Montserrat_Bold.json"
    },
    {
        name: "environmentMapTexture",
        type: "cubeTexture",
        path:
    [
        "./textures/environmentMap/px.jpg",
        "./textures/environmentMap/nx.jpg",
        "./textures/environmentMap/py.jpg",
        "./textures/environmentMap/ny.jpg",
        "./textures/environmentMap/pz.jpg",
        "./textures/environmentMap/nz.jpg"
    ]
    },
    {
        name: "ambientSound",
        type: "audio",
        path: "./sounds/ambient-main.mp3"
    },
    {
        name: "testAudio",
        type: "audioTex",
        path: "./sounds/ambient-main.mp3"
    }
];