import axios from "axios";
import * as Projects from "./projects";
import ProfileScan from "./profile";
import { ReleaseProject } from "../../entidades/ReleaseProject";
import { Chapter } from "../../entidades/Chapter";

const AmaScansProjects = new Projects.AmaScansProjects(ProfileScan.website_uri);

export { AmaScansProjects, ProfileScan };
