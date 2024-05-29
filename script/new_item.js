import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdXlq4uLz8FTviHjI1JED1YSXHwzdrBe8",
  authDomain: "asa-3d-warehouse.firebaseapp.com",
  projectId: "asa-3d-warehouse",
  storageBucket: "gs://asa-3d-warehouse.appspot.com",
  messagingSenderId: "491550271555",
  appId: "1:491550271555:web:5ac5768db1e47178128cf6",
};

const firebase = initializeApp(firebaseConfig);

async function getItemValues() {
  var visitName = document.getElementById("visitName").value;
  var weight = document.getElementById("weight").value;
  var height = document.getElementById("height").value;
  var note = document.getElementById("note").value;
  var objVal = document.getElementById("objFile");
  var mtlVal = document.getElementById("mtlFile");
  var pngVal = document.getElementById("pngFile");
  var objURL;
  var mtlURL;
  var pngURL;

  // Do something with the input values
  var objFile = objVal.files[0];
  var mtlFile = mtlVal.files[0];
  var pngFile = pngVal.files[0];

  const storage = getStorage(firebase);
  const objRef = ref(storage, "obj/" + objFile.name);
  const mtlRef = ref(storage, "mtl/" + mtlFile.name);
  const pngRef = ref(storage, "png/" + pngFile.name);

  await upload(objRef, objFile).then((url) => {
    objURL = url;
  });
  await upload(mtlRef, mtlFile).then((url) => {
    mtlURL = url;
  });
  await upload(pngRef, pngFile).then((url) => {
    pngURL = url;
  });

  // POST to API
  var patientName = document.getElementById("patientName");

  var body = {
    visit_name: visitName,
    threed_obj: objURL + "," + mtlURL + "," + pngURL,
    patientId: parseInt(patientName.value),
    doctorId: 1,
    notes: note,
    width: parseFloat(weight),
    height: parseFloat(height),
  };

  console.log(body);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), // Convert the JavaScript object to a JSON string
  };

  await fetch("http://localhost:3000/api/visit/create", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("Success:", data); // Handle the JSON data
    })
    .catch((error) => {
      console.error("Error:", error); // Handle any errors
    });
}

async function generateOptions() {
  var patientName = document.getElementById("patientName");
  var res = [];
  await fetch("http://localhost:3000/api/patient/data")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data["data"].length; i++) {
        const element = data["data"][i];
        var option = document.createElement("option");
        option.value = element["id"];
        option.textContent = element["firstname"] + " " + element["lastname"];

        patientName.appendChild(option);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function upload(ref, file) {
  return new Promise((resolve, reject) => {
    var url;
    const uploadTask = uploadBytesResumable(ref, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        reject(error);
      },
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

document.getElementById("myButton").addEventListener("click", getItemValues);
await generateOptions();
