export class User{
    id: string;
    prenom: string;
    nom:string;
    mail:string;
    imgurl:string;
    num:string;
    favoritesarticles:Array<any>;
    listenssong:Array<any>;
    favoritessong:Array<any>;
    sawnarticles:Array<any>;
    recents:Array<any>;
    downloadeds:Array<any>;
    fordownloads:Array<any>;
    payeds:Array <any>;
    playlists:Array<any>;
    ispremium:boolean;
    timestop:number;
    isadmin:boolean;
    createdAt:number;
    endAt:number;
    enddate:string;
    createddate:string;
  } ;
  export class Artiste{
    id:string;
    imgurl:string;
    albums:Array<any>;
    songs:Array<any>;
    fans:Array<any>;
    bio:string;
    nom:string;
    num:string;
  }