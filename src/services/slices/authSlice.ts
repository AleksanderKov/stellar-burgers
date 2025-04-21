import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export const AUTH_SLICE_NAME = 'userAuth';

interface IUserState {
  data: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: IUserState = {
  data: null,
  isAuthChecked: false,
  error: null
};

export const signUpUser = createAsyncThunk(
  `${AUTH_SLICE_NAME}/signUpUser`,
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const dataUser = await registerUserApi(data);
      if (!dataUser.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', dataUser.accessToken);
      localStorage.setItem('refreshToken', dataUser.refreshToken);
      return dataUser.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const signInUser = createAsyncThunk(
  `${AUTH_SLICE_NAME}/signInUser`,
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const dataUser = await loginUserApi(data);
      if (!dataUser.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', dataUser.accessToken);
      localStorage.setItem('refreshToken', dataUser.refreshToken);
      return dataUser.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  `${AUTH_SLICE_NAME}/requestPasswordReset`,
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const dataUser = await forgotPasswordApi(data);
      if (!dataUser.success) {
        return rejectWithValue(data);
      }
      return dataUser.success;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const loadUserData = createAsyncThunk(
  `${AUTH_SLICE_NAME}/loadUserData`,
  async () => getUserApi()
);

export const signOutUser = createAsyncThunk(
  `${AUTH_SLICE_NAME}/signOutUser`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      localStorage.clear(); // ✅ переместили сюда
      deleteCookie('accessToken');
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveUserProfile = createAsyncThunk(
  `${AUTH_SLICE_NAME}/saveUserProfile`,
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const verifyUserAuth = createAsyncThunk(
  `${AUTH_SLICE_NAME}/verifyUserAuth`,
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(loadUserData()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

const userSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUserData: (state) => state.data,
    getAuthStatus: (state) => state.isAuthChecked,
    getUser: (state) => state.data,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(signUpUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось зарегистрировать пользователя';
      })
      .addCase(signInUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload;
      })
      .addCase(signInUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось войти';
      })
      .addCase(loadUserData.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.data = action.payload.user;
      })
      .addCase(loadUserData.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Не удалось получить данные о пользователе';
      })
      .addCase(signOutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.error = null;
        state.data = null;
      })
      .addCase(signOutUser.rejected, (state) => {
        state.error = 'Не удалось выйти из аккаунта';
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.data = null;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.error = null;
        state.data = action.payload.user;
      })
      .addCase(saveUserProfile.rejected, (state) => {
        state.error = 'Не удалось обновить пользователя';
      });
  }
});

export const userReducer = userSlice.reducer;
export const { getUserData, getAuthStatus, getUser, getIsAuthChecked } =
  userSlice.selectors;
export const { authChecked } = userSlice.actions;

export const fetchRegisterUser = signUpUser;
export const fetchLoginUser = signInUser;
export const fetchGetUser = loadUserData;
export const fetchLogoutUser = signOutUser;
export const fetchUpdateUser = saveUserProfile;
export const checkUserAuth = verifyUserAuth;
