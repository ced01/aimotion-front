import axios from "axios";

const endpoint = "https://aimotionserver.herokuapp.com/put-feeling-on?str=";

const recogize = async ( sentence ) => {
    return await axios.get( endpoint + sentence );
}

export default recogize;