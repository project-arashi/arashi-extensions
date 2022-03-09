import axios from "axios";
import ProfileScan from "./profile";
import * as Projects from "./projects";

const MomoNoHanaScansProject = new Projects.MomoNoHanaScansProject(
  ProfileScan.website_uri
);

export { MomoNoHanaScansProject, ProfileScan };
