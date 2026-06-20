import commonAPI from "./commonAPI";
import { SERVER_URL } from "./serverURL";

// register
export const registerAPI = async(reqBody) => {
  return await commonAPI("POST",`${SERVER_URL}/register`,reqBody);
}

// LOGIN
export const loginAPI = async(reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/login`,reqBody);
}

// GET ALL EVENTS
export const getAllEvents = async() => {
  return await commonAPI("GET", `${SERVER_URL}/all-events`);
}

// get single event 

export const singleEvent = async(id)=>{
    return await commonAPI("GET",`${SERVER_URL}/single-event/${id}`)
}

// rserve

export const reserveSeats = async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/reserve`,reqBody,reqHeader)
}

// confirm

export const confirmBooking = async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/bookings`,reqBody,reqHeader)
}


// CREATE EVENT
export const createEvent = async(reqBody, reqHeader) => {
  return await commonAPI("POST", `${SERVER_URL}/add-event`, reqBody, reqHeader);
}

// UPDATE EVENT
export const updateEvent = async(id, reqBody, reqHeader) => {
  return await commonAPI("PUT", `${SERVER_URL}/update-event/${id}`, reqBody, reqHeader);
}

// DELETE EVENT
export const deleteEvent = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVER_URL}/delete-event/${id}`, {}, reqHeader);
};

export const getMyBookings = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/my-bookings`, {}, reqHeader);
};