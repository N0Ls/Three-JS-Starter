export default [
  {
    name: 'uvTest',
    type: 'texture',
    path: './textures/uv-test.png'
  },
  {
    name: 'thomasHelmet',
    type: 'gltfModel',
    path: './models/thomas-helmet/thomas-helmet.gltf'
  },
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path:
    [
        './textures/environmentMap/px.jpg',
        './textures/environmentMap/nx.jpg',
        './textures/environmentMap/py.jpg',
        './textures/environmentMap/ny.jpg',
        './textures/environmentMap/pz.jpg',
        './textures/environmentMap/nz.jpg'
    ]
}
];