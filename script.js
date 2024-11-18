const csvUrl = "https://raw.githubusercontent.com/yourusername/yourrepository/main/yourdata.csv";
let csvData = [];

// Land use emoji mapping
const landUseEmojis = {
    "कृषि क्षेत्र": "🌾🌾🐄🌱",
    "आवासीय क्षेत्र": "🏠🏡🏘",
    "नदी, खोला, ताल, सीमसार क्षेत्र": "🏞 🌊🐋",
    "सार्वजनिक उपयोगको क्षेत्र": "👥⛲🏟",
    "वन क्षेत्र": "🐒🌲🌳🦌"
};

// Fetch CSV data on page load
document.addEventListener("DOMContentLoaded", async () => {
    showProgress(true);
    csvData = await fetchCSVData();
    populateVdcDropdown();
    showProgress(false);
});

// Show/Hide progress bar
function showProgress(show) {
    document.querySelector('.progress').style.display = show ? 'block' : 'none';
}

// Fetch and parse CSV data
async function fetchCSVData() {
    const response = await fetch(csvUrl);
    const text = await response.text();
    return text.split("\n").slice(1).map(row => {
        const [vdc, ward, parcel_id, landuse, area] = row.split(",");
        return { vdc, ward, parcel_id, landuse, area: parseFloat(area).toFixed(2) };
    });
}

// Populate VDC dropdown
function populateVdcDropdown() {
    const vdcDropdown = document.getElementById("vdc");
    const vdcOptions = [...new Set(csvData.map(item => item.vdc))].sort();
    vdcOptions.forEach(vdc => {
        const option = document.createElement("option");
        option.value = vdc;
        option.textContent = vdc;
        vdcDropdown.appendChild(option);
    });
}

// Populate Ward dropdown based on VDC selection
function populateWards() {
    const selectedVdc = document.getElementById("vdc").value;
    const wardDropdown = document.getElementById("ward");
    wardDropdown.innerHTML = '<option value="">-- Select Ward --</option>';
    if (selectedVdc) {
        const wards = [...new Set(csvData.filter(item => item.vdc === selectedVdc).map(item => item.ward))].sort();
        wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = ward;
            option.textContent = ward;
            wardDropdown.appendChild(option);
        });
    }
}

// Query the CSV data based on user inputs
function queryData() {
    const vdc = document.getElementById("vdc").value;
    const ward = document.getElementById("ward").value;
    const parcelId = document.getElementById("parcel").value.trim();
    let results = csvData;

    if (vdc) results = results.filter(item => item.vdc === vdc);
    if (ward) results = results.filter(item => item.ward === ward);
    if (parcelId) results = results.filter(item => item.parcel_id === parcelId);

    displayResults(results);
}

// Display the filtered results with emojis
function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Parcel ID</th>
                <th>Land Use</th>
                <th>Area (sq. m)</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement("tbody");
    results.forEach(row => {
        const landUseWithEmojis = `${landUseEmojis[row.landuse] || ""} ${row.landuse}`;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.parcel_id}</td>
            <td>${landUseWithEmojis}</td>
            <td>${parseFloat(row.area).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultsDiv.appendChild(table);
}
