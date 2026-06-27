export interface PhotoCredit {
  mountainName: string
  author: string
  url?: string
}

const AVTORI: Record<string, string> = {
    az: 'Dilyan Penev',
    sani: 'Aleksandrina Garlyanska',
    didi: 'Delyana Raykova',
    mini: 'Mina Nedin',
}

export const PHOTOCREDITS: PhotoCredit[] = [
  {
    mountainName: 'Musala',
    author: 'Ysmiv4ica',
    url: 'https://commons.wikimedia.org/wiki/File:Musala_bg_30072011.JPG',
  },
  {
    mountainName: 'Vihren',
    author: AVTORI["az"],
  },
  {
    mountainName: 'Botev',
    author: AVTORI["az"],
  },
  {
    mountainName: 'Cherni vrah',
    author: AVTORI["mini"],
  },
  {
    mountainName: 'Ruen',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Gotsev vrah',
    author: 'Deyan Vasilev',
    url: 'https://commons.wikimedia.org/wiki/File:Gotsev_vruh_IMG_4398.jpg',
  },
  {
    mountainName: 'Golyam Perelik',
    author: 'Spv8',
    url: 'https://commons.wikimedia.org/wiki/File:Perelik_hut.jpg',
  },
  {
    mountainName: 'Radomir',
    author: 'Ira Kyurpanova',
    url: 'https://commons.wikimedia.org/wiki/File:Връх_Радомир.JPG',
  },
  {
    mountainName: 'Ogreyak',
    author: 'Deyan Vasilev',
    url: 'https://commons.wikimedia.org/wiki/File:Kadiitsa_IMG_9979.jpg',
  },
  {
    mountainName: 'Ilyov vrah',
    author: 'Deyan Vasilev',
    url: 'https://commons.wikimedia.org/wiki/File:Dzhama_IMG_9921.jpg',
  },
  {
    mountainName: 'Bilo',
    author: 'Georgi Pantaleev',
    url: 'https://www.facebook.com/photo/?fbid=10239819541616546&set=pcb.1860809794542843',
  },
  {
    mountainName: 'Milevets',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Rui',
    author: 'Konstantin Kotsev',
    url: 'https://commons.wikimedia.org/wiki/File:V.Ruj.jpg',
  },
  {
    mountainName: 'Bilska Chuka',
    author: 'Kochev',
    url: 'https://commons.wikimedia.org/wiki/File:Peak_Bilska_chuka.JPG',
  },
  {
    mountainName: 'Bogdan',
    author: 'Termininja',
    url: 'https://commons.wikimedia.org/wiki/File:Bogdan_Peak.jpg',
  },
  {
    mountainName: 'Vrashnik',
    author: 'geolub',
    url: 'https://geograf.bg/bg/article/esennite-cvetove-na-kyustendilskiya-kray',
  },
  {
    mountainName: 'Aramliya',
    author: 'Mariya Ilieva',
    url: 'https://www.facebook.com/photo?fbid=10159102763248948&set=pcb.826711874619312',
  },
  {
    mountainName: 'Viden',
    author: 'Nikolay Katsarski',
    url: 'https://geograf.bg/bg/content/na-prveneca-na-konyavska-planina',
  },
  {
    mountainName: 'Golemi vrah',
    author: 'geolub',
    url: 'https://geograf.bg/bg/article/20-vpechatlyavashchi-mesta-v-pernishko-chast-i',
  },
  {
    mountainName: 'Golyam Debelets',
    author: 'Kristiana Ivanova',
    url: 'https://geograf.bg/bg/content/na-prveneca-na-verila-planina-golyam-debelec',
  },
  {
    mountainName: 'Lyubash',
    author: AVTORI["didi"],
  },
  {
    mountainName: 'Strazha',
    author: 'Konstantin Kotsev',
    url: 'https://commons.wikimedia.org/wiki/File:V.Paramunski.jpg',
  },
  {
    mountainName: 'Beli Kamak',
    author: 'Valentin Tashkov',
    url: 'https://geograf.bg/bg/content/gledka-ot-prvenect-na-kobilska-planina-beli-kamk',
  },
  {
    mountainName: 'Manastirishte',
    author: 'Michal Valach',
    url: 'https://commons.wikimedia.org/wiki/File:Плана_-_ЗЗ_по_директивата_за_местообитанията_–_ZZ1307_–_до_с._Плана,_връх_Манастирище_-_No7.jpg',
  },
  {
    mountainName: 'Plocha',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Zemenska',
    author: AVTORI["az"],
  },
  {
    mountainName: 'Dupevitsa',
    author: 'Nikolay Rainov',
    url: 'https://commons.wikimedia.org/wiki/File:Lyulin-Mountain.jpg',
  },
  {
    mountainName: 'Golemi vrah Ezdemirska',
    author: 'Kalisto9898',
    url: 'https://commons.wikimedia.org/wiki/File:20160930_Ezdimirska_planina.jpg',
  },
  {
    mountainName: 'Konski vrah',
    author: 'Spiritia',
    url: 'https://commons.wikimedia.org/wiki/File:Penkyovska_Mountain_1.jpg',
  },
  {
    mountainName: 'Kitka',
    author: 'Termininja',
    url: 'https://commons.wikimedia.org/wiki/File:Zavalska_Kitka_Peak.jpg',
  },
  {
    mountainName: 'Golo Bardo',
    author: 'SvetliNNaydenov',
    url: 'https://commons.wikimedia.org/wiki/File:View_to_Golo_Bardo_mountain.JPG',
  },
  {
    mountainName: 'Golesh',
    author: 'Katq Petrova',
    url: 'https://www.facebook.com/photo/?fbid=10212410548895062&set=pcb.1538330876790738',
  },
  {
    mountainName: 'Chekanska buka',
    author: 'Hristo Krastev',
    url: 'https://www.facebook.com/photo/?fbid=25646348004951265&set=pcb.1850056798951476',
  },
  {
    mountainName: 'Tumba',
    author: 'Vassia Atanassova',
    url: 'https://commons.wikimedia.org/wiki/File:Tumba-peak-in-Cherna-Gora-mountain-2.jpg',
  },
  {
    mountainName: 'Sirishtnishka Rudina',
    author: AVTORI["didi"],
  },
  {
    mountainName: 'Bozdag',
    author: 'Deyan Vasilev',
    url: 'https://commons.wikimedia.org/wiki/File:Bozdag_IMG_0672.jpg',
  },
  {
    mountainName: 'Sakar',
    author: 'Evgeni Dinev',
    url: 'https://commons.wikimedia.org/wiki/File:Sakar_Mountain_Bulgaria.jpg',
  },
  {
    mountainName: 'Golyamo Gradishte',
    author: 'Boyan Petrov',
    url: 'https://geograf.bg/bg/article/taynite-na-strandzha-planina',
  },
  {
    mountainName: 'Onboarding Graphics',
    author: 'Katerina Limpitsouni',
    url: 'https://undraw.co/illustrations',
  },
]