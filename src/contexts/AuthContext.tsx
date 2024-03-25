import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

interface AuthContextType {
  userData: userData | undefined;
  error: any | undefined;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    age: number,
    imageUrl: string
  ) => void;
  updateImageUrl: (id: string, imageUrl: string) => void;
  isLoggedIn: boolean;
}

interface userData {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  imageUrl: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<userData | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [storedData] = useState<userData | null>(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      return JSON.parse(data) as userData;
    } else {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!storedData;
  });

  useEffect(() => {
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const userData = response.data.userData;

      if (userData) {
        setUserData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro interno no servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await axios.get(`${API_URL}/users/logout`, {
      withCredentials: true,
    });
    setUserData(undefined);
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    age: number,
    imageUrl: string
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_URL}/users`,
        { email, password, name, age, phone, imageUrl },
        {
          withCredentials: true,
        }
      );
      const userData = response.data.userData;
      if (userData) {
        setUserData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        setUserData(userData);
        setIsLoggedIn(true);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro interno no servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateImageUrl = async (id: string, imageUrl: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_URL}/users/${id}`,
        { imageUrl },
        {
          withCredentials: true,
        }
      );
      const userData = response.data.userData;
      if (userData) {
        setUserData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        setUserData(userData);
        setIsLoggedIn(true);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro interno no servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-purple dark:text-green"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        userData,
        login,
        logout,
        isLoggedIn,
        register,
        error,
        updateImageUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
