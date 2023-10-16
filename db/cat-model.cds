using { managed,Country } from '@sap/cds/common';


namespace my.bookshop;

type Genre:String enum{
  Fiction;Mystery;Drama
}

aspect additionalInfo {
  genre:Genre;
  language:String(150);
}

entity Books:managed,additionalInfo {
    key ID : Integer;
    title  : localized String;
    author : Association to Authors;
    stock  : Integer;
  }

  entity Authors:managed {
    key ID : Integer;
    name   : String;
    books  : Association to many Books on books.author = $self;
  }

  entity Orders:managed  {
    key ID  : UUID;
    book    : Association to Books;
    country : Country;
    amount  : Integer;
  }
