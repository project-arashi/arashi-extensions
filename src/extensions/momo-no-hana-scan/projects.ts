import axios, { AxiosInstance } from "axios";
import cheerio from "cheerio";

import { Chapter } from "../../entidades/Chapter";
import { Project } from "../../entidades/Project";
import { ReleaseProject } from "../../entidades/ReleaseProject";
import { IProjectsController } from "../../repositorios/IProjectsController";
export class MomoNoHanaScansProject implements IProjectsController {
  public baseUrl: string;
  public router: AxiosInstance;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = axios.create({
      baseURL: baseUrl,
    });
  }

  private getSlugProjectByUri(url: string): string {
    return url.replace(this.baseUrl + "/manga/", "").replace("/", "");
  }

  async getHome(): Promise<void | {
    lastestUpdates: ReleaseProject[];
    highlights: ReleaseProject[];
  }> {
    const { data, status } = await this.router("/");
    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina Home");
    }

    const $ = cheerio.load(data);

    const lastestUpdates: ReleaseProject[] = [];

    $(".page-item-detail.manga").each((i, element) => {
      const div = $(element).find(".item-thumb.c-image-hover");
      const linkProject = div.find("a").attr("href") || "";
      const lastChapter = $(element)
        .find(".list-chapter > .chapter-item > .btn-link")
        .first();
      lastestUpdates.push({
        title: div.find("a").attr("title") || "",
        cover_uri: div.find("img").attr("src") || "",
        link: lastChapter.attr("href") || "",
        id: this.getSlugProjectByUri(linkProject) || "",
        lastChapter: lastChapter.text() || "",
      });
    });
    return { lastestUpdates, highlights: [] };
  }

  async getProjectByRelease(project: ReleaseProject): Promise<void | Project> {}
  async getChaptersByProject(
    item: ReleaseProject | Project
  ): Promise<void | Project> {}

  async getPagsByChapter(chapter: Chapter): Promise<void | Chapter> {}
  async getProjectsByGenre(genres: string): Promise<void | ReleaseProject[]> {}
  async getProjectsBySearch(search: string): Promise<void | ReleaseProject[]> {}
}
