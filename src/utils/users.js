const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "username and room are required.",
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "username already existed",
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// Removing the user 
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// retriving user from all room 
const getUser = (id) => {
    return users.find((user) => user.id === id);
}

// Get all users from a perticular room 
const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}