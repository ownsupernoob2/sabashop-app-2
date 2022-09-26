import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "../../models/user";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";
export const ADD_USER = "ADD_USER";
export const SET_USERS = "SET_USERS";

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    await getState().auth.userId;
    try {
      const response = await fetch(
        `https://sabashoptest-default-rtdb.firebaseio.com/users.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedUsers = [];

      for (const key in resData) {
        loadedUsers.push(
          new User(
            key,
            resData[key].email,
            resData[key].firstName,
            resData[key].lastName
          )
        );
      }

      dispatch(
        authenticate({
          users: loadedUsers,
        }),
        {
          type: SET_USERS,
          users: loadedUsers,
        }
      );
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const signup = (email, password, firstName, lastName) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBgYBg8M_nE1ENItEiVj-rf640JtVfTXSU",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          displayName: firstName + " " + lastName,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      console.log(errorId);
      let message = "Something went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    const response1 = await fetch(
      `https://sabashoptest-default-rtdb.firebaseio.com/users/${resData.localId}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
        }),
      }
    );

    const resData1 = await response1.json();

    if (!response1.ok) {
      const error = resData.error.message;
      console.log(error);
      throw new Error("Something went wrong! :(");
    }
    console.log(resData);
    dispatch(
      {
        type: ADD_USER,
        userData: {
          id: resData.localId,
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      },
      authenticate(
        resData1,
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

// export const account = (email,  firstName,  lastName) => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//
//     dispatch(
//       resData
//     )

//   }
// }

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBgYBg8M_nE1ENItEiVj-rf640JtVfTXSU",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
