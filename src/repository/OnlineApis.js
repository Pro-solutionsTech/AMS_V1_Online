export const getEnrolledStudentsOnlineAPI = (apiUrl, apiToken, dispatch) => {
    return axios
        .get(`${apiUrl}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        })
        .then((response) => response.data);
}