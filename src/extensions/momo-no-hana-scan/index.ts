import axios from "axios";
import ProfileScan from "./profile";

const Router = axios.create({
  baseURL: ProfileScan.website_uri,
});

export { ProfileScan };
