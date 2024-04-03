import queryString from "query-string";

const parsed = queryString.parse(location.search);
fetchWarehouseData(parsed['id']);

async function fetchWarehouseData(id) {
  // fetch from API
  console.log("Fetching warehouse data for warehouse_id : %a", id)
  const data = [
    {"name" : "item_1", "id" : 1},
    {"name" : "item_2", "id" : 2},
    {"name" : "item_3", "id" : 3},
    {"name" : "item_4", "id" : 4}
  ]

  // display data from JSON
  displayData(data)
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
