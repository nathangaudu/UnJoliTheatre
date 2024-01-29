import * as THREE from "three";
import studio from "@theatre/studio";
import { getProject } from "@theatre/core";
import { TransformControls } from "three/addons/controls/TransformControls.js";

export default class TransformTheatre {
    constructor(renderer, scene, camera, orbit) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.orbit = orbit;

        this.setTheatre();
        this.setTranformControls();
        this.setRaycaster();
    }

    setTheatre() {
        studio.initialize();

        const project = getProject("THREE.js x Theatre.js");

        const sheet = project.sheet("Animated scene");
    }

    setTranformControls() {
        this.transformControl = new TransformControls(
            this.camera,
            this.renderer.domElement
        );

        this.scene.add(this.transformControl);

        // set var
        this.isTransform = false;
        this.mouseDown = false;
        this.disableRaycast = false;

        // set event
        this.transformControl.addEventListener("dragging-changed", (event) => {
            this.orbit.enabled = !event.value;
        });

        this.transformControl.addEventListener("mouseDown", (event) => {
            this.mouseDown = true;
        });

        this.transformControl.addEventListener("mouseUp", (event) => {
            this.mouseDown = false;
        });

        this.transformControl.addEventListener("objectChange", (event) => {});

        window.addEventListener("keydown", (e) => {
            let key = e.key.toLocaleLowerCase();

            if (key === "g") this.transformControl.setMode("translate");
            if (key === "s") this.transformControl.setMode("scale");
            if (key === "r") this.transformControl.setMode("rotate");
            if (key === " ") this.disableRaycast = true;
        });

        window.addEventListener("keyup", (e) => {
            let key = e.key.toLocaleLowerCase();

            if (key === " ") this.disableRaycast = false;
        });
    }

    setRaycaster() {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        this.intersected = undefined;

        window.addEventListener("pointerdown", (e) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // update the picking ray with the camera and pointer position
            raycaster.setFromCamera(pointer, this.camera);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(this.scene.children);

            if (
                intersects.length > 0 &&
                this.mouseDown === false &&
                this.disableRaycast === false
            ) {
                const intersectTarget = intersects.find(
                    (el) => el.object.type === "Mesh"
                );

                if (intersectTarget) {
                    this.intersected = intersectTarget.object;
                    this.transformControl.attach(this.intersected);
                } else {
                    this.transformControl.detach(this.intersected);
                }
            }
        });
    }

    update() {}
}
