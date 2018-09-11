import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import 'normalize-css/normalize.css';
import 'animate.css';
import './theme/font.scss';
import './index.scss';

import ListPage from './pages/list/List';
import DetailPage from './pages/detail/Detail';
import registerServiceWorker from './registerServiceWorker';

class App extends Component {
    render() {
        return (

            <Router>
                <div className="wrapper">
                    <Link to="/">
                        <h1 className="app-title animated">STAR WARS</h1>
                    </Link>

                    <Route exact path="/" component={ListPage} />
                    <Route path="/detail/:id" component={DetailPage} />
                </div>
            </Router>

        );
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
