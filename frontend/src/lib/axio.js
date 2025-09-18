import axios from "axios";

const instance = axios.create({
  baseURL: "https://hellochatapp-p8jw.onrender.com",
  withCredentials: true
});

export default instance;
