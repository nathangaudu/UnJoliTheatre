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
    }

    setTheatre() {
        studio.initialize();

        const project = getProject("THREE.js x Theatre.js");

        this.sheet = project.sheet("Animated scene");
        this.sheetArr = [];

        this.addToSheet = ({ mesh, name, position, rotation, scale }) => {
            const sheetObj = this.sheet.object(name, {
                ...(position
                    ? {
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
                      }
                    : {}),
                ...(rotation
                    ? {
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
                      }
                    : {}),
                ...(scale
                    ? {
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
                      }
                    : {}),
            });

            sheetObj.onValuesChange(({ position, rotation, scale }) => {
                if (position) {
                    mesh.position.set(position.x, position.y, position.z);
                }

                if (rotation) {
                    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                }

                if (scale) {
                    mesh.scale.set(scale.x, scale.y, scale.z);
                }
            });

            this.sheetArr.push(sheetObj);

            const { projectId, sheetId, sheetInstanceId, objectKey } =
                sheetObj.address;

            console.log(projectId, sheetId, sheetInstanceId, objectKey);
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
                (obj) => obj.address.objectKey === this.intersected.uuid
            );

            studio.transaction(({ set }) => {
                set(obj.props.position.x, this.intersected.position.x);
                set(obj.props.position.y, this.intersected.position.y);
                set(obj.props.position.z, this.intersected.position.z);

                set(obj.props.rotation.x, this.intersected.rotation.x);
                set(obj.props.rotation.y, this.intersected.rotation.y);
                set(obj.props.rotation.z, this.intersected.rotation.z);

                set(obj.props.scale.x, this.intersected.scale.x);
                set(obj.props.scale.y, this.intersected.scale.y);
                set(obj.props.scale.z, this.intersected.scale.z);
            });
        });

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

    update() {}
}
