import axiosInstance
from "./axiosInstance.js";

// CREATE INQUIRY

export const createInquiry =
async (inquiryData) => {

const response =
await axiosInstance.post(
"/inquiries",
inquiryData
);

return response.data;
};

// GET ALL INQUIRIES

export const getAllInquiries =
async () => {

const response =
await axiosInstance.get(
"/inquiries"
);

return response.data;
};

// GET SINGLE INQUIRY

export const getSingleInquiry =
async (id) => {

const response =
await axiosInstance.get(
`/inquiries/${id}`
);

return response.data;
};

// UPDATE INQUIRY STATUS

export const updateInquiryStatus =
async (id, status) => {

const response =
await axiosInstance.put(

```
  `/inquiries/${id}`,

  { status }

);
```

return response.data;
};

// DELETE INQUIRY

export const deleteInquiry =
async (id) => {

const response =
await axiosInstance.delete(
`/inquiries/${id}`
);

return response.data;
};
