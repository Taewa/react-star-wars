import {Domain}  from '../../configs/Api';
import axios from 'axios';

export default axios.create({
    baseURL: Domain
});


