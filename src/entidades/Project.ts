import { Chapter } from "./Chapter";
export class Project {
  public id: string | number;
  public title: string;
  public alt_title: string[] | string;
  public description: string;
  public cover_uri: string;
  public banner_uri?: string;
  public status: string;
  public genres: string[] | number[];
  public author: string;
  public artist: string;
  public adult: boolean;
  public lastChapter: {
    title: string;
    number: number;
    publish_at: string;
  };
  public chapters?: Chapter[];
  constructor(props: Project) {
    Object.assign(this, props);
  }
  static isProject(data: any): data is Project {
    return (data as Project).description !== undefined;
  }
}
