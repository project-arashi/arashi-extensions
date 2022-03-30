import { ProfileScan } from "../../entidades/ProfileScan";

const profile = new ProfileScan({
    name:"Tao Sect",
    logo_uri:"https://taosect.com/wp-content/themes/taosect-theme/img/logo.png",
    website_uri:"https://taosect.com/leitor-online/",
    donation_uri:"",
    recruiting_uri:"",
    social:[
        {
            name:"facebook",
            uri:"https://www.facebook.com/TaoSect/"
        },
        {
            name:"discord",
            uri:"https://www.discord.gg/p5VzTBK"
        }
    ]
})

export default profile