// to convert text to json format of pan image ocr coming txt
function PanTextToJson(ImageResult){
  const lines = ImageResult.split('\n');
  const Data = {
    name : lines[1].trim(),
    father_name : lines[2].trim(),
    dob : lines[3].replace('DOB',' ').trim(),
    id_number : lines[5].trim().replace(/\s+/g, ""),
  };
  return Data;
}

module.exports = PanTextToJson;