import { AppProps } from 'next/app';
import { UserProvider } from '../context/UserContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import Home from '.';
import { Toaster } from "../components/ui/toaster";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
        <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;