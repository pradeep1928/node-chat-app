const generateMessage = (text) => {
    return {
        text, 
        createdAt: new Date().getTime()
    }
}

const generatLocationMessage = (url) => {
    return {
        url, 
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generatLocationMessage
}