// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
import React from 'react';
import ChatBox from './components/ChatBox';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList'; // 추가

function App() {
  return (
    <div>
      <FileUploader />
      <FileList />
      <ChatBox />
    </div>
  );
}

export default App;
