$(document).ready(async function () {
  const dataUrl = 'https://raw.githubusercontent.com/username/repo/main/data.json'; // Replace with your GitHub data URL
  let table;
  let data = [];

  try {
    // Fetch the data
    const response = await fetch(dataUrl);
    data = await response.json();

    // Initialize DataTable
    table = $('#recordsTable').DataTable({
      data: data,
      columns: [
        { data: 'vdc' },
        { data: 'ward' },
        { data: 'parcel_id' },
        { data: 'landuse' },
        { data: 'area' }
      ],
      dom: 'lfrtip', // DataTables default layout
      paging: true,
      searching: true,
      responsive: true
    });

    // Populate VDC dropdown
    const uniqueVDCs = [...new Set(data.map(record => record.vdc))];
    uniqueVDCs.forEach(vdc => {
      $('#vdcFilter').append(`<option value="${vdc}">${vdc}</option>`);
    });

    // Event listener for VDC dropdown
    $('#vdcFilter').on('change', function () {
      const selectedVDC = $(this).val();

      // Filter Ward dropdown based on selected VDC
      $('#wardFilter').empty().append('<option value="">All</option>');
      if (selectedVDC) {
        const uniqueWards = [
          ...new Set(data.filter(record => record.vdc === selectedVDC).map(record => record.ward))
        ];
        uniqueWards.forEach(ward => {
          $('#wardFilter').append(`<option value="${ward}">${ward}</option>`);
        });
      }

      // Apply VDC filter to the table
      table.column(0).search(selectedVDC || '', true, false).draw();
    });

    // Event listener for Ward dropdown
    $('#wardFilter').on('change', function () {
      const selectedWard = $(this).val();
      table.column(1).search(selectedWard || '', true, false).draw();
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load data. Please check your data source.');
  }
});
