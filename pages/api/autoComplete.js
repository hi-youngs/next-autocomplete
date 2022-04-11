import Api from "./apiInterface";

class AutoComplete extends Api {
    reportFaq = async (formData) => {
        if (!(formData instanceof FormData)) throw "Data must be FormData";
        let data = await this.post({
            url: `/admin/v2/faq/report`,
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
                pragma: "no-cache",
                "cache-control": "no-cache",
            },
            body: formData,
        });
        return data;
    };


    postSearchText = async (param) => {
        try {
                let data = await fetch(
                    `http://192.168.1.35:3003/autoComplete/keyword`,
                    // `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${text}&api_key=1a06b90e77951968492738173545a78c&format=json`
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




    } 


export default AutoComplete