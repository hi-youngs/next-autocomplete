import Api from "./apiInterface";

class AutoComplete extends Api {


    getOnSearch = async (param) => {

        try {
                let data = await fetch(
                    `${process.env.API_URL}autoComplete?keyword=${param}&limit=${7}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
             return data;
            } catch (err) {
                console.log(err.message);
            }
        }


    postSearchText = async (param) => {
        try {
                let data = await fetch(
                    `${process.env.API_URL}autoComplete/keyword`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
    
                        body: param,
                    }
                );
             return data;

            } catch (err) {
                console.log(err.message);
            }
        }



        putSearchCount = async (param) => {
            try {
                    let data = await fetch(
                        `${process.env.API_URL}autoComplete/searchCount`,
                        // `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${text}&api_key=1a06b90e77951968492738173545a78c&format=json`
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
        
                            body: param,
                        }
                    );
                 return data;
    
                } catch (err) {
                    console.log(err.message);
                }
        }
        



        putSatisfactionCount = async (param) => {
            try {
                    let data = await fetch(
                        `${process.env.API_URL}autoComplete/satisfactionCount`,
                        // `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${text}&api_key=1a06b90e77951968492738173545a78c&format=json`
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
        
                            body: param,
                        }
                    );
                 return data;
    
                } catch (err) {
                    console.log(err.message);
                }
        }
    } 


export default AutoComplete