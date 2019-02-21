import React from 'react'

const LocationList = (props) => {
    const {onUpdateQuery, venues, onSelectedVenue} = props;
    return (
        <div id='side-bar'>
            <input
                id='input-box'
                type='text'
                placeholder='Enter shop name'
                aria-label="text filter"
                onChange={e => onUpdateQuery(e.target.value)}
            />
            <ul
                aria-label='List of Shops'>
                {venues && venues.map(item =>
                    <li
                        data-key={item.id}
                        key={item.id}
                        role="button"
                        tabIndex='0'
                        onClick={e => onSelectedVenue(e, 'click', item)}
                        onKeyPress={e => onSelectedVenue(e, 'key', item)}>
                        {item.title}
                    </li>
                )}
            </ul>
        </div>
    );

}

export default LocationList