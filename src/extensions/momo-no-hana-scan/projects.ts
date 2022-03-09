import axios, { AxiosInstance } from "axios";
import cheerio, { CheerioAPI } from "cheerio";

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
    return url.split("/")[4];
  }

  private getLastestUpdates($: CheerioAPI): ReleaseProject[] {
    const lastestUpdates: ReleaseProject[] = [];
    $(".page-item-detail.manga").each((i, element) => {
      const div = $(element).find(".item-thumb.c-image-hover");
      const linkProject = div.find("a").attr("href") || "";
      const lastChapter = $(element).find(".btn-link").first();

      lastestUpdates.push({
        title: div.find("a").attr("title") || "",
        cover_uri: div.find("img").attr("src") || "",
        link: lastChapter.attr("href") || "",
        id: this.getSlugProjectByUri(linkProject) || "",
        lastChapter: lastChapter.text() || "",
      });
    });
    return lastestUpdates;
  }

  private getHighlightsHome($: CheerioAPI): ReleaseProject[] {
    const highlights: ReleaseProject[] = [];

    $(".item__wrap").each((i, element) => {
      const chapterItem = $(element).find(".chapter > a").first();
      const slider__thumb = $(element).find(".slider__thumb");
        const id = slider__thumb.find("a").attr("href") || "";
      highlights.push({
        title:
          $(element)
            .find(".post-title.font-title")
            .text()
            .trim()
            .replace(/\n/gi, "") || "",
        link: chapterItem.attr("href") || "",
        lastChapter: chapterItem.text() || "",
        id:
          this.getSlugProjectByUri(id) || "",
        cover_uri: slider__thumb.find("img").attr("src") || "",
      });
    });

    return highlights;
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
    const lastestUpdates = this.getLastestUpdates($);

    const highlights = this.getHighlightsHome($);

    return { lastestUpdates, highlights };
  }

  async getProjectByRelease(project: ReleaseProject): Promise<void | Project> {}
  async getChaptersByProject(
    item: ReleaseProject | Project
  ): Promise<void | Project> {}

  async getPagsByChapter(chapter: Chapter): Promise<void | Chapter> {}
  async getProjectsByGenre(genres: string): Promise<void | ReleaseProject[]> {}
  async getProjectsBySearch(search: string): Promise<void | ReleaseProject[]> {}
}

new MomoNoHanaScansProject("https://www.momonohanascan.com/").getHome();
