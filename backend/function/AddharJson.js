// to convert text to json format of addhar image ocr coming txt
function AddharTextToJson(ImageResult) {
  const lines = ImageResult
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== "");

  let name = "";
  let dob = "";
  let gender = "";
  let id_number = "";

  const dobRegex = /(?:DOB[:\s]*|Date of Birth[:\s]*)?(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i;
  const aadharRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
  const genderRegex = /\b(male|female|transgender)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Aadhar number
    if (!id_number && aadharRegex.test(line)) {
      id_number = line.match(aadharRegex)[0].replace(/\s+/g, '');
      continue;
    }

    // Date of birth
    if (!dob && dobRegex.test(line)) {
      dob = dobRegex.exec(line)[1];
      continue;
    }

    // Gender
    if (!gender && genderRegex.test(line)) {
      gender = genderRegex.exec(line)[0];
      continue;
    }

    // Name (skip known labels or government headers)
    if (
      !name &&
      !line.toLowerCase().includes("gov") &&
      !line.toLowerCase().includes("dob") &&
      !line.toLowerCase().includes("date of birth") &&
      !genderRegex.test(line) &&
      !aadharRegex.test(line) &&
      line.length >= 3
    ) {
      name = line;
    }
  }

  return {
    name,
    dob,
    gender,
    id_number
  };
}
module.exports = AddharTextToJson;
