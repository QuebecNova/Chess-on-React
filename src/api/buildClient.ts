import axios from "axios"

export const buildClient = ({req}) => {
        return axios.create({
            baseURL: 'http://backend',
            headers: req.headers
        })
}