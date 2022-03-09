import axios from "axios";
import * as Projects from "./projects";
import ProfileScan from "./profile";
import { ReleaseProject } from "../../entidades/ReleaseProject";
import { Chapter } from "../../entidades/Chapter";

const ReleaseProjectTest: ReleaseProject = {
  id: "takopii-no-genzai",
  title: "Takopii no Genzai",
  cover_uri:
    "http://amascan.com/uploads/manga/takopii-no-genzai/cover/cover_250x350.jpg",
  lastChapter: "#2. A Aventura de Takopii",
  link: "http://amascan.com/manga/takopii-no-genzai/2",
};

const ChapterTest:Chapter = {
    id: "takopii-no-genzai-1",
    id_project: "takopii-no-genzai",
    title: "A Aventura de Takopii",
    link: "http://amascan.com/manga/takopii-no-genzai/1",
    number: "1",
    release_date: "2020-01-01",
}

const AmaScansProjects = new Projects.AmaScansProjects(ProfileScan.website_uri);

AmaScansProjects.getPagsByChapter(ChapterTest);

export { AmaScansProjects, ProfileScan };
