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
}
