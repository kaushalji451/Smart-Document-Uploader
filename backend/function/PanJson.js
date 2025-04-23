// to convert text to json format of pan image ocr coming txt
function PanTextToJson(ImageResult) {
  const lines = ImageResult
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== "");

  let id_number = "";
  let name = "";
  let father_name = "";
  let dob = "";

  // Regex to match PAN card number (typically 5 letters, 4 digits, 1 letter)
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
  const dobRegex = /^(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})$/; 

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!id_number && panRegex.test(line)) {
      id_number = line.match(panRegex)[0];
    }

    // Detect "Name" followed by actual name
    if (line.toLowerCase().includes("name") && lines[i + 1]) {
      // Avoid "Father's Name" case
      if (!line.toLowerCase().includes("father")) {
        name = lines[i + 1].trim();
        continue;
      }
    }

    // Detect "Father's Name" followed by actual name
    if (line.toLowerCase().includes("father") && lines[i + 1]) {
      father_name = lines[i + 1].trim();
      continue;
    }

     // If line looks like a date and we haven't found a dob yet
     if (!dob && dobRegex.test(line)) {
      dob = dobRegex.exec(line)[0];
    }
  }

  return {
    name: name,
    father_name: father_name,
    dob: dob,
    id_number: id_number
  };
}

module.exports = PanTextToJson;