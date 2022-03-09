export class Chapter {
  public id: string | number;
  public title: string;
  public number: string;
  public link: string;
  public release_date: string;
  public download_uri?: string;
  constructor(props: Chapter) {
    Object.assign(this, props);
  }
}
