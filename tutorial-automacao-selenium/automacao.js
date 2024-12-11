const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const fs = require('fs')
const path = require('path')

const paginas = [{
    nome: 'Amazon',
    url: 'https://www.amazon.com.br/'
}, {
    nome: 'Magazine Luiza',
    url: 'https://www.magazineluiza.com.br/'
}, ]


const { log, info } = console

async function processarPaginas() {
    log('Iniciando processo...')
    const driver = await new Builder().forBrowser('chrome').build()

    try {
        for (const pagina of paginas) {
            const { nome, url } = pagina
            log('Processando página ' + nome)

            await driver.get(url)
            log('Processou GET ' + nome)
            await driver.wait(until.elementLocated(By.css('body')), 5000)
            log('Processou WAIT ' + nome)

            await driver.manage().window().setRect({ width: 1920, height: 1080 })

            // Just to keep the example

            await driver.executeScript(`
                document.body.style.backgroundColor = "red";
                `)


            const captureTela = await driver.takeScreenshot()
            const caminhoPasta = path.join(__dirname, nome + '.png')
            fs.writeFileSync(caminhoPasta, captureTela, 'base64')
            log('Captura de Tela Salva em ' + caminhoPasta)
        }

    } finally {
        log('driver.quit()')
        await driver.quit()
        log('driver.quit() ***')
    }
}

processarPaginas()