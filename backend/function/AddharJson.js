// to convert text to json format of addhar image ocr coming txt
function AddharTextToJson(ImageResult){
    const lines = ImageResult.split('\n');
    const Data = {
      name : lines[1].trim(),
      dob : lines[2].replace('DOB',' ').trim(),
      gender : lines[3].trim(),
      id_number : lines[4].trim().replace(/\s+/g, "")
    };
    return Data;
}

module.exports = AddharTextToJson;
