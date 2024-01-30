import studio from "@theatre/studio";
import { getProject, types, val } from "@theatre/core";

export default class Theatre {
    constructor() {
        window.unjolitheatre.theatre = this;

        this.setTheatre();
    }

    setTheatre() {
        studio.initialize();

        const project = getProject("THREE.js x Theatre.js");

        this.sheet = project.sheet("Animated scene");
        this.sheetArr = [];
    }

    addToSheet = ({ mesh, name, camera }) => {
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

            ...(!camera
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

        // changes from theatre UI
        sheetObj.onValuesChange(({ position, rotation, scale }) => {
            mesh.position.set(position.x, position.y, position.z);
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);
            if (!camera) mesh.scale.set(scale.x, scale.y, scale.z);

            if (camera) {
                camera.position.copy({
                    x: position.x,
                    y: position.y,
                    z: position.z,
                });

                camera.lookAt(rotation.x, rotation.y, rotation.z);
            }
        });

        // changes from transformControls
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
                // update the cam position
                if (camera) {
                    camera.position.copy({
                        x: intersected.position.x,
                        y: intersected.position.y,
                        z: intersected.position.z,
                    });

                    camera.lookAt(
                        intersected.rotation.x,
                        intersected.rotation.y,
                        intersected.rotation.z
                    );
                }
            });
        }

        this.sheetArr.push({
            uuid: mesh.uuid,
            updateProps: updateProps,
        });
    };
}
