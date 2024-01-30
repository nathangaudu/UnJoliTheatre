import { TransformControls } from "three/addons/controls/TransformControls.js";

export default class Controls {
    constructor(canvas, camera, scene) {
        window.unjolitheatre.controls = this;

        this.unjolitheatre = window.unjolitheatre;
        this.theatre = this.unjolitheatre.theatre;
        this.raycaster = this.unjolitheatre.raycaster;

        this.scene = this.unjolitheatre.scene;
        this.camera = this.unjolitheatre.camera;
        this.canvas = this.unjolitheatre.canvas;
        this.orbit = this.unjolitheatre.orbit;

        this.sheetArr = this.theatre.sheetArr;

        this.setControls();
    }

    setControls() {
        this.transformControl = new TransformControls(this.camera, this.canvas);

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
                (obj) => obj.uuid === this.raycaster.intersected.uuid
            );

            // // Update all props of theatre
            obj.updateProps(
                this.raycaster.intersected,
                this.transformControl.getMode()
            );
        });

        // set the mode
        window.addEventListener("keydown", (e) => {
            let key = e.key.toLocaleLowerCase();

            if (key === "g") this.transformControl.setMode("translate");
            if (key === "s") this.transformControl.setMode("scale");
            if (key === "r") this.transformControl.setMode("rotate");
        });
    }
}
