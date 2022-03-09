import axios from "axios";
import * as Projects from "./projects";
import ProfileScan from "./profile";

const AmaScansProjects = new Projects.AmaScansProjects(ProfileScan.website_uri);

export { AmaScansProjects, ProfileScan };
