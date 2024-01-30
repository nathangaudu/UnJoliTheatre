import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Raycaster from "./Raycaster";
import Controls from "./Controls";

export default class UI {
    constructor() {
        this.unjolitheatre = window.unjolitheatre;

        this.camera = this.unjolitheatre.camera;
        this.scene = this.unjolitheatre.scene;
        this.theatre = this.unjolitheatre.theatre;
        this.addToSheet = this.theatre.addToSheet;

        this.setUI();
        this.setNewRaycaster();

        this.fixUI();
    }

    setUI() {
        this.canvas2 = document.createElement("canvas");
        this.canvas2.id = "unjolitheatre-renderer";

        document.body.appendChild(this.canvas2);

        // new renderer
        this.renderer2 = new THREE.WebGLRenderer({
            canvas: this.canvas2,
        });
        this.renderer2.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer2.setClearColor("black");
        this.renderer2.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer2.toneMappingExposure = 1;

        // new camera
        this.camera2 = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera2.position.set(-10, 5, 10);
        this.camera2.lookAt(0, 0, 0);

        this.orbit = new OrbitControls(this.camera2, this.canvas2);

        this.dummyBox = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
        );

        this.scene.add(this.dummyBox);
        this.dummyBox.position.copy(this.camera.position);
        this.addToSheet({
            mesh: this.dummyBox,
            name: "Camera",
            camera: this.camera,
        });
    }

    setNewRaycaster() {
        this.controls = new Controls(this.camera2, this.canvas2, this.orbit);
        this.raycaster = new Raycaster(
            this.camera2,
            this.renderer2,
            this.controls
        );
        this.controls.raycaster = this.raycaster;
    }

    update() {
        this.renderer2.render(this.scene, this.camera2);
    }

    //// FIX THE ORIGINAL UI WHILE CLIKING ON IT

    fixUI() {
        // prevent raycasting in threejs when clicking on animate UI
        setTimeout(() => {
            document
                .querySelector("#theatrejs-studio-root")
                .addEventListener("pointerdown", (e) => {
                    e.stopPropagation();
                });
        }, 500);
    }
}
