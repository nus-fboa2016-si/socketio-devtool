import { combineReducers } from 'redux'
import updates from './updates';
import select from './selections';

const reducers = combineReducers({
  updates,
  select
});

export default reducers;