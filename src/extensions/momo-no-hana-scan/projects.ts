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
  private getSlugChapterByUri(url: string): string {
    return url.replace(/.*manga\//, "");
  }
  private CheerioLastestUpdates($: CheerioAPI): ReleaseProject[] {
    const lastestUpdates: ReleaseProject[] = [];
    $(".page-item-detail.manga").each((i, element) => {
      const div = $(element).find(".item-thumb.c-image-hover");
      const linkProject = div.find("a").attr("href") || "";
      const lastChapter = $(element).find(".chapter-item").first();
      const title = lastChapter.find(".btn-link");

      const releaseDate = $(element).find(".post-on.font-meta").children("a");
      lastestUpdates.push({
        title: div.find("a").attr("title") || "",
        cover_uri: div.find("img").attr("src") || "",
        link: lastChapter.attr("href") || "",
        id: this.getSlugProjectByUri(linkProject) || "",
        lastChapter: {
          title: title.text().trim(),
          link: title.attr("href") || "",
          id: this.getSlugChapterByUri(lastChapter.attr("href") || ""),
          id_project: this.getSlugProjectByUri(linkProject) || "",
          number: title.text().trim().replace(/\w.* /, ""),
          release_date:
            releaseDate.length > 0
              ? releaseDate.attr("title") || ""
              : $(element).find(".post-on.font-meta").text().trim(),
        },
      });
    });
    return lastestUpdates;
  }

  private CheerioHighlightsHome($: CheerioAPI): ReleaseProject[] {
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
        lastChapter: {
          title: chapterItem.text() || "",
          release_date: $(element).find(".post-on.font-meta").text().trim(),
          id: this.getSlugChapterByUri(chapterItem.attr("href") || ""),
          id_project: this.getSlugProjectByUri(id) || "",
          number: chapterItem.text().trim().replace(/\w.* /, ""),
          link: chapterItem.attr("href") || "",
        },
        id: this.getSlugProjectByUri(id) || "",
        cover_uri: slider__thumb.find("img").attr("src") || "",
      });
    });

    return highlights;
  }

  private CheerioInfosProject($: CheerioAPI): Map<string, string> {
    const infos = new Map<string, string>();
    $(".post-content_item").each((i, e) => {
      const key = $(e).find(".summary-heading").text().trim();
      const value = $(e).find(".summary-content").text().trim();
      infos.set(key, value);
    });
    return infos;
  }

  private CheerioProjectsSearchAndGenre($: CheerioAPI): ReleaseProject[] {
    const projects: ReleaseProject[] = [];

    $(".row.c-tabs-item__content").each((i, e) => {
      const div = $(e).find(".tab-thumb.c-image-hover");
      const a = div.find("a");
      const link = a.attr("href") || "";
      const titleChapter = $(e).find(".font-meta.chapter")
      const linkChapter = titleChapter.find("a").attr("href") || ""
      projects.push({
        cover_uri: a.find("img").attr("src") || "",
        link,
        id: this.getSlugProjectByUri(link),
        title: a.attr("title") || "",
        lastChapter: {
          title:titleChapter.text().trim(),
          id: this.getSlugChapterByUri(linkChapter),
          id_project: this.getSlugProjectByUri(link),
          link: linkChapter,
          number:titleChapter.text().trim().replace(/\w.* /gim,""),
          release_date: "",
        },
      });
    });

    return projects;
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
    const lastestUpdates = this.CheerioLastestUpdates($);

    const highlights = this.CheerioHighlightsHome($);

    return { lastestUpdates, highlights };
  }
  async getProjectByRelease(project: ReleaseProject): Promise<void | Project> {
    const { data, status } = await this.router("/manga/" + project.id);

    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina do projeto");
    }

    const $ = cheerio.load(data);
    const description = $(".summary__content.show-more").text().trim();
    const painelInfos = $(".summary_content");
    const statusProject = painelInfos
      .find(".summary-content")
      .last()
      .text()
      .trim();
    const infos = this.CheerioInfosProject($);
    const genres = infos.get("G??nero(s)")?.split(", ") || [];
    return {
      ...project,
      description,
      status: statusProject,
      adult: genres.includes("Adulto") || genres.includes("Horror"),
      alt_title: infos.get("Nome Alternativo") || "",
      artist: infos.get("Artista(s)") || "Desconhecido",
      author: infos.get("Autor(es)") || "Desconhecido",
      genres,
    };
  }
  async getChaptersByProject(
    item: ReleaseProject | Project
  ): Promise<void | Project> {
    var project = { ...item };
    const { data, status } = await this.router.get("/manga/" + item.id);
    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina do projeto");
    }
    const $ = cheerio.load(data);

    if (!Project.isProject(project)) {
      const infos = this.CheerioInfosProject($);
      const description = $(".summary__content.show-more").text().trim();
      const genres = infos.get("G??nero(s)")?.split(", ") || [];
      const statusProject = $(".summary_content")
        .find(".summary-content")
        .last()
        .text()
        .trim();
      project = {
        ...project,
        description,
        status: statusProject,
        adult: genres.includes("Adulto") || genres.includes("Horror"),
        alt_title: infos.get("Nome Alternativo") || "",
        artist: infos.get("Artista(s)") || "Desconhecido",
        author: infos.get("Autor(es)") || "Desconhecido",
        genres,
      };
    }
    const { data: ChapterListHtml, status: ChapterStatus } =
      await this.router.post(`/manga/${item.id}/ajax/chapters`);
    if (ChapterStatus !== 200) return { ...project, chapters: [] };

    const $2 = cheerio.load(ChapterListHtml);
    const chapters: Chapter[] = [];

    $2(".main.version-chap.no-volumn > li").each((i, e) => {
      const a = $(e).find("a");
      const link = a.attr("href") || "";
      const id =
        link
          .replace(`${this.baseUrl}/manga/${item.id}/`, "")
          .replace("/", "") || "";
      chapters.push({
        id,
        id_project: item.id,
        link,
        number: id.match(/\d.*/)?.[0].replace("-", ".") || "",
        release_date: $(e).find(".chapter-release-date").text().trim() || "",
        title: a.text().trim() || "",
      });
    });
    project.chapters = chapters;
    return project;
  }

  async getPagsByChapter(chapter: Chapter): Promise<void | Chapter> {
    const { data, status } = await this.router.get(
      `/manga/${chapter.id_project}/${chapter.id}/?style=list`
    );
    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina do capitulo");
    }

    const $ = cheerio.load(data);

    const pags: string[] = [];

    $(".page-break.no-gaps").each((i, e) => {
      const img = $(e).find("img");
      const src = img.attr("src")?.trim() || "";
      pags.push(src);
    });
    chapter.pags = pags;
    return chapter;
  }
  async getProjectsByGenre(genres: string): Promise<void | ReleaseProject[]> {
    const { data, status } = await this.router.get(
      `/?s=&post_type=wp-manga&genre%5B%5D=${genres}&op=&author=&artist=&release=&adult=`
    );

    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina com o genero escolhido");
    }
    const $ = cheerio.load(data);

    const projects = this.CheerioProjectsSearchAndGenre($);

    return projects;
  }
  async getProjectsBySearch(search: string): Promise<void | ReleaseProject[]> {
    const { data, status } = await this.router(
      `/?s=${search}&post_type=wp-manga&op=&author=&artist=&release=&adult=`
    );

    if (status !== 200) {
      throw new Error("Falha ao carregar a pagina com a busca");
    }

    const $ = cheerio.load(data);

    const projects = this.CheerioProjectsSearchAndGenre($);

    return projects;
  }
}

// Use para testar alguma fun????o em especifico

/* const ReleaseProjectTest = new ReleaseProject({
  id: "black-kanojo",
  title: "Black Kanojo",
  cover_uri:
    "https://cdn.statically.io/img/www.momonohanascan.com/wp-content/uploads/2021/10/9784040682402-193x278.jpg?quality=90&f=auto",
  link: "https://www.momonohanascan.com/manga/black-kanojo/",
  lastChapter: "Cap??tulo 20 - FIM ",
}); */

/* const ChapterTest = new Chapter({
  id: "capitulo-20",
  id_project: "black-kanojo",
  link: "https://www.momonohanascan.com/manga/black-kanojo/capitulo-20/",
  number: "20",
  release_date: "2020-10-10",
  title: "Cap??tulo 20 - Fim",
}); */

/* new MomoNoHanaScansProject(
  "https://www.momonohanascan.com"
).getProjectsBySearch("kanojo"); */
