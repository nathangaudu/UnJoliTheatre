import Theatre from "./Theatre.js";
import Raycaster from "./Raycaster.js";
import Controls from "./Controls.js";
import UI from "./UI.js";

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
        this.raycaster = new Raycaster();

        this.controls = new Controls(canvas, camera, this.scene);

        this.ui = new UI();
    }

    update() {
        this.ui.update();
    }
}
