import * as THREE from "three";

export default class Raycaster {
    constructor() {
        window.unjolitheatre.raycaster = this;

        this.unjolitheatre = window.unjolitheatre;
        this.controls = this.unjolitheatre.controls;
        this.scene = this.unjolitheatre.scene;
        this.camera = this.unjolitheatre.camera;
        this.scene = this.unjolitheatre.scene;

        this.sheetArr = this.unjolitheatre.theatre.sheetArr;

        this.setRaycaster();
    }

    setRaycaster() {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        this.intersected = undefined;

        const originPosition = new THREE.Vector2();
        let pointerDown = false;

        this.disableRaycast = false;

        // Handle drag
        window.addEventListener("pointerdown", (e) => {
            pointerDown = true;
            this.disableRaycast = false;

            originPosition.x = e.clientX;
            originPosition.y = e.clientY;
        });

        window.addEventListener("pointermove", (e) => {
            if (!pointerDown) return;

            let totalDragged =
                Math.abs(originPosition.x - e.clientX) +
                Math.abs(originPosition.y - e.clientY);

            if (totalDragged > 30) {
                this.disableRaycast = true;
            }
        });

        window.addEventListener("pointerup", (e) => {
            pointerDown = false;

            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // update the picking ray with the camera and pointer position
            raycaster.setFromCamera(pointer, this.camera);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(this.scene.children);

            // define controls
            this.controls = window.unjolitheatre.controls;

            if (
                intersects.length > 0 &&
                this.controls.mouseDown === false &&
                this.disableRaycast === false
            ) {
                const intersectTarget = intersects.find(
                    (el) =>
                        el.object.type === "Mesh" && el.object.renderOrder === 0 // handler invisible cylinder from transformcontrol => his renderOrder = "infinity"
                );

                if (intersectTarget) {
                    // verify if the intersect is added to theatre
                    const abc = this.sheetArr.find(
                        (el) => el.uuid === intersectTarget.object.uuid
                    );
                    if (!abc) return;

                    this.intersected = intersectTarget.object;
                    this.controls.transformControl.attach(this.intersected);
                } else {
                    this.controls.transformControl.detach(this.intersected);
                }
            }
        });
    }
}
