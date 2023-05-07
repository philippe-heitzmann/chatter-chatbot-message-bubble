const CHAT_BUTTON_SIZE = 50
const CHAT_BUTTON_RADIUS = CHAT_BUTTON_SIZE / 2
const CHAT_BUTTON_BACKGROUND_COLOR = 'black'
const CHAT_BUTTON_ICON_COLOR = 'white'
const scriptTag = document.currentScript

const chatbotId = scriptTag.id ?? ''
const userId = scriptTag.getAttribute('idp') ?? ''
// const userId = scriptTag.idp ?? ''

function getChatButtonIcon() {
  const CHAT_BUTTON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" id="chatIcon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${CHAT_BUTTON_ICON_COLOR}" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
  `
  return CHAT_BUTTON_ICON
}

function getChatButtonCloseIcon() {
  const CHAT_BUTTON_CLOSE_ICON = `
  <svg id="closeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${CHAT_BUTTON_ICON_COLOR}" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `
  return CHAT_BUTTON_CLOSE_ICON
}

function handleChatWindowSizeChange(e, chatbotChatboxContainer) {
  if (e.matches) {
    chatbotChatboxContainer.style.height = '60vh'
  } else {
    chatbotChatboxContainer.style.height = '80vh'
  }
}

// don't render another message bubble if we're already inside an chatbot iframe
if (!window.location.pathname.startsWith('/chatbot-iframe')) {

  const chatButtonContainer = document.createElement('div')
  chatButtonContainer.setAttribute('id', 'chatter-chat-button-container')
  chatButtonContainer.style.position = 'fixed'
  chatButtonContainer.style.right = '20px'
  chatButtonContainer.style.bottom = '20px'

  // create the chat button element
  const chatButton = document.createElement('div')
  chatButton.setAttribute('id', 'chatter-chat-button')
  chatButton.style.display = 'flex'
  chatButton.style.position = 'sticky'
  chatButton.style.bottom = '20px'
  chatButton.style.width = CHAT_BUTTON_SIZE + 'px'
  chatButton.style.height = CHAT_BUTTON_SIZE + 'px'
  chatButton.style.borderRadius = CHAT_BUTTON_RADIUS + 'px'
  chatButton.style.backgroundColor = CHAT_BUTTON_BACKGROUND_COLOR
  chatButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
  chatButton.style.cursor = 'pointer'
  chatButton.style.zIndex = 1001
  chatButton.style.transition = 'all .2s ease-in-out'

  const chatbotChatboxContainer = document.createElement('div')
  chatbotChatboxContainer.setAttribute('id', 'chatter-chatbot-chatbox-container')
  chatbotChatboxContainer.style.position = 'fixed'
  chatbotChatboxContainer.style.right = '20px'
  chatbotChatboxContainer.style.bottom = '80px'
  chatbotChatboxContainer.style.display = 'none'

  // create the chatbot container element that'll contain the iframe
  const chatbotChatbox = document.createElement('div')
  chatbotChatbox.setAttribute('id', 'chatter-chatbot-chatbox')
  chatbotChatbox.style.position = 'sticky'
  chatbotChatbox.style.backgroundColor = 'white'
  chatbotChatbox.style.borderRadius = '10px'
  chatbotChatbox.style.boxShadow = 'rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px'
  chatbotChatbox.style.zIndex = 1000
  chatbotChatbox.style.bottom = '80px'
  chatbotChatbox.style.cursor = 'pointer'

  document.body.appendChild(chatButtonContainer)
  chatButtonContainer.appendChild(chatButton)


  chatButton.addEventListener('mouseenter', () => {
    chatButton.style.transform = 'scale(1.08)'
  })
  chatButton.addEventListener('mouseleave', () => {
    chatButton.style.transform = 'scale(1)'
  })

  document.body.appendChild(chatbotChatboxContainer)
  chatbotChatboxContainer.appendChild(chatbotChatbox)

  // create the chat button icon element
  const chatButtonIcon = document.createElement('div')

  // apply styles to the chat button icon
  chatButtonIcon.style.display = 'flex'
  chatButtonIcon.style.alignItems = 'center'
  chatButtonIcon.style.justifyContent = 'center'
  chatButtonIcon.style.width = '100%'
  chatButtonIcon.style.height = '100%'
  chatButtonIcon.style.zIndex = 1002
  chatButtonIcon.innerHTML = getChatButtonIcon()


  // add the chat button icon to the chat button element
  chatButton.appendChild(chatButtonIcon)

  // toggle the chat component when the chat button is clicked
  chatButton.addEventListener('click', () => {
    // toggle the chat component
    if (chatbotChatboxContainer.style.display === 'none') {
      chatbotChatboxContainer.style.display = 'flex'
      chatButtonIcon.innerHTML = getChatButtonCloseIcon()
    } else {
      chatbotChatboxContainer.style.display = 'none'
      chatButtonIcon.innerHTML = getChatButtonIcon()
    }
  })

  chatbotChatbox.innerHTML = `<iframe
    src="https://custom-gpt-ceb44.firebaseapp.com/chatbot-iframe/${chatbotId}?userId=${userId}"
    width="100%"
    height="100%"
    frameborder="0"
    ></iframe>`

  // original dimensions are set for mobile/small viewports
  // this media query will adjust styling for desktop (> 500px)
  const mediaQuery = window.matchMedia('(min-width: 500px)')
  // Register event listener
  mediaQuery.addEventListener('change', (q) => handleChatWindowSizeChange(q, chatbotChatboxContainer))

  // Initial check
  handleChatWindowSizeChange(mediaQuery, chatbotChatboxContainer)
}