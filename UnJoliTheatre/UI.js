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
        this.setDrag();
        this.setCloseOpen();
        this.setUI3D();
        this.setNewRaycaster();
        this.fixUI();
    }

    setUI() {
        /**
         * HTML
         */

        // ui
        this.screenUI = document.createElement("div");
        this.screenUI.id = "unjolitheatre-ui";

        document.body.appendChild(this.screenUI);

        // button
        this.screenUI.innerHTML = `  <button><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 18 18"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M11 4.5H5A2.5 2.5 0 0 0 2.5 7v5A2.5 2.5 0 0 0 5 14.5h6a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 11 4.5M3.5 7A1.5 1.5 0 0 1 5 5.5h6A1.5 1.5 0 0 1 12.5 7v5a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 12z"/><path d="M15.728 5.58L12.75 7.517a.5.5 0 0 0-.228.414l-.027 2.612a.5.5 0 0 0 .227.425l3.004 1.952a.5.5 0 0 0 .773-.419V6a.5.5 0 0 0-.773-.42m-.226 6l-2.001-1.301l.021-2.07l1.98-1.287z"/></g></svg></button>`;

        this.interface = document.createElement("div");
        this.interface.id = "unjolitheatre";

        this.screenUI.appendChild(this.interface);

        // interface
        this.interface.innerHTML = `

            <div class="topBar">
            <p> Un Joli Theatre UI </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
            </div>        
        
        `;
        // canvas
        this.canvas2 = document.createElement("canvas");

        this.interface.appendChild(this.canvas2);
    }

    setDrag() {
        const pointer = new THREE.Vector2();

        let interfaceWidth = 0;
        let interfaceHeight = 0;

        let progressX = 0;
        let progressY = 0;

        let isDown = false;

        const topBar = document.querySelector("#unjolitheatre .topBar");

        topBar.addEventListener("pointerdown", (e) => {
            isDown = true;

            pointer.x = e.clientX;
            pointer.y = e.clientY;

            console.log(pointer);

            interfaceWidth = this.interface.getBoundingClientRect().width + 15;
            interfaceHeight =
                this.interface.getBoundingClientRect().height + 15;
        });

        window.addEventListener("pointermove", (e) => {
            if (!isDown) return;

            let x = e.clientX;
            let y = e.clientY;

            const difX = x - pointer.x;
            const difY = y - pointer.y;
            pointer.x = x;
            pointer.y = y;

            progressX = Math.max(
                0,
                Math.min(progressX + difX, window.innerWidth - interfaceWidth)
            );
            progressY = Math.max(
                0,
                Math.min(progressY + difY, window.innerHeight - interfaceHeight)
            );

            this.interface.style.transform = `translate(${progressX}px, ${progressY}px)`;
        });

        window.addEventListener("pointerup", (e) => {
            isDown = false;
        });
    }

    setCloseOpen() {
        document
            .querySelector("#unjolitheatre .topBar svg")
            .addEventListener("click", () => {
                this.interface.style.display = "none";
            });

        document
            .querySelector("#unjolitheatre-ui button")
            .addEventListener("click", () => {
                if (this.interface.style.display === "block") {
                    this.interface.style.display = "none";
                } else {
                    this.interface.style.display = "block";
                }
            });
    }

    setUI3D() {
        /**
         * THREEJS
         */

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

        // Camera Helper for the base camera
        const camHelper = new THREE.CameraHelper(this.camera);
        this.scene.add(camHelper);

        // orbit for the new cam
        this.orbit = new OrbitControls(this.camera2, this.canvas2);
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
