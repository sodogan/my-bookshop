
using { my.bookshop as shop } from '../db/cat-model';


service CatalogService {
  @readonly entity BookSet  as projection on shop.Books;
  entity AuthorSet  as projection on shop.Authors;
  entity OrderSet  as projection on shop.Orders;
}