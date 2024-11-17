try {
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  data = await response.json();
} catch (error) {
  console.error('Error fetching data:', error);
  alert(`Failed to load data: ${error.message}`);
}


document.addEventListener('DOMContentLoaded', async function () {
  const vdcDropdown = document.getElementById('vdc');
  const wardDropdown = document.getElementById('ward');
  const form = document.getElementById('queryForm');
  const resultsContainer = document.getElementById('results');

  let data = [];

  // Fetch the data and initialize the VDC dropdown
  try {
    const response = await fetch('https://drive.google.com/file/d/1SpQ1Dfi9CwiwYBqlGsfQibLuWimM3Vl2/view?usp=sharing');
    data = await response.json();

    // Extract unique VDCs
    const uniqueVDCs = [...new Set(data.map(record => record.vdc))];
    uniqueVDCs.forEach(vdc => {
      const option = document.createElement('option');
      option.value = vdc;
      option.textContent = vdc;
      vdcDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    resultsContainer.textContent = 'Error fetching data.';
  }

  // Populate the Ward dropdown based on selected VDC
  vdcDropdown.addEventListener('change', function () {
    const selectedVDC = vdcDropdown.value;

    // Clear existing wards
    wardDropdown.innerHTML = '<option value="">Select Ward</option>';

    if (selectedVDC) {
      // Extract unique wards for the selected VDC
      const uniqueWards = [
        ...new Set(data.filter(record => record.vdc === selectedVDC).map(record => record.ward))
      ];
      uniqueWards.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward;
        option.textContent = ward;
        wardDropdown.appendChild(option);
      });
    }
  });

  // Query data on form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const vdc = vdcDropdown.value;
    const ward = parseInt(wardDropdown.value);
    const parcelId = document.getElementById('parcel_id').value;

    // Filter records based on the form inputs
    const results = data.filter(record =>
      record.vdc === vdc &&
      record.ward === ward &&
      record.parcel_id === parcelId
    );

    // Display results
    resultsContainer.textContent = results.length
      ? JSON.stringify(results, null, 2)
      : 'No records found.';
  });
});
