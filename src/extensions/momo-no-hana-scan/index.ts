import axios from "axios";
import ProfileScan from "./profile";
import * as Projects from "./projects";

const MonoNoHanaScansProject = new Projects.MomoNoHanaScansProject(
  ProfileScan.website_uri
);

export { MonoNoHanaScansProject, ProfileScan };
