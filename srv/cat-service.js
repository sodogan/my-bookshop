const cds = require('@sap/cds')

let service_handler = function (srv) {

  //const { Books ,Authors } = cds.entities

  //Before all requests
  /*
  srv.before('*', (req) => {
    const data = req.data;
    console.debug(' >>>> ' + data);
    console.log(Books);
  });
  */

  //Custom function 
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


  //After read Bookset
  srv.after('READ', 'BookSet', (each, req) => {
    if (each.stock > 300) {
      each.title += ' -10 discounted';
    }
    /*
    console.log(each.author.ID);
    console.log(req.method);

    cds.transaction(req).run(
      SELECT.from(Authors).columns('ID', 'name')
        .where({ ID: { in: Object.keys(each.author.ID) } })
    ).then(items =>
      console.log(items))
        */
  });


  //After read AuthorSet
  srv.after('READ', 'AuthorSet', (each) => {
    if (each.ID > 300) {
      each.title += ' -10 discounted';
    }
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


};


module.exports = cds.service.impl(service_handler);
