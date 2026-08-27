import API from "./axios";

// Public client subscription
export const subscribeApi = (email, source = "website_home_subscription") =>
  API.post("/client/subscribers", { email, source });

// Admin get all subscribers
export const getAdminSubscribersApi = () => API.get("/admin/subscribers");

// Admin delete subscriber
export const deleteAdminSubscriberApi = (id) =>
  API.delete(`/admin/subscribers/${id}`);
