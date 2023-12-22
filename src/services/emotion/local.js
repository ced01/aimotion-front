import axios from "axios";

const endpoint = "http://localhost:5000/put-feeling-on?str=";

const recogize = async ( sentence ) => {
    return await axios.get( endpoint + sentence );
}

export default recogize;