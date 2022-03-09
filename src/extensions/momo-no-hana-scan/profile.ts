import { ProfileScan } from "../../entidades/ProfileScan";

const profile = new ProfileScan({
    name:"Momo No Hana Scan",
    logo_uri:"https://cdn.statically.io/img/momonohanascan.com/wp-content/uploads/2017/10/LOGO.png?quality=90&f=auto",
    website_uri:"https://www.momonohanascan.com",
    recruiting_uri:"https://www.momonohanascan.com/recrutamento/",
    donation_uri:"https://www.momonohanascan.com/doacao/",
    social:[
        {
            name:"facebook",
            uri:"https://www.facebook.com/momonohanascanlation"
        },
        {
            name:"discord",
            uri:"https://discord.com/invite/zNkt9a8Mnk"
        },
        {
            name:"facebook:shoujobrasil",
            uri:"https://www.facebook.com/Sh0ujoBr4sil"
        }
    ]
})

export default profile