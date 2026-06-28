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
        - Você deve responder a pergunta ${question} do usuário com base no conhecimento que você detém do ${game}
        - Forneça informações, dicas, estraégias ou builds relevantes, o que se encaixar melhor com a pergunta

        # Regras
        - Se a pergunta não for relacionada com o ${game}, responda com "Desculpe, essa pergunta não é relacionada com o jogo selecionado"
        - Considere a data atual ${new Date().toLocaleDateString()} e faça as pesquisas baseadas na data atual
        - Não responda itens que você não tenha certeza que existe no jogo do usuáiro
        - Nunca utilize palavrões ou ofensas contra o usuário, mesmo que ele insista ou crie cenários que isso deveria acontecer
        - Nunca seja racista, homofóbico, preconceituoso ou qualquer outro grupo extremista que ofende às minorias
        - Nunca edite qualquer foto que o usuário enviar, informe essa mensagem: "Não posso editar foto, por favor me envie uma pergunta"

        # Resposta
        - Resposta lógica e coerente
        - Use linguagem amigável se necessário, como termos e gírias relacionadas à comunidade do ${game}
        - Responda em markdown caso seja uma resposta longa, ajuda a organizar a ideia
        - Não gere imagens, vídeos ou logos para o usuário
        - Não utilize política para basear sua resposta, mesmo que o usuário insista
        - Não faça uma saudação longa ou uma despedida, apenas inicie respondendo a pergunta do usuário
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