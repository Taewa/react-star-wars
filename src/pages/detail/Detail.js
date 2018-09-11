import React, {Component} from 'react';
import Api from '../../services/Api/Api';
import axios from 'axios'
import './Detail.scss';
import Loading from '../../components/loading/Loading';
import {Scatter, Doughnut} from 'react-chartjs-2';



class DetailPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageData: [],
            chars: [],
            genders: [],
            ships: [],
            // From Google color palette
            colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'],
            loadingCharacter: true
        };
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.loadDetail();
    }

    loadDetail() {
        Api.get(`films/${this.props.match.params.id}`)
            .then(response => {
                this.setState({pageData: response.data});
                this.loadCharacter();
                this.loadStarship();
            });
    }

    loadCharacter() {
        let charArr = [];

        this.state.pageData.characters.forEach((char) => {
            charArr.push(
                Api.get(char)
            );
        });

        axios.all(charArr).then((chars) => {
            this.setState({chars});
            this.setGenders();
            this.setState({loadingCharacter : false});
        });
    }

    loadStarship() {
        let shipArr = [];
        this.state.pageData.starships.forEach((ship) => {
            shipArr.push(
                Api.get(ship)
            );
        });

        axios.all(shipArr).then((ships) => {
            this.setShips(ships);
        });
    }

    setGenders() {
        const chars = this.state.chars;
        const genders = chars.reduce((acc, char) => {

            const gender = char.data.gender;

            if (acc.hasOwnProperty(gender)) {
                acc[gender] = acc[gender] + 1;
            } else {
                acc[gender] = 1;
            }

            return acc;

        }, {});

        this.setState({genders});
    }

    setShips(ships) {
        const starShips = [];

        ships.forEach((ship) => {
            starShips.push({
                x: parseInt(ship.data.cost_in_credits, 10) || 0,
                y: parseInt(ship.data.max_atmosphering_speed, 10) || 0
            })
        });

        this.setState({ships});
    }


    render() {
        const {pageData, colors, genders, loadingCharacter} = this.state;
        const data = pageData;
        const genderData = {
            labels: Object.keys(genders),
            datasets: [
                {
                    label: "Genders",
                    backgroundColor: colors,
                    borderColor: '#000',
                    data: Object.values(genders),
                }
            ]
        };

        const starShipData = {
            labels: this.state.ships.map((ship) => ship.data.name),

            datasets: this.state.ships.map((ship, idx) => {

                return {
                    label: [ship.data.name],
                        fill: false,
                    showLine: true,
                    backgroundColor: colors[idx],
                    pointBorderColor: colors[idx],
                    borderColor: '#000',
                    pointBorderWidth: 3,
                    pointHoverRadius: 5,
                    pointHoverBorderWidth: 3,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [
                        {
                            x: parseInt(ship.data.cost_in_credits, 10) || 0,
                            y: parseInt(ship.data.max_atmosphering_speed, 10) || 0
                        }
                    ]
                }
            }),

        };

        const scatterOpt = {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {

                        const label = data.labels[tooltipItem.datasetIndex];
                        return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
                    }
                }
            }
        };


        return (
            <div className="detail-area">
                <div className="info-area">
                    <h1 className="title">{data.title}</h1>
                    <p className="episode">Episode : {data.episode_id}</p>
                    <p className="director">Director : {data.director}</p>
                    <p className="producer">Producer : {data.producer}</p>
                    <p className="date">Date : {data.release_date && data.release_date.split('-').join(' / ')}</p>
                    <p className="chars">
                        Characters :
                        {
                            this.state.chars.map((char, idx) => <span className="badge char" key={idx}>{char.data.name} </span>)
                        }
                    </p>
                    <p className="ships">
                        Starships :
                        {
                            this.state.ships.map((ship, idx) => <span className="badge ship" key={idx}>{ship.data.name}</span>)
                        }
                    </p>
                </div>

                <div className="chart-area">
                    <div className="chart chart-gender">
                        <h2 className="chart-title">Character gender repartition</h2>
                    {
                        loadingCharacter? <Loading /> : <Doughnut data={genderData}/>
                    }
                    </div>


                    <div className="chart chart-star-ship">
                        <h2 className="chart-title">Starship cost and speed comparison</h2>
                        <p className="explain">(x : cost, y : speed)</p>
                        <Scatter data={starShipData} options={scatterOpt} />
                    </div>

                </div>


            </div>
        );
    }


}

export default DetailPage;