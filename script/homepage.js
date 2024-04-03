function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  var content = document.getElementById("content");

  if (sidebar.style.left === "-200px") {
    sidebar.style.left = "0";
    content.style.marginLeft = "250px";
  } else {
    sidebar.style.left = "-200px";
    content.style.marginLeft = "50";
  }
}

// document.addEventListener("DOMContentLoaded", fetchData);
fetchData();

async function fetchData() {
  try {
    //   const response = await fetch("https://api.example.com/data");
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch data");
    //   }
    //   const data = await response.json();
    const data = [{ "name": "warehouse_1" }, { "name": "warehouse_2" }];
    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error, e.g., display error message on the webpage
  }
}

function displayData(data) {
  console.log(data);
  const apiDataElement = document.getElementById("apiData");
  // Clear existing content
  apiDataElement.innerHTML = "";

  // Display fetched data
  const dataList = document.createElement("ul");

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const listItem = document.createElement("a");
    listItem.href = "./warehouse.html?id=42"
    listItem.textContent = element['name']; // Assuming the API returns an array of objects with a 'name' property
    dataList.appendChild(listItem);

    const breakItem = document.createElement("br");
    dataList.appendChild(breakItem)
  }
  apiDataElement.appendChild(dataList)
}
