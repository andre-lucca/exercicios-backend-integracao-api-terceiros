const express = require('express')
const axios = require('axios').default
const qs = require('qs')
const fs = require('fs/promises')

const app = express()

app.use(express.json())

app.get('/empresas/:dominioEmpresa', async (req, res) => {
  const { dominioEmpresa } = req.params

  try {
    const baseURL = 'https://companyenrichment.abstractapi.com/v1/?'
    const search = {
      api_key: 'e77e04fa34f8458c9a7ef6c5993b8eb2',
      domain: dominioEmpresa
    }

    const company = qs.stringify(search)
    const { data: companyData } = await axios.get(baseURL + company)

    if (companyData.name) {
      const empresas = JSON.parse(await fs.readFile('empresas.json'))
      empresas.push(companyData)
      await fs.writeFile('./empresas.json', JSON.stringify(empresas))
    }

    return res.json(companyData)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

app.listen(3000, () => console.log('Server running on: http://localhost:3000'))