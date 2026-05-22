import API from "./axios";

export const createContact = async (contactData) => {
  const response = await API.post("/contacts", contactData);

  return response.data;
};

export const getAllContacts = async () => {
  const response = await API.get("/contacts");

  return response.data;
};

export const deleteContact = async (id) => {
  const response = await API.delete(`/contacts/${id}`);

  return response.data;
};

export const updateContactStatus = async (id, status) => {
  const response = await API.put(
    `/contacts/${id}`,

    { status },
  );

  return response.data;
};
