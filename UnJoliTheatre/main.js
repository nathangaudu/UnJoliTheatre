import Theatre from "./Theatre.js";
import Raycaster from "./Raycaster.js";
import Controls from "./Controls.js";
import UI from "./UI.js";
import "./style.css";
import DummyBox from "./DummyBox.js";

export default class UnJoliTheatre {
    constructor({ canvas, renderer, scene, camera, orbit, production }) {
        window.unjolitheatre = this;

        this.canvas = canvas;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.orbit = orbit;
        this.production = production;

        // Theatre.js
        this.theatre = new Theatre();
        this.addToSheet = this.theatre.addToSheet; // Function to add new obj to theatre

        this.dummyBox = new DummyBox(); // create the dummy box who's equal to the camera pos

        if (this.production) return;

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
        if (this.production) return;
        this.ui.update();
    }
}
