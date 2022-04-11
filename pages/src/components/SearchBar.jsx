import React, { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import AutoComplete from "../../api/autoComplete";
import router from "next/router";

const SearchBar = ({ results }) => {
    const [searchInputfocus, setSearchInputFocus] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [state, setState] = useState({ results: [] });

    const searchInput = useRef();

    const autoCompleteApi = new AutoComplete();

    useEffect(() => {
        searchInput.current.focus();
    });

    const [activeIndex, setActiveIndex] = useState(-1);

    const onSearch = debounce(async (text) => {
        if (text == "") return setState({ results: [] });

        let stockData, data;
        if (text.length > 1) {
            if (text.length > 7) {
                text = text.substring(0, 7);
            }
            try {
                stockData = await fetch(`http://192.168.1.35:3003/autoComplete?keyword=${text}&limit=${7}`);
                data = await stockData.json();
                console.log(data.data.dataList);
            } catch (err) {
                console.log(err.message);
            }
            setState({ results: data.data.dataList });
        }
    }, 700);

    //renders our results using the SearchPreview component
    const updateText = (text) => {
        setSearchText(text);
    };

    const onClickSearchButton = debounce(async () => {
        let data = {
            category: "기타",
            keyword: searchText,
        };
        let result = await autoCompleteApi.postSearchText(JSON.stringify(data));
        if (result) router.push({ pathname: "/search/SearchResult", query: { keyword: searchText } });
    }, 300);

    const onClickSearchResult = async (name) => {
        router.push({ pathname: "/search/SearchResult", query: { keyword: name } });
        updateText(name);
        try {
            await fetch(
                `http://192.168.1.35:3003/autoComplete/searchCount`,
                // `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${text}&api_key=1a06b90e77951968492738173545a78c&format=json`
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        keyword: searchText,
                    }),
                }
            );
        } catch (err) {
            console.log(err.message);
        }
    };

    const renderResults = state.results.map(({ position, keyword, age }, index) => {
        if (index < 7) {
            return (
                <SearchPreview
                    key={index}
                    updateText={updateText}
                    index={index}
                    position={position}
                    name={keyword}
                    age={age}
                    keyword={searchText}
                    activeIndex={activeIndex}
                    onClickSearchResult={onClickSearchResult}
                />
            );
        }
    });

    const doByInputKeyDown = (e) => {
        // console.log(e.code, e.target.value);
        if (e.code === "ArrowDown") {
            console.log("아래키");
            e.preventDefault();

            let activeIndexNum;
            if (activeIndex < 6) {
                activeIndexNum = activeIndex + 1;
            } else activeIndexNum = 6;
            setActiveIndex(activeIndexNum);
            state.results.map(({ position, name, age }, index) => (index === activeIndexNum ? console.log("@@@@index 실행", setSearchText(name)) : "    과연  ??  "));
        }
        if (e.code === "ArrowUp") {
            console.log("위키");
            e.preventDefault();
            let activeIndexNum;
            if (activeIndex > -1) {
                activeIndexNum = activeIndex - 1;
            } else activeIndexNum = -1;
            setActiveIndex(activeIndexNum);
            console.log(activeIndexNum);
            state.results.map(({ position, name, age }, index) => (index === activeIndexNum ? console.log("@@@@index 실행", setSearchText(name)) : "    과연  ??  "));
        }
        if (e.code === "Backspace") {
            setActiveIndex(-1);
        }
        if (e.code == "Enter" || e.code === "NumpadEnter") {
            onClickSearchButton();
        }
    };

    const searchInputOnBlur = () => {
        setSearchInputFocus(true);
    };
    const searchInputOnFocus = () => {
        setSearchInputFocus(true);
    };

    return (
        <div className="auto">
            {/* <button
          onClick={() => onClickSearchButton()}
          className={`cancel-btn ${keyword.length > 0 ? "active" : "inactive"}`}
        >
          x
        </button> */}
            <button onClick={() => onClickSearchButton()} className={`cancel-btn active`}>
                <img src="/images/ic_search.png" alt="" />
            </button>
            <input
                onBlur={searchInputOnBlur}
                onFocus={searchInputOnFocus}
                onKeyDown={(e) => doByInputKeyDown(e)}
                onKeyUp={(e) => {
                    // console.log(e.code)
                    if (e.code !== "ArrowDown" && e.code !== "ArrowUp") {
                        onSearch(e.target.value);
                    }
                }}
                ref={searchInput}
                autoComplete="off"
                className="search-bar"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                activeIndex={activeIndex}
                id="inputEl"
            />

            {state.results.length > 0 && searchInputfocus ? (
                <>
                    <div className="search-box-shadow">
                        <div className="search-results">{renderResults}</div>
                        <div className="close-search-box-button" onClick={() => searchInputOnBlur()}>
                            닫기
                            <img className="close-img" src="/images/closs.png" />
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

const SearchPreview = ({ age, name, position, index, updateText, keyword, activeIndex, onClickSearchResult }) => {
    console.log("@@@@@@", index, "@@@@actvieIndex", activeIndex);
    return (
        <div onClick={() => onClickSearchResult(name)} className={`search-preview ${index === 0 ? "start" : ""} ${activeIndex === index ? "active-index" : ""}`} style={{ cursor: "pointer" }}>
            <div className={`first`}>
                <p
                    className="name"
                    dangerouslySetInnerHTML={{
                        __html: name.replace(new RegExp(keyword, "gi"), (match) => '<b style="color: #e8340c;">' + match + "</b>"),
                    }}
                ></p>
            </div>
        </div>
    );
};

export default SearchBar;
