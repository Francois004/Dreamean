

export interface Album{
  id?: string;
  titre: string;
  downloads: number;
  weekdownloads:number;
  //listens: number;
  artiste:string;
  imgurl:string;
  songs:Array<Song>;
  createdAt:any;
  showed:boolean;
  isplayed:boolean;
  isvalidate:boolean;
  isrepeat:boolean;
  islooped:boolean;
  downloading:boolean;
  downloaded:boolean;
  categorie:string;
  progress:number;
  type:string;
  ids:Array<any>;
  prix:number;

}export class Song{
    id?: string;
    titre: string;
    downloads: number;
    weekdownloads:number;
    downloading:boolean;
    downloaded:boolean;
    listens: number;
    artiste:string;
    imgurl:string;
    isrepeat:boolean;
    islooped:boolean;
    songurl:string;
    feats:string;
    credits:string;
    createdAt:any;
    idalbum:string;
    isalbumsong:boolean;
    categorie:string;
    type:string;
    file:File;
    progress:number;
    isplayed:boolean;
    isliked:boolean;
    isvalidate:boolean;
    created:any;
    duration:any;
    seconds:any;
    likes:number;
    prix:number;
  constructor(file:File){
    this.file=file;
    
  }
  }
  export interface Playlist{
    id?: string;
    iduser:string;
    titre: string;
    downloads: number;
    //listens: number;
    artistes:Array<any>;
    imgurl:string;
    songs:Array<Song>;
    createdAt:any;
    showed:boolean;
    isplayed:boolean;
    isvalidate:boolean;
    isrepeat:boolean;
    downloading:boolean;
    downloaded:boolean;
    progress:number;
    type:string;
    ids:Array<any>;
  }
  export interface Catégorie{
    id?: string;
    titre:string;
    nom:string;
    subtitre: string;
    imgurl:string;
    songs:Array<Song>;
    showed:boolean;
    ids:Array<any>;
  }