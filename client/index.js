import fetch from 'isomorphic-fetch'

export const fetchOrgOssUsage = async ({ orgId }) => {
  return fetchThenJson(`api/organization/get-oss-usage?organizationId=${orgId}`, optionsGetRequest())
}

export const getOrganization = async ({ orgId, noAuth = false }) => {
  return fetchThenJson(`api/organization/get?organizationId=${orgId}&noAuth=${noAuth}`, optionsGetRequest())
}

export const isUserAllowedToViewOrgSettings = async ({ orgId }) => {
  return fetchThenJson(`api/user/is-github-organization-admin?organizationId=${orgId}`, optionsGetRequest())
}

export const fetchOrgsByName = async ({ name, host }) => {
  return fetchThenJson(`api/organization/get-by-name?name=${name}&host=${host}`, optionsGetRequest())
}

export const installOrg = async ({ installationId }) => {
  return fetchThenJson('api/organization/github-create', optionsWithPostBody({ installationId }))
}

export const completeGHLogin = async ({ code, state }) => {
  return fetchThenJson('api/organization/github-auth', optionsWithPostBody({ code, state }))
}

export const logout = async () => {
  return fetchThenJson('api/organization/logout', optionsWithPostBody())
}

export const donate = async ({ amount, billingToken, organizationId }) => {
  return fetchThenJson('api/organization/create-donation', optionsWithPostBody({ amount, billingToken, organizationId }))
}

export const updateOrgEmail = async ({ organizationId, billingEmail }) => {
  return fetchThenJson('api/organization/update', optionsWithPostBody({ billingEmail, organizationId }))
}

export const updateOrgBillingInfo = async ({ billingToken, organizationId }) => {
  return fetchThenJson('api/organization/update', optionsWithPostBody({ billingToken, organizationId }))
}

export const updatePublicallyGive = async ({ organizationId, publicallyGive }) => {
  return fetchThenJson('api/organization/update', optionsWithPostBody({ publicallyGive, organizationId }))
}

export const updateDescription = async ({ organizationId, description }) => {
  return fetchThenJson('api/organization/update', optionsWithPostBody({ description, organizationId }))
}

export const getOrgDonationLedger = async ({ orgId, limit, offset }) => {
  let url = `api/organization/get-donation-ledger?organizationId=${orgId}`

  if (limit) {
    url += `&limit=${limit}`
  }
  if (offset) {
    url += `&offset=${offset}`
  }

  return fetchThenJson(url, optionsGetRequest())
}

export const updateDonation = async ({ amount, organizationId, globalDonation }) => {
  return fetchThenJson('api/organization/update-donation', optionsWithPutBody({ amount, organizationId, globalDonation }))
}

export const deleteDonation = async ({ organizationId }) => {
  return fetchThenJson(`api/organization/delete-donation?organizationId=${organizationId}`, optionsDeleteRequest())
}

export const sendSupportFeedback = async ({ email, name, topic, body }) => {
  return fetchThenJson('api/support/feedback', optionsWithPostBody({ email, topic: `ENTERPRISE- ${topic}`, name, body }))
}

export const fetchDonationInfo = async ({ orgId }) => {
  return fetchThenJson(`api/organization/get-donation-info?organizationId=${orgId}`, optionsGetRequest())
}

export const resume = async () => {
  return fetchThenJson('api/organization/resume', optionsGetRequest())
}

export const gitHubListOrgs = async () => {
  return fetchThenJson('api/organization/github-list-orgs', optionsWithPostBody({}))
}

export const chooseOrg = async ({ name, host }) => {
  return fetchThenJson('api/organization/choose', optionsWithPostBody({ name, host }))
}

const fetchThenJson = (url, options) => fetch(`${window.location.origin}/${url}`, options)
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
