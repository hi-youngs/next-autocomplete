import Api from "./apiInterface";

class AutoComplete extends Api {
    getOnSearch = async (param) => {
        try {
                let data = await fetch(
                    `http://192.168.1.35:3003/autoComplete?keyword=${param}&limit=${7}`,
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
                    `http://192.168.1.35:3003/autoComplete/keyword`,
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
                        `http://192.168.1.35:3003/autoComplete/searchCount`,
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
                        `http://192.168.1.35:3003/autoComplete/satisfactionCount`,
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