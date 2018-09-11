import React, {Component} from 'react';
import './List-item.scss';

class ListItem extends Component {

    render() {
        const data = this.props.data;
        return (
            <div className="list-item-area animated">
                <div className="inner">
                    <p className="episode">EPISODE {data.episode_id}</p>
                    <h2 className="title">{data.title}</h2>
                    <p className="director">{data.director}</p>
                    <p className="date">{data.release_date && data.release_date.split('-').join(' / ')}</p>
                </div>
            </div>
        );
    }


}

export default ListItem;