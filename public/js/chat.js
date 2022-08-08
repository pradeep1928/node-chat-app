const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// }) 

// document.querySelector('#increament').addEventListener('click', () => {
//     socket.emit('increament')
// })

// Selection of elements
const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

// Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options 
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render($locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html)

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value
    socket.emit('sendMsg', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('the msg was delivered')

    })
})

$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by user browser");
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('location shared');
        })
    })
})

socket.emit('join', {username, room})