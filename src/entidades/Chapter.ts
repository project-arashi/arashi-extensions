export class Chapter {
  public id: string | number;
  public title: string;
  public number: string;
  public link: string;
  public release_date: string;
  public download_uri?: string;
  public pags?: string[];
  constructor(props: Chapter) {
    Object.assign(this, props);
  }
}
