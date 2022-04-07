import React, { useState } from "react";
import SearchBar from "./SearchBar";

const SearchBarTest = () => {
  const [state, setState] = useState({ results: [] });

  const onSearch = async (text) => {
    if (text == "") return setState({ results: [] });

    let stockData, data;
    if(text.length < 7){
    try {
        stockData = await fetch(
          `http://192.168.1.35:3003/autoComplete?keyword=${text}&limit=${7}`
          // `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${text}&api_key=1a06b90e77951968492738173545a78c&format=json`
        );
        data = await stockData.json();
        console.log(data.data.dataList);
    } catch (err) {
      console.log(err.message);
    }
    setState({ results: data.data.dataList });
  }
};

  return (
    <div className="App">
      <SearchBar results={state.results} updateField={onSearch} />
    </div>
  );
};

export default SearchBarTest;
