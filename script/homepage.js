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

 fetchData();


async function fetchData() {
  try {
    var res = [];
    await fetch("http://localhost:3000/api/patient/data")
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data["data"].length; i++) {
          const element = data["data"][i];
          res.push({
            id: element["id"],
            name: element["firstname"] + " " +element['lastname'] + " " + "(" + element['sex'] + ")",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error, e.g., display error message on the webpage
  }

  displayData(res)
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
    listItem.href = "./patient?id=" + element['id'];
    listItem.textContent = element["name"]; // Assuming the API returns an array of objects with a 'name' property
    dataList.appendChild(listItem);

    const breakItem = document.createElement("br");
    dataList.appendChild(breakItem);
  }
  apiDataElement.appendChild(dataList);
}
