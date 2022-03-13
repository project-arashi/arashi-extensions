import axios, { AxiosInstance } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { Chapter } from "../../entidades/Chapter";
import { Project } from "../../entidades/Project";
import { ReleaseProject } from "../../entidades/ReleaseProject";
import { IProjectsController } from "../../repositorios/IProjectsController";

export class AmaScansProjects implements IProjectsController {
  private baseUrl = "https://amascan.com";
  private router = axios.create({
    baseURL: this.baseUrl,
  });
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.router = axios.create({
      baseURL: baseUrl,
    });
  }
  private getSlugByUrl(url: string): string {
    const item = url.includes("uploads")
      ? `${this.baseUrl.replace("https", "http")}/uploads/manga/`
      : `${this.baseUrl}/manga/`;
    return url.replace(item, "").replace(/\/.*/, "");
  }

  private getSlugChapterByUrl(url: string): string {
    return url.replace(/.*manga\//, "");
  }

  private getNumberByUrl(url: string): string {
    return url.replace(/.*\//, "");
  }
  //cria o array para os projetos em destaque
  private CheerioHighlightsHome($: CheerioAPI): ReleaseProject[] {
    const highlights: ReleaseProject[] = [];
    $(".span3").each((i, element) => {
      const img = $(element).find(".thumbnail > img");

      const cover_uri = img.attr("src") || "";
      const id = this.getSlugByUrl(cover_uri);
      const title = $(element).find(".label.label-warning");
      const lastChapter = $(element).find(".well > p > a");
      const linkChapter = lastChapter.attr("href") || "";
      highlights.push({
        id,
        title: title.text().trim(),
        link: title.attr("href") || "",
        cover_uri,
        lastChapter: {
          title: lastChapter.text().trim() || "",
          number: this.getNumberByUrl(linkChapter || ""),
          link: linkChapter || "",
          id: this.getSlugChapterByUrl(linkChapter || ""),
          id_project: id,
          release_date: "",
        },
      });
    });

    return highlights;
  }
  //cria o array para os ultimos projetos publicados
  private CheerioLastestUpdatesHome($: CheerioAPI): ReleaseProject[] {
    const Projects: ReleaseProject[] = [];
    $(".col-sm-6").each((i, element) => {
      const thumbnail = $(element).find(".thumbnail");
      const cover_uri = thumbnail.attr("src");
      const subtitle = $(element).find(".events-subtitle > a");
      const href = subtitle.attr("href");
      Projects.push({
        id: cover_uri ? this.getSlugByUrl(cover_uri) : i,
        title: thumbnail.attr("alt") || "",
        cover_uri: cover_uri || "",
        lastChapter: {
          title: subtitle.text() || "",
          id: this.getSlugByUrl(href || ""),
          link: href || "",
          number: this.getNumberByUrl(href || ""),
          id_project: cover_uri ? this.getSlugByUrl(cover_uri) : i,
          release_date: $(element).find(".time").text().trim(),
        },
        link: href || "",
      });
    });
    return Projects;
  }

  private CheerioInfosProject($: CheerioAPI): Map<string, string> {
    const infos = new Map<string, string>();
    var lastKey = "";
    $(".dl-horizontal")
      .children()
      .get()
      .forEach((e, i) => {
        if (e.name === "dt") {
          const key = $(e).text().trim();
          infos.set(key, "");
          lastKey = key;
        } else if (e.name === "dd") {
          if (lastKey === "Categorias:") {
            const genres = $(e)
              .children()
              .map((i, element) => {
                return $(element).text().trim();
              });
            infos.set(lastKey, genres.get().join(", "));
            return;
          }
          infos.set(lastKey, $(e).text().trim());
        }
      });
    return infos;
  }

  //pega os dados de todos os projetos da home.
  public async getHome(): Promise<{
    lastestUpdates: ReleaseProject[];
    highlights: ReleaseProject[];
  }> {
    const { data, status } = await this.router.get("/");
    if (status !== 200) {
      throw new Error("Falha ao obter dados da home");
    }
    const $ = cheerio.load(data);
    const lastestUpdates = this.CheerioLastestUpdatesHome($);
    const highlights = this.CheerioHighlightsHome($);

    return { lastestUpdates, highlights };
  }

  //pega os dados de algum projeto usando o slug dele.
  public async getProjectByRelease(project: ReleaseProject): Promise<Project> {
    const { data, status } = await this.router.get("/manga/" + project.id);
    if (status !== 200) {
      throw new Error("Falha ao obter dados do projeto");
    }
    const $ = cheerio.load(data);
    const infos = this.CheerioInfosProject($);
    const description = $(".well > p").text().trim() || "Sem Sinopse";
    return {
      ...project,
      description,
      adult: infos.get("Categorias:")?.includes("Adulto") || false,
      status: infos.get("Status:") || "Sem Status",
      artist: infos.get("Artista(s):") || "Sem Artista",
      author: infos.get("Autor(es):") || "Sem Autor",
      genres: infos.get("Categorias:")?.split(", ") || [],
      alt_title: infos.get("Outros Nomes:") || "",
    };
  }

  public async getChaptersByProject(
    item: ReleaseProject | Project
  ): Promise<Project> {
    var project = { ...item };
    const { data, status } = await this.router.get("/manga/" + project.id);
    if (status !== 200) {
      throw new Error(
        "Falha ao obter os dados da pagina para obter os capítulos"
      );
    }
    const $ = cheerio.load(data);

    //caso seja um ReleaseProject pega o restante dos dados
    if (!Project.isProject(project)) {
      const infos = this.CheerioInfosProject($);
      const description = $(".well > p").text().trim() || "Sem Sinopse";
      project = {
        ...item,
        description,
        adult: infos.get("Categorias:")?.includes("Adulto") || false,
        status: infos.get("Status:") || "Sem Status",
        artist: infos.get("Artista(s):") || "Sem Artista",
        author: infos.get("Autor(es):") || "Sem Autor",
        genres: infos.get("Categorias:")?.split(", ") || [],
        alt_title: infos.get("Outros Nomes:") || "",
      };
    }

    const chapters: Chapter[] = [];
    $(".chapters > li").each((i, element) => {
      const chapter = $(element).find(".chapter-title-rtl");
      const link = chapter.find("a").attr("href") || "";
      const title = chapter.text().trim().replace(/\n/gi, "") || "";
      const action = $(element).find(".action");
      const number = link.replace(
        this.baseUrl + "/manga/" + project.id + "/",
        ""
      );
      chapters.push({
        title,
        link,
        id_project: project.id,
        id: this.getSlugByUrl(link) + "-" + number,
        number,
        release_date: action
          .find(".date-chapter-title-rtl")
          .text()
          .trim()
          .replace(/\n/gi, ""),
      });
    });
    project.chapters = chapters;
    return project;
  }

  public async getPagsByChapter(chapter: Chapter): Promise<Chapter> {
    const { data, status } = await this.router.get(
      `/manga/${chapter.id_project}/${chapter.number}`
    );

    if (status !== 200) {
      throw new Error("Falha ao obter os dados da pagina para obter as pags");
    }
    chapter.pags = [];
    const $ = cheerio.load(data);
    $("#all > .img-responsive").each((i, element) => {
      const img = $(element).attr("data-src")?.replace(/[ ]/gi, "") || "";
      chapter.pags?.push(img);
    });
    return chapter;
  }

  public async getProjectsBySearch(search: string) {
    //ainda não implementado
  }

  public async getProjectsByGenre(genre: string): Promise<ReleaseProject[]> {
    const { data, status } = await this.router.get("/manga-list");
    if (status !== 200) {
      throw new Error("Falha ao obter dados da pagina de listagem");
    }
    const $ = cheerio.load(data);
    const genres = new Map<string, string>();
    //pegando todos os generos e seu href
    $(".list-category > li").each((i, e) => {
      const li = $(e).find(".category");
      genres.set(li.text(), li.attr("href") || "");
    });

    const genreUrl = genres.get(genre);
    if (!genreUrl) return [];

    const { data: response, ...rest } = await this.router.get(
      `/filterList?page=1&cat=${genreUrl.replace(
        /.*cat=/,
        ""
      )}&alpha=&sortBy=name&asc=true&author=&artist=&tag=`
    );
    if (rest.status !== 200) {
      throw new Error("Falha ao obter dados dos projetos por genero");
    }
    const Projects: ReleaseProject[] = [];
    const $2 = cheerio.load(response);

    $2(".col-sm-6").each((i, element) => {
      const a = $(element).find(".thumbnail");
      const cover_uri = a.find("img").attr("src");
      const subtitle = $(element).find(".chart-title > a");
      const href = a.attr("href");
      Projects.push({
        id: cover_uri ? this.getSlugByUrl(cover_uri) : i,
        title: a.find("img").attr("alt") || "",
        cover_uri: cover_uri || "",
        lastChapter: {
          title: subtitle.text() || "",
          id: this.getSlugByUrl(href || ""),
          link: href || "",
          number: this.getNumberByUrl(href || ""),
          id_project: cover_uri ? this.getSlugByUrl(cover_uri) : i,
          release_date: $(element).find(".time").text().trim(),
        },
        link: href || "",
      });
    });
    return Projects;
  }
}

//use para testes caso seja necessario testar uma função especifica

/*
  const ReleaseProjectTest: ReleaseProject = {
  id: "takopii-no-genzai",
  title: "Takopii no Genzai",
  cover_uri:
    "http://amascan.com/uploads/manga/takopii-no-genzai/cover/cover_250x350.jpg",
  lastChapter: "#2. A Aventura de Takopii",
  link: "http://amascan.com/manga/takopii-no-genzai/2",
};*/

/*const ChapterTest:Chapter = {
    id: "takopii-no-genzai-1",
    id_project: "takopii-no-genzai",
    title: "A Aventura de Takopii",
    link: "http://amascan.com/manga/takopii-no-genzai/1",
    number: "1",
    release_date: "2020-01-01",
} */

new AmaScansProjects("https://amascan.com").getHome();
