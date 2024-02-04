import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertex from "./shaders/vertex.glsl?raw";
import fragment from "./shaders/fragment.glsl?raw";
import GUI from "lil-gui";
import Stats from "./Stats";
import UnJoliTheatre from "./UnJoliTheatre/main.js";

class Experience {
    constructor(canvas) {
        window.experience = this;

        this.canvas = canvas;

        this.scene = new THREE.Scene();

        this.setRenderer();
        this.setMesh();
        this.setCamera();
        this.setLights();
        this.setEvents();
        this.setDebug();
        this.setTick();
    }

    setMesh() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({
                color: "hotpink",
            })
        );
        this.mesh.name = "My Rectangle";

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);

        this.ground = new THREE.Mesh(
            new THREE.CircleGeometry(5, 48),
            new THREE.MeshStandardMaterial({ color: "white" })
        );

        this.ground.position.y = -1;
        this.ground.rotation.x = -Math.PI / 2;

        this.ground.receiveShadow = true;

        this.scene.add(this.ground);
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 2, 10);

        // const controls = new OrbitControls(this.camera, this.canvas);
        // controls.enableDamping = true;
        // controls.target.set(0, -2, 0);
        // controls.enabled = false;

        // this.controls = controls;

        this.updateControls = function (deltaTime) {
            // controls.dampingFactor = deltaTime * 5;
            // controls.update();
        };
    }

    setLights() {
        this.dir = new THREE.DirectionalLight();
        this.dir.position.set(1.76, 2.26, 2.38);
        this.dir.castShadow = true;
        this.dir.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);
        this.scene.add(this.dir);

        this.dirHelp = new THREE.DirectionalLightHelper(this.dir);
        this.scene.add(this.dirHelp);

        this.pointLight = new THREE.SpotLight();
        this.pointLightHelp = new THREE.SpotLightHelper(this.pointLight);
        this.scene.add(this.pointLight, this.pointLightHelp);

        this.ambient = new THREE.AmbientLight();
        this.scene.add(this.ambient);
    }

    setEvents() {
        this.resize = this.resize.bind(this);
        window.addEventListener("resize", this.resize);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor("black");
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
    }

    setTick() {
        /**
         * Stats
         */
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        /**
         * RAF
         */
        this.previousTime = 0;

        this.tick = this.tick.bind(this);
        requestAnimationFrame(this.tick);
    }

    tick(t) {
        this.stats.begin();

        this.elapsedTime = t / 1000;
        this.deltaTime = this.elapsedTime - this.previousTime;
        this.previousTime = this.elapsedTime;

        this.renderer.render(this.scene, this.camera);

        this.unJoliTheatre.update();

        this.updateControls(this.deltaTime);

        this.stats.end();
        requestAnimationFrame(this.tick);
    }

    setDebug() {
        const gui = new GUI();
        gui.close();

        const dirFolder = gui.addFolder("Directional light");

        dirFolder
            .add(this.dir.position, "x", 0, 10)
            .onChange(() => this.dir.lookAt(0, 0, 0));
        dirFolder
            .add(this.dir.position, "y", 0, 10)
            .onChange(() => this.dir.lookAt(0, 0, 0));
        dirFolder
            .add(this.dir.position, "z", 0, 10)
            .onChange(() => this.dir.lookAt(0, 0, 0));

        // Theatre part

        this.unJoliTheatre = new UnJoliTheatre({
            canvas: this.canvas,
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            // orbit: // this.controls // if you use orbit control, add it here
            production: false, // set to false to enable the ui
        });

        this.unJoliTheatre.addToSheet({
            mesh: this.mesh,
            name: "Box",
        });

        this.unJoliTheatre.addToSheet({
            mesh: this.dir,
            name: this.dir.type,
        });

        this.unJoliTheatre.addToSheet({
            mesh: this.pointLight,
            name: this.pointLight.type,
        });
    }
}

const experience = new Experience(document.querySelector("canvas"));
