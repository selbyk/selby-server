import os from 'os';
import moment from 'moment';

let service = (io) => {
  let broadcastLoop = () => {
    io.broadcast('server', {
      type: os.type(),
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      uptime: moment.duration(os.uptime(), 'seconds').humanize(),
      loadavg: os.loadavg().map((load)=>{return load.toFixed(2);}),
      loadpercent: (os.loadavg()[0]*100/os.cpus().length).toFixed(2),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      mempercent: (((os.totalmem()-os.freemem())/os.totalmem())*100).toFixed(2),
      cpus: os.cpus()
    });
    setTimeout(broadcastLoop, 1000);
  };
  broadcastLoop();
};

module.exports = service;
