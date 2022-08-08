const socket = io()

socket.on('countUpdated', (count) => {
    console.log('the count has been updated', count)
}) 

document.querySelector('#increament').addEventListener('click', () => {
    socket.emit('increament')
})