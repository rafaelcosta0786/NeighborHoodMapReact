import React from 'react'

class LocationList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    render() {
        
        return (
            <div id='side-bar'>
            <input 
            id='input-box' 
            type='text' 
            placeholder='Enter shop name' 
            aria-label="text filter"
            value={this.state.query}
            onChange={e=>this.props.onUpdateQuery(e.target.value)}
            />
            <ul 
            aria-label = 'List of Shops'>
            {this.props.venues && this.props.venues.map( item =>
            <li 
            data-key={item.id} 
            key={item.id} 
            role="button" 
            tabIndex={ !this.state.searchHidden ? '0' : '-1' }
            onClick={e=>this.props.onSelectedVenue(e, item)}> 
            {item.title} 
            </li>
            )}
            </ul>
            </div>
        );
    
    }
}

export default LocationList