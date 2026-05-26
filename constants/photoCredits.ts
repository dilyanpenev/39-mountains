export interface PhotoCredit {
  mountainName: string
  author: string
  url?: string
}

const AVTORI: Record<string, string> = {
    az: 'Dilyan Penev',
    sani: 'Aleksandrina Garlyanska',
    didi: 'Delyana Raykova'
}

export const PHOTOCREDITS: PhotoCredit[] = [
  {
    mountainName: 'Musala',
    author: 'John Doe',
    url: 'https://commons.wikimedia.org/',
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
    mountainName: 'Ruen',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Milevets',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Lyubash',
    author: AVTORI["didi"],
  },
  {
    mountainName: 'Plocha',
    author: AVTORI["sani"],
  },
  {
    mountainName: 'Sirishtnishka Rudina',
    author: AVTORI["didi"],
  },
]