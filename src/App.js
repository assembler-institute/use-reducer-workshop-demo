import React, { useReducer, useEffect } from "react";
import "./styles.css";
import axios from "axios";

const FETCH_INIT = "FETCH_INIT";
const FETCH_DONE = "FETCH_DONE";
const FETCH_ERROR = "FETCH_ERROR";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case FETCH_INIT: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_DONE: {
      return {
        ...state,
        data: { ...action.payload },
        error: null,
        loading: false,
      };
    }
    case FETCH_ERROR: {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, data, error } = state;

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (mounted) {
        dispatch({
          type: FETCH_INIT,
        });
      }

      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (mounted) {
          dispatch({
            type: FETCH_DONE,
            payload: response.data,
          });
        }
      } catch (error) {
        if (mounted) {
          dispatch({
            type: FETCH_ERROR,
            payload: error.message,
          });
        }
      }
    }

    if (!data) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [data]);

  return (
    <div className="App">
      <h1> User data </h1>
      {error && <p> Something went wrong {error} </p>}
      {loading && <p> loading data... </p>}
      {!error && !loading && <pre> {JSON.stringify(data, null, 2)} </pre>}
    </div>
  );
}

export default App;
