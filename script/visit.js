import * as THREE from "three";
import { initializeApp } from "firebase/app";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import queryString from "query-string";


const parsed = queryString.parse(location.search);
var modelLink = await fetchVisitInfo(parsed["id"]);

let camera, scene, renderer;
await downloadModels(modelLink);

async function downloadModels(link) {
  console.log("Downloading...");
  var obj = await download("gundam", "obj",link);
  // var mtl = await download("gundam", "mtl");
  // var jpg = await download("gundam", "png");
  console.log("Finished...");
  init(obj);
}

async function download(filename, type, link) {
  const firebaseConfig = {
    apiKey: "AIzaSyAdXlq4uLz8FTviHjI1JED1YSXHwzdrBe8",
    authDomain: "asa-3d-warehouse.firebaseapp.com",
    projectId: "asa-3d-warehouse",
    storageBucket: "gs://asa-3d-warehouse.appspot.com",
    messagingSenderId: "491550271555",
    appId: "1:491550271555:web:5ac5768db1e47178128cf6",
  };

  const firebase = initializeApp(firebaseConfig);
  const storage = getStorage(firebase);
  return new Promise((resolve, reject) => {
    getDownloadURL(ref(storage, type + "/" + filename + "." + type))
      .then((url) => {
        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
          resolve(blob);
        };
        xhr.open("GET", link);
        xhr.send();
      })
      .catch((error) => {
        // Handle any errors
        console.log(error);
        reject(error);
      });
  });
}

async function init(obj, 
  // mtl, 
  // jpg
  ) {
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.z = 1;
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth / 3, window.innerHeight * 0.8);
  renderer.setClearColor(0x00000, 0.5);
  const element3d = document.getElementById("model-3d");
  element3d.appendChild(renderer.domElement);

  const manager = new THREE.LoadingManager();
  const objectsURL = [];
  const blobs = { 
    // "3DModel.mtl": mtl, 
    "3DModel.obj": obj, 
    // "3DModel.jpg": jpg 
  };
  const objectURLs = [];

  manager.setURLModifier((url) => {
    url = URL.createObjectURL(blobs[url]);
    objectURLs.push(url);
    return url;
  });

  const loader = new OBJLoader(manager);
  loader.load("3DModel.obj", (obj) => {
    // const mtlLoader = new MTLLoader(manager)
    // mtlLoader.load("3DModel.mtl", function (materials){
    //   loader.setMaterials(materials)
    // })
    scene.add(obj);
    objectsURL.forEach((url) => URL.revokeObjectURL(url));
  });

  // const loader = new MTLLoader(manager);
  // loader.load("3DModel.mtl", function (materials){
  //   const objLoader = new OBJLoader();
  //   objLoader.setMaterials(materials);
  //   objLoader.load("3DModel.obj", function(object){
  //     scene.add(object)
  //   })
  //   scene.add(mtl);
  //   objectsURL.forEach((url) => URL.revokeObjectURL(url));
  // });

  const pointLight = new THREE.DirectionalLight(0xffffff, 2);
  camera.add(pointLight);
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0;
  controls.maxDistance = 4;
  controls.autoRotate = true;

  window.addEventListener("resize", onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

async function fetchVisitInfo(id) {
  console.log(id)
  var res = [];
  await fetch("http://localhost:3000/api/visit/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      for (let i = 0; i < data["data"].length; i++) {
        const element = data["data"][i];
        if (element["id"] == id) {
          res.push(element)
        }
      }

      console.log(res)

      const visit_code = document.getElementById("visit_code");
      visit_code.innerHTML = res[0]['visitcode']
      const weight = document.getElementById("weight");
      weight.innerHTML = res[0]['width']
      const height = document.getElementById("height");
      height.innerHTML = res[0]['height']
      const note = document.getElementById("note");
      note.innerHTML = res[0]['notes']
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    return res[0]['threed_obj'].split(",")
}
