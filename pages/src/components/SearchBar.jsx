import React, { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import AutoComplete from "../../api/autoComplete";
import router from "next/router";

const SearchBar = () => {
    const [searchInputfocus, setSearchInputFocus] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [state, setState] = useState({ results: [] });
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchInput = useRef();

    const autoCompleteApi = new AutoComplete();

    useEffect(() => {
        searchInput.current.focus();
    });

    const onChangeSearchText = (text) => {
        setSearchText(text);
    };

    const onSearch = debounce(async (text) => {
        if (text == "") return setState({ results: [] });

        let fetchData, data;
        if (text.length > 1) {
            if (text.length > 7) {
                text = text.substring(0, 7);
            }
            try {
                fetchData = await fetch(`http://192.168.1.35:3003/autoComplete?keyword=${text}&limit=${7}`);
                data = await fetchData.json();
                console.log(data.data.dataList);
            } catch (err) {
                console.log(err.message);
            }
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
        };

        let result = await autoCompleteApi.putSearchCount(JSON.stringify(data));
        router.push({ pathname: "/search/SearchResult", query: { keyword: resultKeyword } });
    };

    const doByInputKeyDown = (e) => {
        if (e.code === "ArrowDown") {
            e.preventDefault();

            let activeIndexNum;
            if (activeIndex < state.results.length - 1) {
                activeIndexNum = activeIndex + 1;
            } else activeIndexNum = state.results.length - 1;
            setActiveIndex(activeIndexNum);

            state.results.map(({ keyword }, index) => index === activeIndexNum && onChangeSearchText(keyword));
        }
        if (e.code === "ArrowUp") {
            e.preventDefault();

            let activeIndexNum;
            if (activeIndex > -1) {
                activeIndexNum = activeIndex - 1;
            } else activeIndexNum = -1;
            setActiveIndex(activeIndexNum);

            state.results.map(({ keyword }, index) => index === activeIndexNum && onChangeSearchText(keyword));
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
                onBlur={searchInputOnBlur}
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
        <div onClick={() => onClickSearchResult(resultKeyword)} className={`search-preview ${index === 0 ? "start" : ""} ${activeindex === index && "active-index"}`} style={{ cursor: "pointer" }}>
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
