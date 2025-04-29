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
  let father_name = "";

  const dobRegex = /(?:DOB[:\s]*|Date of Birth[:\s]*)?(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i;
  const aadharRegex = /(?:\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b)/g;
  const genderRegex = /\b(male|female|transgender|m|f|others)\b/i;
  const fatherRegex = /S\/O[:\s]*([A-Z][a-zA-Z\s]+)/i;

  // Join all lines to ensure multiline Aadhar numbers are detected
  const allText = lines.join(' ');

  // Try to extract Aadhar number first from the whole text
  const aadharMatch = allText.match(aadharRegex);
  if (aadharMatch && aadharMatch.length > 0) {
    id_number = aadharMatch[0].replace(/\D/g, ''); // remove spaces/hyphens
  }

  // Father name (from entire text block)
  const fatherMatch = allText.match(fatherRegex);
  if (fatherMatch && fatherMatch[1]) {
    father_name = fatherMatch[1].trim();
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Date of birth
    if (!dob && dobRegex.test(line)) {
      dob = dobRegex.exec(line)[1];
      continue;
    }

    // Gender
    if (!gender && genderRegex.test(line)) {
      const rawGender = genderRegex.exec(line)[0].toLowerCase();
      gender = rawGender === 'm' ? 'male' : rawGender === 'f' ? 'female' : rawGender;
      continue;
    }

    // Name
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
    id_number,
    father_name: father_name,
  };
}
module.exports = AddharTextToJson;
