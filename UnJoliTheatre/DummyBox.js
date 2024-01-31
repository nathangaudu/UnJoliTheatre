import * as THREE from "three";

export default class DummyBox {
    constructor() {
        this.unjolitheatre = window.unjolitheatre;

        this.camera = this.unjolitheatre.camera;
        this.scene = this.unjolitheatre.scene;
        this.theatre = this.unjolitheatre.theatre;
        this.addToSheet = this.theatre.addToSheet;

        this.setDummyBox();
    }

    setDummyBox() {
        this.dummyBox = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({
                color: "red",
                wireframe: true,
                visible: false,
            })
        );

        this.scene.add(this.dummyBox);
        this.dummyBox.position.copy(this.camera.position);
        this.addToSheet({
            mesh: this.dummyBox,
            name: "Camera",
            camera: this.camera,
        });
    }
}
