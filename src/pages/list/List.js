import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Select from 'react-select';
import Api from '../../services/Api/Api';
import ListItem from '../../components/list-item/List-item';
import Cookies from 'universal-cookie';
import './List.scss';

const cookies = new Cookies();

class ListPage extends Component {


    constructor(props) {
        super(props);

        this.state = {
            list : [],
            originalList : [],
            directors: [],
            filterSelected: null
        };
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.loadList();
    }

    loadList() {
        Api.get('films/')
            .then(response => {
                let list = response.data.results;

                list.map((item) => {
                    const urlArr = item.url.split('films');
                    item.url = urlArr[1];
                    return item;
                });

                this.setState({
                    originalList: list,
                    list: list,
                });

                this.createDirectorsList();

            });
    }


    createDirectorsList() {
        let directors = this.state.list.reduce((acc, item) => {
            const dir = item.director;

            if(acc.indexOf(dir) === -1) {
                acc.push(dir);
            }

            return acc;
        }, []);


        directors.unshift('All');

        directors.forEach((director, idx) => {
            directors[idx] = {
                value: director,
                label: director
            }
        });


        this.setState({directors});

        const filterSelected = cookies.get("filterDirector");

        this.setState({filterSelected});

        this.sortList(filterSelected);
    }

    filterChanged = (selected) => {
        this.sortList(selected);
    };

    sortList(selected) {
        if(!selected) return;

        const filteredList = this.state.originalList.filter((item) => {
            if(selected.value === 'All') {
                return true;
            }else {
                return item.director === selected.value;
            }
        });

        this.setState({
            list: filteredList,
            filterSelected: selected
        });

        const exp = new Date();
        exp.setMonth(exp.getMonth() + 1);

        cookies.set("filterDirector", selected, {expires: exp});
    }
    
    


    render() {

        const { filterSelected } = this.state;

        return (
            <div className="list-page">

                <div className="filter-area">
                    <span className="filter-title">Director</span>

                    <div className="select">
                        <Select
                            value={filterSelected}
                            onChange={this.filterChanged}
                            options={this.state.directors}
                        />
                    </div>

                </div>


                <div className="star-wars-list">
                    {
                        this.state.list.map((item, idx) =>
                            <Link
                                to={"/detail" + item.url}
                                key={idx}
                                className="item">

                                <ListItem data={item} />
                            </Link>

                        )
                    }
                </div>

            </div>
        );
    }


}

export default ListPage;