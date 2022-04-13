import Router from "next/router";
import React, { useState } from "react";
import { useRouter } from "next/router";
import AutoComplete from "../api/autoComplete";
import { debounce } from "lodash";

const SearchResult = ({ results }) => {
    const router = useRouter();
    const { keyword } = router.query;
    const autoCompleteApi = new AutoComplete();

    const onClickSatisfactionCount = debounce(async () => {
        let data = {
            keyword: keyword,
            category: "기타",
        };
        let result = autoCompleteApi.putSatisfactionCount(JSON.stringify(data));
    }, 700);

    return (
        <div className="auto">
            <h2 style={{ cursor: "pointer" }} onClick={() => onClickSatisfactionCount()}>
                {keyword}
            </h2>
            <span onClick={() => router.back()} style={{ cursor: "pointer" }}>
                뒤로가기
            </span>
        </div>
    );
};

export default SearchResult;
