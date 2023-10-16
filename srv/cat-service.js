/* Disabled as dummy data is loaded
let dummy = function (srv) {

    let discount = '-10 percent discounted';
    // Reply mock data for Books...
    let handler  = function () {
        let dummyData = 
        [
            { ID: 201, title: 'Freedom from the Known', author_ID: 101, stock: 12 },
            { ID: 251, title: 'The Raven', author_ID: 150, stock: 333 },
            { ID: 252, title: 'Eleonora', author_ID: 150, stock: 555 },
            { ID: 271, title: 'Catweazle', author_ID: 170, stock: 222 },
        ];
        return dummyData;
    };
    srv.on('READ', 'BookSet', handler);

// Reply mock data for Authors...
srv.on('READ', 'AuthorSet', () => [
    { ID: 101, name: 'Emily Brontë' },
    { ID: 150, name: 'Edgar Allen Poe' },
    { ID: 170, name: 'Richard Carpenter' },
])

}
*/
let validate = function (srv) {

  let { Books } = cds.entities('my-bookshop');


  srv.on('sendGreeting', async (req) => {
    const event = {
      myEventProperty: 'my message payload'
    }

    srv.emit('myEventName', event)

    return "Successfully sent event of type myEventName"
  })

  //Handler here for the custom event
  srv.on('myEventName', (msg) => {
    console.log('==> Received msg of type myEventName:' + msg.data.myEventProperty)
  });

  srv.before('*', (req) => {
    const data = req.data;
    console.debug(' >>>> ' + data);

  });

  srv.before('CREATE', 'AuthorSet', (req) => {
    const data = req.data;
    console.log(data);

  });


  // Reduce stock of ordered books
  srv.before('CREATE', 'OrderSet', async (req) => {
    const order = req.data
    if (!order.amount || order.amount <= 0)
      return req.error(400, 'Order at least 1 book')
    const tx = cds.transaction(req)
    const affectedRows = await tx.run(
      UPDATE(Books)
        .set({ stock: { '-=': order.amount } })
        .where({ stock: { '>=': order.amount },/*and*/ ID: order.book_ID })
    )
    if (affectedRows === 0) req.error(409, "Sold out, sorry")
  })

  srv.after('READ', 'BookSet', (each) => {


    if (each.stock > 300) {
      each.title += ' -10 discounted';
    }
  });

  

};


module.exports = validate;
