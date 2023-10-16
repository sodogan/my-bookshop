//Test class using Jest and Supertest
const cds = require('@sap/cds');

describe('General tests', () => {
    jest.setTimeout(20 * 1000);

    const app = require('express')();
    const request = require('supertest')(app);


    let srv, Books

    beforeAll(async () => {
        srv = await cds.serve('CatalogService').from(__dirname + '/../srv/cat-service')
        BookSet = srv.entities.BookSet
        expect(BookSet).toBeDefined()
    })

    it('GETs all books', async () => {
        const books = await srv.read(BookSet, b => { b.title })
    
        expect(books).toMatchObject([
          { title: 'Wuthering Heights' },
          { title: 'Jane Eyre' },
          { title: 'The Raven' },
          { title: 'Eleonora' },
          { title: 'Catweazle' }
        ])

        });

});

