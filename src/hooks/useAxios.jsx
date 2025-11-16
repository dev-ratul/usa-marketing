import axios from "axios";

const axiosInstanse= axios.create({
    baseURL: 'https://usa-marketing-server.vercel.app/'
})

const useAxios=()=>{
    return axiosInstanse;
}

export default useAxios;

// https://raw-market-server.vercel.app/