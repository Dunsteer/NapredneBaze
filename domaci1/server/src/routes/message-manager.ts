import { isObject } from "util";

import { PubsubManager } from 'redis-messaging-manager';

let messenger = new PubsubManager({
    host: 'localhost'
});

// const RedisSMQ = require("rsmq");
// const rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379 });
import { driver } from './api';
import { json } from "body-parser";

let _io;

export default messenger;

messenger.consume('reservationsResponse')
    .subscribe(async msg => {
        console.log(msg);
        const resp = JSON.parse(msg);
        console.log("Message received.", resp)
        if (resp.accepted) {
            debugger;
            const session = driver.session();
            const query = `MATCH (n:seats)
            WHERE id(n)= ${resp.seatsId}
            SET n.taken = n.taken+1
            RETURN n`;
            const obj = await session.run(query);

            console.log(obj);
        }

        _io.emit('response', msg);
    });

// rsmq.createQueue({ qname: "reservations" }, function (err, resp) {
//     if (resp === 1) {
//         console.log("queue created")
//     }
// });

// rsmq.createQueue({ qname: "reservationsResponse" }, function (err, resp) {
//     if (resp === 1) {
//         console.log("queue created")
//     }
// });

// rsmq.receiveMessage({ qname: "reservationsResponse" }, function (err, resp) {
//     console.log(err, resp);
//     if (resp.id) {

//         const session = driver.session();

//         session.run(`MATCH (n:seats)
//                             where id(n)= ${resp.seatsId}
//                             SET n.taken = n.taken+1
//                             RETURN n`)
//             .then(x => {
//                 if (x.records.length > 0) {
//                     _io.emint('response', x.records[0].toObject());
//                 }
//             });


//         console.log("Message received.", resp)
//     }
//     else {
//         console.log("No messages for me...")
//     }
// });

function socket(io) {
    _io = io;
}

module.exports = {
    messenger,
    io: socket
};


