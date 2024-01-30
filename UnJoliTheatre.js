import * as THREE from "three";
import studio from "@theatre/studio";
import { getProject, types, val } from "@theatre/core";
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
        this.fixUI();
    }

    setTheatre() {
        studio.initialize();

        const project = getProject("THREE.js x Theatre.js");

        this.sheet = project.sheet("Animated scene");
        this.sheetArr = [];

        this.addToSheet = ({ mesh, name }) => {
            const sheetObj = this.sheet.object(name, {
                position: types.compound({
                    x: types.number(mesh.position.x, {
                        nudgeMultiplier: 0.01,
                    }),
                    y: types.number(mesh.position.y, {
                        nudgeMultiplier: 0.01,
                    }),
                    z: types.number(mesh.position.z, {
                        nudgeMultiplier: 0.01,
                    }),
                }),

                rotation: types.compound({
                    x: types.number(mesh.rotation.x, {
                        nudgeMultiplier: 0.01,
                    }),
                    y: types.number(mesh.rotation.y, {
                        nudgeMultiplier: 0.01,
                    }),
                    z: types.number(mesh.rotation.z, {
                        nudgeMultiplier: 0.01,
                    }),
                }),

                scale: types.compound({
                    x: types.number(mesh.scale.x, {
                        nudgeMultiplier: 0.01,
                    }),
                    y: types.number(mesh.scale.y, {
                        nudgeMultiplier: 0.01,
                    }),
                    z: types.number(mesh.scale.z, {
                        nudgeMultiplier: 0.01,
                    }),
                }),
            });

            sheetObj.onValuesChange(({ position, rotation, scale }) => {
                mesh.position.set(position.x, position.y, position.z);
                mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                mesh.scale.set(scale.x, scale.y, scale.z);
            });

            function updateProps(intersected, mode) {
                studio.transaction(({ set }) => {
                    if (mode === "translate") {
                        set(sheetObj.props.position, {
                            x: intersected.position.x,
                            y: intersected.position.y,
                            z: intersected.position.z,
                        });
                    }

                    if (mode === "rotate") {
                        set(sheetObj.props.rotation, {
                            x: intersected.rotation.x,
                            y: intersected.rotation.y,
                            z: intersected.rotation.z,
                        });
                    }
                    if (mode === "scale") {
                        set(sheetObj.props.scale, {
                            x: intersected.scale.x,
                            y: intersected.scale.y,
                            z: intersected.scale.z,
                        });
                    }
                });
            }

            this.sheetArr.push({
                uuid: mesh.uuid,
                updateProps: updateProps,
            });
        };
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

        this.transformControl.addEventListener("objectChange", (event) => {
            const obj = this.sheetArr.find(
                (obj) => obj.uuid === this.intersected.uuid
            );

            // Update all props of theatre
            obj.updateProps(this.intersected, this.transformControl.getMode());
        });

        // set the mode
        window.addEventListener("keydown", (e) => {
            let key = e.key.toLocaleLowerCase();

            if (key === "g") this.transformControl.setMode("translate");
            if (key === "s") this.transformControl.setMode("scale");
            if (key === "r") this.transformControl.setMode("rotate");
        });
    }

    setRaycaster() {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        this.intersected = undefined;

        const originPosition = new THREE.Vector2();
        let pointerDown = false;

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

            if (
                intersects.length > 0 &&
                this.mouseDown === false &&
                this.disableRaycast === false
            ) {
                const intersectTarget = intersects.find(
                    (el) =>
                        el.object.type === "Mesh" && el.object.renderOrder === 0 // handler invisible cylinder from transformcontrol => his renderOrder = "infinity"
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

    fixUI() {
        // prevent raycasting in threejs when clicking on animate UI
        setTimeout(() => {
            const shadowroot = document.querySelector(
                "#theatrejs-studio-root"
            ).shadowRoot;

            const animateUI = shadowroot.querySelector(".sc-gEkIjz");
            animateUI.addEventListener("pointerdown", (e) => {
                e.stopPropagation();
            });
        }, 500);
    }
}
