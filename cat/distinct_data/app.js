let editor;
let parsedData = [];
let selectedRowIndex = null;

// Initialize Monaco editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.0/min/vs' } });
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('monacoEditor'), {
    value: '',
    language: 'json',
    theme: 'vs-dark'
  });
});

const fileDropZone = document.getElementById('fileDropZone');
const fileInput = document.getElementById('fileInput');
const tableBody = document.getElementById('tableBody');
const recordCount = document.getElementById('recordCount');
const jsonFieldCheckboxes = document.getElementById('jsonFieldCheckboxes');

// File input handling
fileDropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
fileDropZone.addEventListener('dragover', e => e.preventDefault());
fileDropZone.addEventListener('drop', handleFileDrop);

// Handle dropped files
function handleFileDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.csv')) {
    parseFile(file);
  }
}

// Handle file upload
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file && file.name.endsWith('.csv')) {
    parseFile(file);
  }
}

// Parse CSV file and extract JSON
function parseFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n');
    parsedData = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const json = getJsonLine(line);
        if (json) {
          parsedData.push(json);
        }
      }
    }
    updateTable();
    createCheckboxes();
  };
  reader.readAsText(file);
}

// Populate table with data
function updateTable() {
  tableBody.innerHTML = '';
  parsedData.forEach((data, index) => {
    const row = document.createElement('tr');
    row.setAttribute('data-index', index);
    row.innerHTML = `<td>${index + 1}</td><td>${data.shipment_external_id || 'N/A'}</td>`;
    row.addEventListener('click', () => updateEditor(index));
    tableBody.appendChild(row);
  });
  recordCount.textContent = parsedData.length;
}

// Update Monaco editor with selected JSON
function updateEditor(index) {
  selectedRowIndex = index;
  const json = parsedData[index];
  const formattedJson = formatJson(json);
  editor.setValue(formattedJson);
  updateRowSelection(index);
}

// Highlight selected row
function updateRowSelection(index) {
  const rows = tableBody.getElementsByTagName('tr');
  for (let row of rows) {
    row.classList.remove('table-primary');
  }
  rows[index].classList.add('table-primary');
}

// Parse and clean JSON
function getJsonLine(line) {
  let newLine = line.substring(1, line.lastIndexOf('"'))
  newLine = newLine.substring(0, newLine.length - 2)
  newLine = newLine.replace('\\o', '~o')
    .replaceAll('","', ',')
    .replaceAll('\\"""', '~')
    .replaceAll('"\\""', '~')
    .replaceAll('\\""', '~')
    .replaceAll('"', '')
    .replaceAll('~', '"');
  
  let json = null;
  try {
    json = JSON.parse(newLine);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

  return trimJsonFields(json);
}

// Trim fields and replace stop_task_type values
function trimJsonFields(json) {
  for (let key in json) {
    if (typeof json[key] === 'string') {
      json[key] = json[key].trim();
    }
  }
  if (json.stops && json.stops.stop_task_type) {
    json.stops.stop_task_type = json.stops.stop_task_type === 'PU' ? 'Pick Up' : 'Drop Off';
  }
  return json;
}

// Format JSON for Monaco editor, including special formatting for 'bookings'
function formatJson(json) {
  const keysToShow = getVisibleFields();
  let formattedJson = JSON.stringify(json, (key, value) => keysToShow.includes(key) ? value : undefined, 2);
  
  if (json.bookings) {
    const bookingTable = json.bookings.map(b => b.join(' | ')).join('\n');
    formattedJson += `\n\nBookings:\n${bookingTable}`;
  }

  return formattedJson;
}

// Create checkboxes for each JSON field
function createCheckboxes() {
  const fields = Object.keys(parsedData[0] || {});
  jsonFieldCheckboxes.innerHTML = '';
  fields.forEach(field => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = field;
    checkbox.checked = getCheckboxState(field);
    checkbox.addEventListener('change', saveCheckboxState);

    const label = document.createElement('label');
    label.htmlFor = field;
    label.textContent = field;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);
    jsonFieldCheckboxes.appendChild(div);
  });
}

// Save checkbox state to localStorage
function saveCheckboxState() {
  const checkbox = this;
  localStorage.setItem(checkbox.id, checkbox.checked);
  if (selectedRowIndex !== null) {
    updateEditor(selectedRowIndex);
  }
}

// Get checkbox state from localStorage
function getCheckboxState(field) {
  const storedValue = localStorage.getItem(field);
  return storedValue !== null ? JSON.parse(storedValue) : true;
}

// Get list of visible fields based on checkboxes
function getVisibleFields() {
  const checkboxes = jsonFieldCheckboxes.querySelectorAll('input[type="checkbox"]');
  const fields = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      fields.push(checkbox.id);
    }
  });
  return fields;
}

// Handle keyboard navigation for rows
document.addEventListener('keydown', (e) => {
  if (selectedRowIndex !== null) {
    if (e.key === 'ArrowUp' && selectedRowIndex > 0) {
      selectedRowIndex--;
      updateEditor(selectedRowIndex);
    } else if (e.key === 'ArrowDown' && selectedRowIndex < parsedData.length - 1) {
      selectedRowIndex++;
      updateEditor(selectedRowIndex);
    }
  }
});