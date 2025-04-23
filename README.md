# Incometax calculator api

this is a Smart Document Upload with OCR Project where the user can upload his gverment document like addhar cardand pan card then the image text is converted to text and autofilled in the input field also if user want to modify the input filed it can also do that.

# Table of Content

Api Endpoint
Details about Ocr
Backend Setup
FrontEnd Setup
Taech Stack

# Api Endpoint

post - /upload  
 Description - Getting the user input and calculating the income tax and save it onto the database.
Request -
In the request here a goverment id will uploaded and also in the query paramenter send the use id type like addhar card or pan card.
Response -
In the respoce the will send a json data like this .
for addhar card
{
"name": 'Gayatri',
"dob": '01/01/1982',
"gender": 'Female',
"id_number": '844993895999'
}  
and for pan card  
 {
  "name": 'AJAY KUMAR KAUSHAL',
  "father_name": 'NEMCHANDRA KAUSHAL',
  "dob": '03/07/1977',
  "id_number": 'DGlPK3650P'
}

    Get - /kycDocument
    Description - it save the user information into the database and send a success or failior message based on condition it saved on database or not


# Details about OCR
 for this project i use the OCR.space this is a freemium api that can provid the api to convert the image into text if we talk about free package the it provid the 25000 req/month;

# Backend Setup

1.  Clone the Repo.
    git clone 
    cd backend

2.  Install dependencies.
    npm install

3.  Start the mongodb (Insue the mongdb run localy)

4.  Run the Server
    node app.js

5.  Server is running on port:- http://localhost:8080

# Frontend Setup

1. Navigate to frontend Folder
   cd ../frontend

2. Install dependencies
   npm install

3. Start React Server
   npm run dev

4. Frontend running on prt : http://localhost:5173

# Tech Stack

Frontend - React.js , Tailwind Css,react toastify  
 Backend - Node.js , Express.js ,OCR.space Api ,multer,cloudinary
Database - MongoDb
Validation - Joi
