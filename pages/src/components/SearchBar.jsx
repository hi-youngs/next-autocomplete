import React, { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import AutoComplete from "../../api/autoComplete";
import router from "next/router";
import $ from "jquery";

const SearchBar = () => {
    const [searchInputfocus, setSearchInputFocus] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [state, setState] = useState({ results: [] });
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchInput = useRef();

    const autoCompleteApi = new AutoComplete();

    useEffect(() => {
        searchInput.current.focus();
    }, []);

    const onChangeSearchText = (text) => {
        setSearchText(text);
    };

    const onSearch = debounce(async (text) => {
        if (text == "") return setState({ results: [] });

        let resultText = text.substring(0, 7);

        let fetchData, data;
        if (resultText.length > 1) {
            console.log("resultText.length", resultText.length);
            fetchData = await autoCompleteApi.getOnSearch(resultText);
            data = await fetchData.json();
            setState({ results: data.data.dataList });
        }
    }, 700);

    const onClickSearchButton = debounce(async () => {
        let data = {
            category: "기타",
            keyword: searchText,
        };
        let result = await autoCompleteApi.postSearchText(JSON.stringify(data));
        if (result) router.push({ pathname: "/search/SearchResult", query: { keyword: searchText } });
    }, 300);

    const onClickSearchResult = async (resultKeyword) => {
        let data = {
            keyword: resultKeyword,
            category: "기타",
        };

        let result = await autoCompleteApi.putSearchCount(JSON.stringify(data));
        router.push({ pathname: "/search/SearchResult", query: { keyword: resultKeyword } });
    };

    const doByInputKeyDown = (e) => {
        let activeIndexNum;
        if (e.key === "ArrowDown") {
            e.preventDefault();

            if (activeIndex < state.results.length - 1) {
                activeIndexNum = activeIndex + 1;
            } else activeIndexNum = state.results.length - 1;
            setActiveIndex(activeIndexNum);

            state.results.map(({ keyword }, index) => index === activeIndexNum && onChangeSearchText(keyword));
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();

            if (activeIndex > -1) {
                activeIndexNum = activeIndex - 1;
            } else activeIndexNum = -1;
            setActiveIndex(activeIndexNum);

            state.results.map(({ keyword }, index) => index === activeIndexNum && onChangeSearchText(keyword));
            return;
        }
        if (e.key === "Backspace") {
            setActiveIndex(-1);
            return;
        }
        if (e.key === "Enter" || e.key === "NumpadEnter") {
            onClickSearchButton();
            return;
        }

        // let ev = e || window.event; // Event object 'ev'
        // var key = ev.which || ev.keyCode; // Detecting keyCode

        // // Detecting Ctrl
        // var ctrl = ev.ctrlKey ? ev.ctrlKey : key === 17 ? true : false;
        // console.log("key", e.key);

        // // If key pressed is V and if ctrl is true.
        // if (key == 86 && ctrl) {
        //     // print in console.
        //     console.log("Ctrl+V is pressed.");
        //     console.log("e.target.value", e.target.value);
        //     let pasteText = e.target.value.substring(0, 7);
        //     console.log("@@@@@@paste", pasteText);
        //     onSearch(pasteText);
        // } else if (key == 67 && ctrl) {
        //     // If key pressed is C and if ctrl is true.
        //     // print in console.
        //     console.log("Ctrl+C is pressed.");
        // }
    };

    const searchInputOnBlur = () => {
        setSearchInputFocus(false);
    };
    const searchInputOnFocus = () => {
        setSearchInputFocus(true);
    };

    const renderResults = state.results.map(({ keyword }, index) => {
        if (index < 7) {
            return <SearchPreview key={index} index={index} resultKeyword={keyword} keyword={searchText} activeindex={activeIndex} onClickSearchResult={onClickSearchResult} />;
        }
    });

    return (
        <div className="auto">
            <button onClick={() => onClickSearchButton()} className={`search-btn active`}>
                <img src="/images/ic_search.png" alt="" />
            </button>
            <input
                // onBlur={searchInputOnBlur}
                onFocus={searchInputOnFocus}
                onKeyDown={(e) => doByInputKeyDown(e)}
                onKeyUp={(e) => {
                    if (e.code !== "ArrowDown" && e.code !== "ArrowUp") {
                        onSearch(e.target.value);
                    }
                }}
                ref={searchInput}
                autoComplete="off"
                className="search-bar"
                placeholder="Search"
                value={searchText}
                onChange={(e) => onChangeSearchText(e.target.value)}
                activeindex={activeIndex}
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

const SearchPreview = ({ resultKeyword, index, keyword, activeindex, onClickSearchResult }) => {
    const escapeRegExp = (str) => {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    return (
        <div
            onClick={() => {
                onClickSearchResult(resultKeyword);
            }}
            className={`search-preview ${index === 0 ? "start" : ""} ${activeindex === index && "active-index"}`}
            style={{ cursor: "pointer" }}
        >
            <div className={`first`}>
                <p
                    className="name"
                    dangerouslySetInnerHTML={{
                        __html: resultKeyword.replace(new RegExp(escapeRegExp(keyword), "gi"), (match) => '<b style="color: #e8340c;">' + match + "</b>"),
                    }}
                ></p>
            </div>
        </div>
    );
};

export default SearchBar;
