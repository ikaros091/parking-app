import { useState, useEffect } from 'react';
import ParkingLot3D from './components/ParkingLot3D';
import { parkingAPI } from './services/api';
import './App.css';

function App() {
  const [slots, setSlots] = useState([]);
  const [capacity, setCapacity] = useState(6);
  const [carNumber, setCarNumber] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showParkModal, setShowParkModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Fetch parking status
  const fetchParkingStatus = async () => {
    try {
      const data = await parkingAPI.getParkingStatus();
      setSlots(data.parking_slots || []);
    } catch (error) {
      console.log('No parking lot created yet');
    }
  };

  useEffect(() => {
    fetchParkingStatus();
    const interval = setInterval(fetchParkingStatus, 3000); // Auto refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Create parking lot
  const handleCreateParkingLot = async () => {
    if (capacity < 1) {
      showMessage('Capacity must be at least 1', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await parkingAPI.createParkingLot(capacity);
      showMessage(`Parking lot with ${capacity} slots created!`, 'success');
      await fetchParkingStatus();
    } catch (error) {
      showMessage(error.error || 'Failed to create parking lot', 'error');
    }
    setLoading(false);
  };

  // Park car
  const handleParkCar = async () => {
    if (!carNumber.trim()) {
      showMessage('Please enter car number', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await parkingAPI.parkCar(carNumber);
      showMessage(`Car ${carNumber} parked in slot ${data.slot_number}`, 'success');
      setCarNumber('');
      setShowParkModal(false);
      await fetchParkingStatus();
    } catch (error) {
      showMessage(error.error || 'Failed to park car', 'error');
    }
    setLoading(false);
  };

  // Leave car
  const handleLeaveCar = async (car) => {
    if (!car.registration_no || car.registration_no === '') {
      showMessage('Invalid car number', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log('Leaving car:', car.registration_no); // Debug log
      const data = await parkingAPI.leaveCar(car.registration_no);
      showMessage(
        `Car left. Hours: ${data.hours}, Charge: $${data.charge}`, 
        'success'
      );
      setShowModal(false);
      setSelectedCar(null);
      await fetchParkingStatus();
    } catch (error) {
      console.error('Leave error:', error); // Debug log
      showMessage(error.error || 'Failed to process checkout', 'error');
    }
    setLoading(false);
  };

  // Show message helper
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Handle car click
  const handleCarClick = (slot) => {
    console.log('Clicked slot:', slot); // Debug log
    // Use original data if available, otherwise use transformed data
    const slotData = slot.originalData || slot;
    setSelectedCar({
      slot_no: slotData.slot_no || slot.id,
      registration_no: slotData.registration_no || slot.car_number,
      status: slotData.status || (slot.is_available ? 'Available' : 'Occupied')
    });
    setShowModal(true);
  };

  // Handle slot click (for parking)
  const handleSlotClick = (slot) => {
    setShowParkModal(true);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1>🚗 3D Parking Management System</h1>
        <div className="stats">
          <span>Total Slots: {slots.length}</span>
          <span>Available: {slots.filter(s => s.status === 'Available').length}</span>
          <span>Occupied: {slots.filter(s => s.status === 'Occupied').length}</span>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-group">
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
            placeholder="Capacity"
            min="1"
            className="input"
          />
          <button 
            onClick={handleCreateParkingLot} 
            disabled={loading}
            className="btn btn-create"
          >
            🏗️ Create Parking Lot
          </button>
        </div>

        <button 
          onClick={() => setShowParkModal(true)} 
          disabled={loading || slots.length === 0}
          className="btn btn-park"
        >
          🚗 Park Car
        </button>
      </div>

      {/* 3D Scene */}
      <div className="scene-container">
        {slots.length > 0 ? (
          <ParkingLot3D
            slots={slots.map(slot => ({
              id: slot.slot_no,
              car_number: slot.registration_no || '',
              is_available: slot.status === 'Available',
              originalData: slot // Keep original data for click handlers
            }))}
            onSlotClick={handleSlotClick}
            onCarClick={handleCarClick}
          />
        ) : (
          <div className="empty-state">
            <h2>No Parking Lot Created</h2>
            <p>Create a parking lot to get started!</p>
          </div>
        )}
      </div>

      {/* Park Car Modal */}
      {showParkModal && (
        <div className="modal-overlay" onClick={() => setShowParkModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Park a Car</h2>
            <input
              type="text"
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
              placeholder="Enter Car Number (e.g., KA-01-HH-1234)"
              className="input"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={handleParkCar} disabled={loading} className="btn btn-primary">
                Park
              </button>
              <button onClick={() => setShowParkModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Car Status Modal */}
      {showModal && selectedCar && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🚗 Car Status</h2>
            <div className="car-details">
              <p><strong>Slot Number:</strong> {selectedCar.slot_no}</p>
              <p><strong>Car Number:</strong> {selectedCar.registration_no}</p>
              <p><strong>Status:</strong> <span className="badge">{selectedCar.status}</span></p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => handleLeaveCar(selectedCar)} 
                disabled={loading}
                className="btn btn-danger"
              >
                🚪 Leave Parking
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
