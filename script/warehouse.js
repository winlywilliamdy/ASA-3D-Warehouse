import queryString from "query-string";

const parsed = queryString.parse(location.search);
await fetchWarehouseData(parsed["id"]);

async function fetchWarehouseData(id) {
  var res = [];
  await fetch("http://localhost:3000/api/item/data")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data['data'].length; i++) {
        const element = data['data'][i];
        console.log(element)
        if(element['warehouseId'] == id){
          res.push({
            "name": element['item_name'],
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
    listItem.href = "./item.html?id=1";
    listItem.textContent = element["name"]; // Assuming the API returns an array of objects with a 'name' property
    dataList.appendChild(listItem);

    const breakItem = document.createElement("br");
    dataList.appendChild(breakItem);
  }
  apiDataElement.appendChild(dataList);
}
