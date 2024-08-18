import * as THREE from "three";
export default class Base {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.CubeTextureLoader()
		// 	.setPath('images/')
		// 	.load([
		// 		'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
		// 	])
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      10000
    );
    this.camera.position.y=0.8
    this.camera.position.z=4.5
    this.camera.updateProjectionMatrix()
    this.camera.updateProjectionMatrix()
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled=true
}

}
