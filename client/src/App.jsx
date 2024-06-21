import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Upload from './Upload';

function Home() {
  const [makes, setMakes] = useState(['ford', 'bmw', 'Tesla']);
  const [models, setModels] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [logbook, setLogbook] = useState(null);
  const navigate = useNavigate();

  const makeIcons = {
    ford: 'ford.svg',
    bmw: 'bmw.svg',
    tesla: 'tesla.svg',
  };

  useEffect(() => {
    if (selectedMake) {
      axios
        .get(`http://localhost:5001/api/vehicles/${selectedMake}`)
        .then((response) => {
          setModels(Object.keys(response.data));
          setBadges([]);
        })
        .catch((error) => console.error('Error fetching models:', error));
    } else {
      setModels([]);
      setBadges([]);
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel && selectedMake) {
      axios
        .get(`http://localhost:5001/api/vehicles/${selectedMake}`)
        .then((response) => {
          setBadges(response.data[selectedModel] || []);
        })
        .catch((error) => console.error('Error fetching badges:', error));
    } else {
      setBadges([]);
    }
  }, [selectedModel, selectedMake]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('make', selectedMake);
    formData.append('model', selectedModel);
    formData.append('badge', selectedBadge);
    formData.append('logbook', logbook);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { make, model, badge, logbookContent } = response.data;
      navigate('/upload', { state: { make, model, badge, logbookContent } });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const prefillVehicle = (make, model, badge) => {
    setSelectedMake(make);
    setSelectedModel(model);
    setSelectedBadge(badge);
  };

  return (
    <div className='App'>
      <h1>AutoGrabber</h1>
      {selectedMake && makeIcons[selectedMake.toLowerCase()] && (
        <div className='img-container'>
          <img
            src={makeIcons[selectedMake.toLowerCase()]}
            alt={`${selectedMake} logo`}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Make:</label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value=''>Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        {selectedMake && (
          <div>
            <label>Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            >
              <option value=''>Select Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedModel && (
          <div>
            <label>Badge:</label>
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              disabled={!selectedModel}
            >
              <option value=''>Select Badge</option>
              {badges.map((badge) => (
                <option key={badge} value={badge}>
                  {badge}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedBadge && (
          <div>
            <label>Logbook:</label>
            <input
              type='file'
              onChange={(e) => setLogbook(e.target.files[0])}
            />
          </div>
        )}
        <div>
          <button type='submit' disabled={!selectedBadge || !logbook}>
            Submit
          </button>
        </div>
      </form>
      <div className='quick-select'>
        <h2>Quick Select</h2>
        <button
          onClick={() => prefillVehicle('Tesla', 'Model 3', 'Performance')}
        >
          Tesla Model 3 Performance
        </button>
        <button onClick={() => prefillVehicle('ford', 'Ranger', 'Raptor')}>
          Ford Ranger Raptor
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/upload' element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
