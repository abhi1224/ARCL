import API from "./axios";


// CREATE INQUIRY

export const createInquiry =
async (inquiryData) => {

const response =
await API.post(
"/inquiries",
inquiryData
);

return response.data;
};

// GET ALL INQUIRIES

export const getAllInquiries =
async () => {

const response =
await API.get(
"/inquiries"
);

return response.data;
};

// GET SINGLE INQUIRY

export const getSingleInquiry =
async (id) => {

const response =
await API.get(
`/inquiries/${id}`
);

return response.data;
};

// UPDATE INQUIRY STATUS

export const updateInquiryStatus =
async (id, status) => {

const response =
await API.put(


  `/inquiries/${id}`,

  { status }

);


return response.data;
};

// DELETE INQUIRY

export const deleteInquiry =
async (id) => {

const response =
await API.delete(
`/inquiries/${id}`
);

return response.data;
};
