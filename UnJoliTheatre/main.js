import Theatre from "./Theatre.js";
import Raycaster from "./Raycaster.js";
import Controls from "./Controls.js";
import UI from "./UI.js";
import "./style.css";

export default class TransformTheatre {
    constructor(canvas, renderer, scene, camera, orbit) {
        window.unjolitheatre = this;

        this.canvas = canvas;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.orbit = orbit;

        // Theatre.js
        this.theatre = new Theatre();
        this.addToSheet = this.theatre.addToSheet; // Function to add new obj to theatre

        // Raycaster.js
        this.controls = new Controls(this.camera, this.canvas, this.orbit);

        this.raycaster = new Raycaster(
            this.camera,
            this.renderer,
            this.controls
        );
        this.controls.raycaster = this.raycaster;

        this.ui = new UI();
    }

    update() {
        this.ui.update();
    }
}
