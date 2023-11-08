import axios from 'axios'

interface ApiCallRequest {
  query: string
  dataInput: object
}

export async function makeApiCall({ query, dataInput }: ApiCallRequest) {
  const response = await axios({
    url: 'http://localhost:4000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: {
      query,
      variables: {
        data: dataInput,
      },
    },
  })

  return response
}
