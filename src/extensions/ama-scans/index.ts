import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { Project } from "./entidades/Project";
import { ReleaseProject } from "./entidades/ReleaseProject";

const ReleaseProjectTest = ReleaseProject.createTest();

export class AmaScans {
  private baseUrl = "https://amascan.com";
  private router = axios.create({
    baseURL: this.baseUrl,
  });
  private getSlugByUrl(url: string): string {
    const item = url.includes("uploads")
      ? `${this.baseUrl.replace("https", "http")}/uploads/manga/`
      : `${this.baseUrl}/manga/`;
    return url.replace(item, "").replace(/\/.*/, "");
  }

  //cria o array para os projetos em destaque
  private getHighlights($: CheerioAPI): ReleaseProject[] {
    const highlights: ReleaseProject[] = [];
    $(".span3").each((i, element) => {
      const img = $(element).find(".thumbnail > img");

      const cover_uri = img.attr("src") || "";
      const id = this.getSlugByUrl(cover_uri);
      const title = img.attr("alt") || "";
      const lastChapter = $(element).find(".well > p > a");
      highlights.push({
        id,
        title,
        link: lastChapter.attr("href") || "",
        cover_uri,
        lastChapter: lastChapter.text() || "",
      });
    });

    return highlights;
  }
  //cria o array para os ultimos projetos publicados
  private getLastestUpdates($: CheerioAPI): ReleaseProject[] {
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
        lastChapter: subtitle.text() || "",
        link: href || "",
      });
    });
    return Projects;
  }
  //pega os dados de todos os projetos da home.
  public async getHome(): Promise<{
    lastestUpdates: ReleaseProject[];
    highlights: ReleaseProject[];
  }> {
    const { data, status } = await this.router.get("/");
    if (status !== 200) {
      throw new Error("Failed to get home page");
    }
    const $ = cheerio.load(data);
    const lastestUpdates = this.getLastestUpdates($);
    const highlights = this.getHighlights($);

    return { lastestUpdates, highlights };
  }

  public async getProjectBySlug(project: ReleaseProject): Promise<Project> {
    const { data, status } = await this.router.get("/manga/" + project.id);
    if (status !== 200) {
      throw new Error("Failed to get project by slug");
    }
    const $ = cheerio.load(data);
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
}

new AmaScans().getProjectBySlug(ReleaseProjectTest);
