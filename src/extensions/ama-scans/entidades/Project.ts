export class Project {
  public id: string | number;
  public title: string;
  public alt_title: string[] | string;
  public description: string;
  public cover_uri: string;
  public banner_uri?: string;
  public status:string;
  public genres: string[] | number[];
  public author:string
  public artist:string
  public adult: boolean;
  public lastChapter: string | number;
  constructor(props: Project) {
    Object.assign(this, props);
  }
}
