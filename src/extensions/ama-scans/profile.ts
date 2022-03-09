import { ProfileScan } from "../../entidades/ProfileScan";

const profile = new ProfileScan({
  name: "AMA Scans",
  logo_uri: "http://amascan.com/uploads/logo.png",
  website_uri: "http://amascan.com",
  donation_uri: "https://amascan.com/doacao-ama-scan",
  recruiting_uri: "https://amascan.com/recrutamento-ama-scan",
  social: [
    {
      name: "twitter",
      uri: "https://twitter.com/amagrupo",
    },
    {
      name: "instagram",
      uri: "https://www.instagram.com/ama_scans/",
    },
    {
      name: "youtube",
      uri: "https://www.youtube.com/c/AmaGrupo",
    },
  ],
});

export default profile;
