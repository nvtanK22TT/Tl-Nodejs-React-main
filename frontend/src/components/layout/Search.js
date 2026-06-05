import React, { useState } from 'react'

const Search = ({ history }) => {
    const [keyword, setKeyword] = useState('')

    const searchHandler = (e) => {
        e.preventDefault()

        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <form onSubmit={searchHandler}>
            <div className="input-group trace-search">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Tìm sản phẩm, mã QR, vùng trồng..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn" aria-label="Tìm kiếm">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Search
