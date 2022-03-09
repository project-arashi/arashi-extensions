import { CheerioAPI } from "cheerio";
import { Chapter } from "../entidades/Chapter";
import { Project } from "../entidades/Project";
import { ReleaseProject } from "../entidades/ReleaseProject";

export interface IProjectsController {
  getHome(): Promise<{
    lastestUpdates: ReleaseProject[];
    highlights: ReleaseProject[];
  } | void>;
  getProjectByRelease(project: ReleaseProject): Promise<Project | void>;
  getChaptersByProject(item: ReleaseProject | Project): Promise<Project | void>;
  getPagsByChapter(chapter: Chapter): Promise<Chapter | void>;
  getProjectsBySearch(search: string): Promise<ReleaseProject[] | void>;
  getProjectsByGenre(genres: string): Promise<ReleaseProject[] | void>;
}
