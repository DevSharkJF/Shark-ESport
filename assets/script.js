const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponde = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHtml = text => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async(question, game, apiKey)=>{
    
}

const enviarFormulario = async(event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value
    if(apiKey == "" || game == "" || question == ""){
        alert('Falta campos para preencher')
        return
    }

    askButton.disable = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await perguntarAI(question,game,apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHtml(text)
        aiResponse.removeAttribute('hidden')
    }catch(error){
        alert('Tente novamente')
    }finally{
        askButton.disable = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit',enviarFormulario)