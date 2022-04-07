import React, { useState } from "react";
import { debounce } from "lodash";

const SearchBar = ({ results, updateField }) => {
  const [searchInputfocus, setSearchInputFocus] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);


  //renders our results using the SearchPreview component
  const updateText = (text) => {
    setSearchText(text);
  };

  const cancelSearch = () => {
    setSearchText("");
  };

  const renderResults = (results).map(({ position, name, age }, index) => {
    if (index < 7) {
      return (
        <SearchPreview
          key={index}
          updateText={updateText}
          index={index}
          position={position}
          name={name}
          age={age}
          keyword={searchText}
          activeIndex={activeIndex}
        />
      );
    }
  });


  const doByInputKeyDown = (e) => {

    // console.log(e.code, e.target.value);
    if (e.code === "ArrowDown") {
      console.log("아래키");
      e.preventDefault();

      let activeIndexNum
      if(activeIndex < 6){
        activeIndexNum =  activeIndex + 1;
      } else activeIndexNum = 6
      setActiveIndex(activeIndexNum);
      console.log("왜 들엉오자마자 6임 개빡치네", activeIndex);
      results.map(({ position, name, age }, index) =>
        index === activeIndexNum
          ? console.log("@@@@index 실행", setSearchText(name))
          : "    과연  ??  "
      );
    }
    if (e.code === "ArrowUp") {
      console.log("위키");
      e.preventDefault();
      let activeIndexNum
      if(activeIndex > -1){
        activeIndexNum = activeIndex - 1;
      } else activeIndexNum = -1
      setActiveIndex(activeIndexNum);
      console.log(activeIndexNum);
      results.map(({ position, name, age }, index) =>
        index === activeIndexNum
          ? console.log("@@@@index 실행", setSearchText(name))
          : "    과연  ??  "
      );
    }
    if (e.code === "Backspace") {
      setActiveIndex(-1);
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
          onClick={() => cancelSearch()}
          className={`cancel-btn ${keyword.length > 0 ? "active" : "inactive"}`}
        >
          x
        </button> */}
      <button onClick={() => cancelSearch()} className={`cancel-btn active`}>
        <img src="/images/ic_search.png" alt="" />
      </button>
      <input
        onBlur={searchInputOnBlur}
        onFocus={searchInputOnFocus}
        onKeyDown={(e) => doByInputKeyDown(e)}
        onKeyUp={debounce((e) => {
          // console.log(e.code)
          if(e.code !== "ArrowDown" && e.code !== "ArrowUp"){
            updateField(e.target.value);
          }
        }, 500)}
        autoComplete="off"
        className="search-bar"
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        activeIndex={activeIndex}
        id="inputEl"
      />

      {results.length > 0 && searchInputfocus ? (
        <>
          <div className="search-box-shadow">
            <div className="search-results">{renderResults}</div>
            {/* <div className="close-search-box-button">닫기<img className="close-img" src={closeIcon}/></div> */}
          </div>
        </>
      ) : null}
    </div>
  );
};

const SearchPreview = ({
  age,
  name,
  position,
  index,
  updateText,
  keyword,
  activeIndex,
}) => {
  console.log("@@@@@@", index,"@@@@actvieIndex", activeIndex)
  return (
    <div
      onClick={() => updateText(name)}
      className={`search-preview ${index === 0 ? "start" : ""} ${activeIndex === index ? "active-index" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className={`first`}>
        <p
          className="name"
          dangerouslySetInnerHTML={{
            __html: name.replace(
              new RegExp(keyword, "gi"),
              (match) => '<b style="color: #e8340c;">' + match + "</b>"
            ),
          }}
        ></p>
      </div>
    </div>
  );
};

export default SearchBar;
