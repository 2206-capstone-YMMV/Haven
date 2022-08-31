import { createStore, applyMiddleware } from "redux";
import ThunkMiddleware from "redux-thunk";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
// initial State
const initialState = {};

const GET_SINGLEPOST = "GET_SINGLEPOST";

const getPost = (post) => ({
  type: GET_SINGLEPOST,
  post,
});

export const get_Post = (user) => {
  return async (dispatch) => {
    const unsbuscribe = onSnapshot(
      query(collection(db, "Post"), where("createAt", "==", user.createAt)),
      (snapshot) =>
        // console.log('------------------------------------',snapshot.docs[0].data())
        dispatch(getPost(snapshot.docs[0].data()))
    );
    return unsbuscribe;
  };
};
// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLEPOST:
      return action;
    default:
      return state;
  }
};

// Store
export const store = createStore(reducer, applyMiddleware(ThunkMiddleware));