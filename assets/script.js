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
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
        # Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        # Tarefa
        Você deve responder a pergunta ${question} do usuário com base no conhecimento que você detém do jogo, fornecendo dicas, estratégias ou builds relevantes

        # Regras
        - Se a pergunta não for relacionada com o jogo, responda com "Desculpe, essa pergunta não é relacionada com o jogo selecionado"
        - Considere a data atual ${new Date().toLocaleDateString()}

        # Resposta
        - Resposta lógica e coerente
        - Use linguagem amigável se necessário, como termos e gírias relacionadas ao jogo
        - Responda em markdown caso seja uma resposta longa, ajuda a organizar a ideia
        - Não gere imagens ou vídeos para o usuário
    `
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search:{}
    }]

    const response = await fetch(geminiURL, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos.')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await perguntarAI(question,game,apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHtml(text)
        aiResponse.removeAttribute('hidden');
    }catch(error){
        alert('Ocorreu um erro ao enviar a pergunta. Por favor, tente novamente.')
    }finally{
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit', enviarFormulario)