export class ProfileScan {
  public website_uri: string;
  public name: string;
  public donation_uri: string;
  public logo_uri: string;
  public social: {
    name: string;
    uri: string;
  }[];
  public recruiting_uri: string;
  constructor(props: ProfileScan) {
    Object.assign(this, props);
  }
}
