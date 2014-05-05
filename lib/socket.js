// export function for listening to the socket
module.exports = function (socket) {
  //var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    message: 'success!!!!!!!'
  });
  
};
