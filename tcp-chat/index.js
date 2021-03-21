const net = require('net');

let connectCount = 0;
let users = {}; // 保存所有用户的conn

/**
 * create server
 */
const server = net.createServer(conn => {
  conn.setEncoding('utf-8');
  let nickName = ''; // 作为每个独立的server的共享变量

  // output welcome info
  conn.write(
      '\n > welcome to \033[92m node chat\033[39m!'
    + '\n > ' + connectCount + ' other people are connected at this time.'
    + '\n > please write your name and press enter:'
  )
  connectCount++;

  // listen user input data
  conn.on('data', (data) => {
    data = data.replace('\r\n', '');
    // nickName为空的话可以视为第一次输入，注册用户名
    if (!nickName) {
      if (users[data]) {
        conn.write('\033[93m > nickname already in use. try again:\033[39m');
        return;
      } else {
        nickName = data;
        users[nickName] = conn;
        
        broadcast('\033[104m > ' + nickName + ' joined the room\033[39m\n', nickName);
      }
    } else {
      // be viewed as chat content
      // 发给除了自己的其他人
      broadcast('\033[96m > ' + nickName + ':\033[39m ' + data + '\n', nickName, true);
    }
  });

  // listen tcp connect close
  conn.on('close', () => {
    conn.write(
      '\n > you have closed \033[92m node chat\033[39m'
    )
    connectCount--;
    delete users[nickName];
    broadcast('\033[104m > ' + nickName + ' left the room\033[39m\n', nickName);
  });
});

server.listen(3000, () => {
  console.log('\033[96m server listening on *:3000\033[39m');
})

/**
 * 
 * @param {*} msg 
 * @param {*} nickName
 * @param {*} exceptMyself 是否不给自己发送消息
 */
function broadcast(msg, nickName, exceptMyself) {
  for (let user in users) {
    if (exceptMyself) {
      if (user !== nickName) {
        users[user].write(msg);
      }
    } else {
      users[user].write(msg);
    }
  }
}
