const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// }) 

// document.querySelector('#increament').addEventListener('click', () => {
//     socket.emit('increament')
// })

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('sendMsg', message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('the msg was delivered')

    })
})

document.querySelector('#sendLocation').addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by user browser");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('location shared');
        })
    })
})