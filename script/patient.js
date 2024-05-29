import queryString from "query-string";

const parsed = queryString.parse(location.search);
await fetchWarehouseData(parsed["id"]);
await fetchPatientInfo(parsed["id"]);

async function fetchWarehouseData(id) {
  var res = [];
  await fetch("http://localhost:3000/api/visit/data")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data['data'].length; i++) {
        const element = data['data'][i];
        if(element['patientId'] == id){
          res.push({
            "name": element['visit_name'],
            "id": element['id']
          })
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    // display data from JSON
  displayData(res);
}

function displayData(data) {
  // unpack, generate item to the HTML element
  // add anchor tag to item for navigation
  console.log(data);
  const apiDataElement = document.getElementById("apiData");
  // Clear existing content
  apiDataElement.innerHTML = "";

  // Display fetched data
  const dataList = document.createElement("ul");

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const listItem = document.createElement("a");
    listItem.href = "./visit?id=" + element['id'];
    listItem.textContent = element["name"]; // Assuming the API returns an array of objects with a 'name' property
    dataList.appendChild(listItem);

    const breakItem = document.createElement("br");
    dataList.appendChild(breakItem);
  }
  apiDataElement.appendChild(dataList);
}

async function fetchPatientInfo(id) {
  try {
    var res = [];
    await fetch("http://localhost:3000/api/patient/data")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        for (let i = 0; i < data['data'].length; i++) {
          const element = data['data'][i];
          if(element['id'] == id){
            res.push({
              "name": element['firstname'] + " " + element['lastname'],
              "height": element['height'],
              "weight": element['weight'],
              "sex" : element['sex']
            })
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error, e.g., display error message on the webpage
  }

  const newItem = document.getElementById("newItem");
  newItem.href = "./new_visit?id=" + parsed["id"];
  const title = document.getElementById("patient-name");
  title.innerHTML = res[0]['name']
  const name = document.getElementById("name");
  name.innerHTML = res[0]['name']
  const sex = document.getElementById("sex");
  sex.innerHTML = res[0]['sex']
  const weight = document.getElementById("weight");
  weight.innerHTML = res[0]['weight']
  const height = document.getElementById("height");
  height.innerHTML = res[0]['height']
}

