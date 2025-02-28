import React, {Component} from "react"

export default class SearchProducts extends Component {
    handleSearch = (e) => {
        this.props.onSearch(e.target.value)
    }

    render() {
        return (

            <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" onChange={this.handleSearch}/>

            </div>
        )
    }
}