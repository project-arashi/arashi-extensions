export class ReleaseProject {
  public id: string | number;
  public title: string;
  public cover_uri: string;
  public banner_uri?: string;
  public lastChapter: string | number;
  public link: string;
  constructor(props: ReleaseProject) {
    Object.assign(this, props);
  }
  static createTest(): ReleaseProject {
    return {
      id: "takopii-no-genzai",
      title: "Takopii no Genzai",
      cover_uri:
        "http://amascan.com/uploads/manga/takopii-no-genzai/cover/cover_250x350.jpg",
      lastChapter: "#2. A Aventura de Takopii",
      link: "http://amascan.com/manga/takopii-no-genzai/2",
    };
  }
}
