export class ReleaseProject {
  public id: string | number;
  public title: string;
  public cover_uri: string;
  public banner_uri?: string;
  public lastChapter: {
    title: string;
    number: number;
    publish_at: string;
  };
  public link: string;
  constructor(props: ReleaseProject) {
    Object.assign(this, props);
  }
}
