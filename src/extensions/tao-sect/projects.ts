import axios, { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import { Chapter } from "../../entidades/Chapter";
import { Project } from "../../entidades/Project";
import { ReleaseProject } from "../../entidades/ReleaseProject";
import { IProjectsController } from "../../repositorios/IProjectsController";

export class TaoSectProject implements IProjectsController {
  public baseUrl: string;
  public router: AxiosInstance;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = axios.create({
      baseURL: baseUrl,
    });
  }

  private linkToProjectByLinkChapter(link: string): string {
    return link.replace(/\/cap-tulo-\d+/, "");
  }

  private slugToProjectByLinkChapter(link: string): string {
    return link;
  }

  async getHome(): Promise<void | {
    lastestUpdates: ReleaseProject[];
    highlights: ReleaseProject[];
  }> {
    const { data, status } = await this.router("/");

    if (status !== 200)
      throw new Error("Error ao fazer request Home do Tao Sect");

    const $ = cheerio.load(data);

    const lastestUpdates: ReleaseProject[] = [];

    $(".post-projeto").each((i, el) => {
      const background = $(el).find(".post-projeto-background").attr("style");
      const cover_url = /url\((\w.*)\);/.exec(background || "");
      const cover = cover_url ? cover_url[1] : "";
      const h3Titulo = $(el).find(".titulo-cap");
      const [chapter, release_date] = h3Titulo
        .children("small")
        .text()
        .split(" | ");
      const title = h3Titulo
        .text()
        .trim()
        .replace(` ${chapter} | ${release_date}`, "");

      const link = $(el).find("a").attr("href") || "";

      const chapterId = /(^\w.*projeto\/)(\w.+\/)/gi.exec(link);
      const projectId = chapterId ? chapterId[2].replace(/\/cap-tulo-\d+/, "") : ""
      lastestUpdates.push({
        cover_uri: cover,
        title,
        id: projectId,
        lastChapter: {
          id: chapterId ? chapterId[2] : "",
          id_project: projectId,
          link,
          number: chapter.replace("Capítulo ", ""),
          title: chapter,
          release_date: release_date,
        },
        link: this.linkToProjectByLinkChapter(link),
        banner_uri: "",
      });
    });
    return { lastestUpdates, highlights: [] };
  }

  async getProjectsByGenre(genres: string): Promise<void | ReleaseProject[]> {}
  async getProjectsBySearch(search: string): Promise<void | ReleaseProject[]> {}
  async getProjectByRelease(project: ReleaseProject): Promise<void | Project> {}
  async getPagsByChapter(chapter: Chapter): Promise<void | Chapter> {}
  async getChaptersByProject(
    item: ReleaseProject | Project
  ): Promise<void | Project> {}
}

/* new TaoSectProject("https://taosect.com/leitor-online").getHome(); */
