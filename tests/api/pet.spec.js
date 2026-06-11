import { expect, test } from '@playwright/test'

import pet from '../../data/json/pet.json'

import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'



const petAlterado = pet
let token = ''

test.describe.serial('Testes positivos da entidade Pet', async () => {

    test('POST pet com sucesso', async ({ request }) => {
        // JSON do pet

        // Realiza a requisição, passando o JSON

        const response = await request.post('pet', {
            data: pet
        })
        // Validações
        expect(response.status()).toBe(200)
        expect(await response.json()).toStrictEqual(pet)
    })

    test('GET pet com sucesso', async ({ request }) => {
        const response = await request.get(`pet/${pet.id}`)

        expect(response.status()).toBe(200)
        const responseJson = await response.json()
        expect(responseJson.id).toBe(pet.id)
        expect(responseJson.category.id).toBe(pet.category.id)
        expect(responseJson.category.name).toBe(pet.category.name)
        expect(responseJson.name).toBe(pet.name)
        expect(responseJson.photoUrls).toEqual(pet.photoUrls)
        expect(responseJson.tags[0].id).toBe(pet.tags[0].id)
        expect(responseJson.tags[0].name).toBe(pet.tags[0].name)
        expect(responseJson.tags[1].id).toBe(pet.tags[1].id)
        expect(responseJson.tags[1].name).toBe(pet.tags[1].name)
        expect(responseJson.status).toBe(pet.status)
    })

    test('PUT pet com sucesso', async ({ request }) => {

        //const petAlterado = pet
        petAlterado.status = 'sold'

        const response = await request.put('pet', {
            data: petAlterado
        })

        expect(response.status()).toBe(200)
        expect(await response.json()).toEqual(petAlterado)

    })

    test('Login user com sucesso', async ({ request }) => {
        const response = await request.get('user/login', {
            params: {
                username: 'snoopy',
                password: 12345
            }
        })

        expect(response.status()).toEqual(200)
        const responseBody = await response.json() //logged in user session:
        expect(responseBody.message).toContain('logged in user session:')

        let message = responseBody.message.split(':') // ['logged in user...']
        console.log(message)
        token = message[1]
        console.log(token)
    })

    test('DELETE pet com sucesso', async ({ request }) => {
        const response = await request.delete(`pet/${petAlterado.id}`, {
            headers: {
                apiToken: `Bearer ${token}`
            }
        })


        expect(response.status()).toBe(200)
        const responseJson = await response.json()
        expect(responseJson.code).toEqual(200)
        expect(responseJson.type).toEqual("unknown")
        expect(responseJson.message).toEqual(petAlterado.id.toString())

    })

    const massa = parse(readFileSync('data/csv/pets.csv'), {
        columns: true
    })

    massa.forEach(linha => {
        test(`POST pet DDT - ${linha.name}`, async ({ request }) => {
            const pet = {}
            pet.id = linha.id
            pet.category = {}
            pet.category.id = linha.categoryId
            pet.category.name = linha.categoryName
            pet.name = linha.name
            pet.photoUrls = linha.photoUrls.split(':')
            pet.tags = []

            let tags = linha.tags.split(':')
            tags.forEach(tag => {
                let tagFormatada = tag.split(';')
                let novaTag = {
                    id: tag[0],
                    name: tag[1]
                }
                pet.tags.push()
            })
            pet.status = linha.status
        })
    })

})
