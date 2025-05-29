import axios from "axios";

const axiosClient = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US"
    }
});

export default axiosClient;