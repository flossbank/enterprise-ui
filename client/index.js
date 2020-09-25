import fetch from 'isomorphic-fetch'

export const fetchOrgDeps = async () => {
  return { blah: 'true '}
}

export const completeGHLogin = async ({ code, state }) => {
  return fetchThenJson('api/organization/github-auth', optionsWithPostBody({ code, state }))
}

export const logout = async () => {
  return fetchThenJson('api/user/logout', optionsWithPostBody())
}

export const donate = async ({ amount, billingToken }) => {
  return fetchThenJson('api/organization/create-donation', optionsWithPostBody({ amount, billingToken }))
}

export const updateDonation = async ({ amount }) => {
  return fetchThenJson('api/organization/update-donation', optionsWithPutBody({ amount }))
}

export const deleteDonation = async () => {
  return fetchThenJson('api/organization/delete-donation', optionsDeleteRequest())
}

export const sendSupportFeedback = async ({ email, name, topic, body }) => {
  return fetchThenJson('api/support/feedback', optionsWithPostBody({ email, topic: `ENTERPRISE- ${topic}`, name, body }))
}

export const fetchDonationInfo = async () => {
  return fetchThenJson('api/organization/get-donation-info', optionsGetRequest())
}

export const resume = async () => {
  return fetchThenJson('api/organization/resume', optionsGetRequest())
}

const fetchThenJson = (url, options) => fetch(url, options)
  .then(res => {
    if (!res.ok) {
      throw res
    }
    return res.json()
  })

const optionsWithPostBody = (body) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XmlHttpRequest'
    },
    body: JSON.stringify(body)
  }
}

const optionsWithPutBody = (body) => {
  return {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XmlHttpRequest'
    },
    body: JSON.stringify(body)
  }
}

const optionsDeleteRequest = () => {
  return {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-requested-with': 'XmlHttpRequest'
    }
  }
}

const optionsGetRequest = () => {
  return {
    method: 'GET'
  }
}
