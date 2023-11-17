import axios, { AxiosResponse } from 'axios'

interface ApiCallRequest<TDataInput> {
  query: string
  token?: string
  dataInput?: TDataInput
}

export async function makeApiCall<TDataInput, TResponseData>({
  query,
  dataInput,
  token,
}: ApiCallRequest<TDataInput>): Promise<AxiosResponse<TResponseData>> {
  const response = await axios({
    url: 'http://localhost:4000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      authorization: token ? token : '',
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
