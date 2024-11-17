document.getElementById('queryForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const vdc = document.getElementById('vdc').value;
  const ward = parseInt(document.getElementById('ward').value);
  const parcelId = document.getElementById('parcel_id').value;

  try {
    const response = await fetch('https://github.com/a1chandan/LanduseQuery/blob/main/kolvi.csv');
    const data = await response.json();

    const results = data.filter(record => 
      record.vdc === vdc && 
      record.ward === ward && 
      record.parcel_id === parcelId
    );

    document.getElementById('results').textContent = JSON.stringify(results, null, 2);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    document.getElementById('results').textContent = 'Error fetching or processing data.';
  }
});
