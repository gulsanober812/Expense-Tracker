import Reat from 'react';
import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ExpenseTracker from './components/ExpenseTracker';
import Header from './components/Header';
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  return(<><Header onBack={() => {
  // Your custom back logic here
  setShowWelcome(true); // Example if using state management
}} /><ExpenseTracker />;
  </>)
}


export default App;