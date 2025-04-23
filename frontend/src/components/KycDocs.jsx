import React from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, Bounce, toast } from "react-toastify";
const KycDocs = () => {
  const [file, setfile] = useState(null); // for uploaded file
  const [idType, setidType] = useState(null); // for id type
  const [formData, setformData] = useState({ // for formData
    name: "",
    idNumber: "",
    dob: "",
    gender: "",
    idType: "",
    fathername: "",
  });
  const [loading, setLoading] = useState(false); // laoding state
 
  const handleUpload = async (e) => {   // handleing the upload
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload?idType=${idType}`,
        formData
      );

      const inputDate = res.data.data.dob; // dd/MM/yyyy
      const [day, month, year] = inputDate.split("/");
      const formattedDate = `${year}-${month}-${day}`;   //YYY/MM/DD
      setformData({
        ...formData,
        name: res.data.data.name, 
        idNumber: res.data.data.id_number,
        dob: formattedDate,
        gender: res.data?.data?.gender ?? "",
        idType: res.data.idType,
        fathername: res.data?.data?.father_name ?? "",
      });
      toast("File added successfully");
      window.scrollTo({
        top: 500, // scrolls to 500px from the top
        behavior: "smooth" // adds smooth scrolling effect
      });
    } catch (error) {
      console.error(error);
      toast("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  // handle form input changes
  let handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/kycDocument`,
      formData
    );
    if (response.data.message === "Document saved successfully") {
      toast("Document added successfully");
    } else {
      toast("Document not added successfully");
    }
    setformData({
      name: "",
      idNumber: "",
      dob: "",
      gender: "",
      idType: "",
      fathername: "",
    });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="bg-[#262140] h-full pb-20 flex items-center justify-center">
        {/* heading */}
        <div className=" h-[90%] w-[90%]">
          <div className="text-center text-[#f8b3ac] text-4xl font-bold py-6">
            Doument Kyc
          </div>
          {/* upload */}
          <h1 className="text-xl py-4  text-[#f8b3ac] text-center">
            Upload a valid Goverment ID
          </h1>

          {/* for file uploader */}
          {/* id type */}
          <form
            onSubmit={handleUpload}
            className="flex min-lg:gap-5 max-lg:flex-col items-center text-[#f8b3ac]"
          >
            <div className="min-lg:w-1/3 w-full pb-4 flex flex-col gap-2">
              <label htmlFor="name" className="text-lg">
                Id Type
              </label>
              <select
                name="idType"
                id="id"
                className="border-t border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6 "
                onChange={(e) => {
                  setidType(e.target.value);
                }}
                required
              >
                <option value="">Select your Id type</option>
                <option value="AadharCard">Addhar Card</option>
                <option value="PanCard">Pan Card</option>
              </select>
            </div>

            <div className="min-lg:w-1/2 w-full pb-4 flex flex-col gap-2">
              <label htmlFor="name" className="text-lg">
                your document
              </label>
              <input
                type="file"
                className="border-t border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                }}
                required
              />
            </div>
            <button className="bg-[#312f5d] h-13 text-[#f8b3ac] text-xl px-10 rounded-xl">
              Submit
            </button>
          </form>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-4">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#f8b3ac]"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          <h1 className="py-6 text-xl  text-[#f8b3ac] text-center">
            Or Inter Details  By Your Self
          </h1>
          {/* maual docs */}
          <form className="text-[#f8b3ac]" onSubmit={handleSubmit}>
            <div className="flex max-sm:flex-col gap-5">
              {/* name */}
              <div className="w-1/2 max-sm:w-full pb-4">
                <label htmlFor="name" className="text-lg">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  placeholder="Inter your name"
                  className="border-t mt-2 border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                  onChange={handleChange}
                  required
                />
              </div>
              {/* fathername */}
              <div className="w-1/2 max-sm:w-full pb-4">
                <label htmlFor="fathername" className="text-lg">
                  Father Name
                </label>
                <input
                  type="text"
                  name="fathername"
                  id="fathername"
                  value={formData.fathername}
                  placeholder="Inter your father name"
                  className="border-t mt-2 border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex  max-sm:flex-col gap-5">
              {/* dob */}
              <div className="w-1/2 max-sm:w-full pb-4">
                <label htmlFor="dob" className="text-lg">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  className="border-t mt-2 border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                  onChange={handleChange}
                  required
                />
              </div>
              {/* gender */}
              <div className="w-1/2 max-sm:w-full pb-4">
                <label htmlFor="gender" className="text-lg">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  placeholder="Your gender"
                  className="border-t mt-2 border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex max-sm:flex-col gap-5">
              {/* id type */}
              <div className="w-1/2 max-sm:w-full pb-4 flex flex-col gap-2">
                <label htmlFor="name" className="text-lg">
                  Id Type
                </label>
                <select
                  name="idType"
                  id="id"
                  value={formData.idType}
                  className="border-t border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6 "
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your Id type</option>
                  <option value="AadharCard">Addhar Card</option>
                  <option value="PanCard">Pan Card</option>
                </select>
              </div>
              {/* id */}
              <div className="w-1/2 max-sm:w-full pb-4">
                <label htmlFor="id" className="text-lg">
                  Id Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  id="id"
                  value={formData.idNumber}
                  placeholder="Inter your id number"
                  className="border-t mt-2 border-b border-[#f8b3ac] text-xl text-[#f8b3ac] w-full py-4 rounded-xl px-6"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button className="bg-[#312f5d] h-13 text-[#f8b3ac] text-xl px-10 rounded-xl">
                Submit your Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default KycDocs;
