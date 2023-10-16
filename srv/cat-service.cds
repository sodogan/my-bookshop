
using { my.bookshop as shop } from '../db/cat-model';

@path:'/browse'
service CatalogService {
   entity BookSet as SELECT from shop.Books {
   * } 
   excluding { createdBy, modifiedBy };

  @readonly entity AuthorSet  as projection on shop.Authors;
  @insertonly entity OrderSet  as projection on shop.Orders;
  function sendGreeting() returns String;
}