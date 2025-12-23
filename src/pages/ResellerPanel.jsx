import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Smartphone, Key, Activity, Plus, Lock, Unlock, MapPin, Search, X, QrCode, Trash2, Eye, AlertCircle, Battery, Wifi, Clock, Navigation } from 'lucide-react';

// Configuración de la API
const API_URL = 'https://mdm-backend-production-bd3f.up.railway.app/api';

// Componente principal
const ResellerPanel = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('reseller_token'));
  const [user, setUser] = useState(null);

  // Si no hay token, mostrar login
  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={() => {
        localStorage.removeItem('reseller_token');
        setToken(null);
      }} />
      
      <div className="ml-64 p-8">
        <Header user={user} />
        
        <div className="mt-6">
          {currentView === 'dashboard' && <Dashboard token={token} />}
          {currentView === 'devices' && <Devices token={token} />}
          {currentView === 'enroll' && <EnrollDevice token={token} />}
          {currentView === 'map' && <DevicesMap token={token} />}
        </div>
      </div>
    </div>
  );
};

// Pantalla de Login
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reseller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('reseller_token', data.token);
        localStorage.setItem('reseller_user', JSON.stringify(data.user));
        onLogin(data.token);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Panel Reseller</h1>
          <p className="text-gray-600 mt-2">Gestiona tus dispositivos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Sidebar
const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'devices', icon: Smartphone, label: 'Mis Dispositivos' },
    { id: 'enroll', icon: QrCode, label: 'Enrolar Dispositivo' },
    { id: 'map', icon: MapPin, label: 'Mapa' }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">MDM System</h1>
        <p className="text-purple-200 text-sm mt-1">Panel Reseller</p>
      </div>

      <nav className="flex-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === item.id 
                ? 'bg-white text-purple-900' 
                : 'text-purple-100 hover:bg-purple-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

// Header
const Header = ({ user }) => {
  const currentUser = user || JSON.parse(localStorage.getItem('reseller_user') || '{}');
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{currentUser.business_name}</h2>
        <p className="text-gray-600 mt-1">Usuario: {currentUser.username}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-600">Rol</p>
          <p className="font-semibold text-purple-600">Reseller</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/reseller/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  const licensesTotal = parseInt(stats?.reseller?.total_licenses) || 0;
  const licensesInUse = parseInt(stats?.licenses?.en_uso) || 0;
  const licensesAvailable = parseInt(stats?.licenses?.disponibles) || 0;
  const licensesLinked = parseInt(stats?.licenses?.vinculadas) || 0;

  const cards = [
    {
      title: 'Licencias Totales',
      value: licensesTotal,
      subtitle: 'Asignadas por el administrador',
      icon: Key,
      color: 'blue'
    },
    {
      title: 'Licencias Disponibles',
      value: licensesAvailable,
      subtitle: 'Listas para usar',
      icon: Key,
      color: 'green'
    },
    {
      title: 'Licencias En Uso',
      value: licensesInUse,
      subtitle: 'Dispositivos activos',
      icon: Smartphone,
      color: 'purple'
    },
    {
      title: 'Licencias Vinculadas',
      value: licensesLinked,
      subtitle: 'Liberadas pero vinculadas a IMEI',
      icon: Key,
      color: 'orange'
    },
    {
      title: 'Dispositivos Activos',
      value: parseInt(stats?.devices?.activos) || 0,
      subtitle: 'Funcionando normalmente',
      icon: Smartphone,
      color: 'green'
    },
    {
      title: 'Dispositivos Bloqueados',
      value: parseInt(stats?.devices?.bloqueados) || 0,
      subtitle: 'Requieren atención',
      icon: Lock,
      color: 'red'
    }
  ];

  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="space-y-6">
      {/* Alerta si quedan pocas licencias */}
      {licensesAvailable < 3 && licensesAvailable > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>⚠️ Quedan pocas licencias disponibles ({licensesAvailable}). Contacta al administrador para agregar más.</span>
        </div>
      )}

      {licensesAvailable === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>❌ No tienes licencias disponibles. Contacta al administrador para agregar más licencias.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
              <div className={`p-2 ${colorMap[card.color]} rounded-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{card.value}</div>
            <p className="text-sm text-gray-500">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Uso de Licencias</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'Disponibles', value: licensesAvailable },
            { name: 'En Uso', value: licensesInUse },
            { name: 'Vinculadas', value: licensesLinked }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Gestión de Dispositivos
const Devices = ({ token }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/reseller/devices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockDevice = async (deviceId) => {
    if (!confirm('¿Estás seguro de bloquear este dispositivo?')) return;

    try {
      const response = await fetch(`${API_URL}/reseller/device/${deviceId}/lock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Dispositivo bloqueado. Contacte al proveedor para más información.'
        })
      });

      if (response.ok) {
        alert('Dispositivo bloqueado exitosamente');
        fetchDevices();
      } else {
        alert('Error bloqueando dispositivo');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleUnlockDevice = async (deviceId) => {
    try {
      const response = await fetch(`${API_URL}/reseller/device/${deviceId}/unlock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Dispositivo desbloqueado exitosamente');
        fetchDevices();
      } else {
        alert('Error desbloqueando dispositivo');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleReleaseDevice = async (deviceId) => {
    if (!confirm('¿Liberar este dispositivo? La licencia quedará vinculada al IMEI y solo podrá reactivarse con el mismo dispositivo.')) return;

    try {
      const response = await fetch(`${API_URL}/reseller/device/${deviceId}/release`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Dispositivo liberado. La licencia queda vinculada al IMEI.');
        fetchDevices();
      } else {
        alert('Error liberando dispositivo');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const filteredDevices = devices.filter(d => 
    (d.imei && d.imei.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.client_name && d.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'BLOQUEADO': return 'bg-red-100 text-red-800';
      case 'LIBERADO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeSince = (date) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const lastConnection = new Date(date);
    const diffMs = now - lastConnection;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Mis Dispositivos</h2>
          <span className="text-sm text-gray-600">Total: {devices.length}</span>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por IMEI o nombre del cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No se encontraron dispositivos' : 'No hay dispositivos enrolados'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDevices.map(device => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{device.client_name || 'Sin nombre'}</h3>
                    <p className="text-sm text-gray-600">{device.client_phone || 'Sin teléfono'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Smartphone className="w-4 h-4" />
                    <span className="font-mono">{device.imei}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeSince(device.last_connection)}</span>
                  </div>

                  {device.battery_level && (
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-gray-600" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${device.battery_level > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{width: `${device.battery_level}%`}}
                        ></div>
                      </div>
                      <span className="text-gray-600">{device.battery_level}%</span>
                    </div>
                  )}

                  {device.last_location_lat && device.last_location_lon && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">
                        {device.last_location_lat.toFixed(4)}, {device.last_location_lon.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {device.status === 'ACTIVO' && (
                    <>
                      <button
                        onClick={() => handleLockDevice(device.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Lock className="w-4 h-4" />
                        Bloquear
                      </button>
                      <button
                        onClick={() => setSelectedDevice(device)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </>
                  )}
                  
                  {device.status === 'BLOQUEADO' && (
                    <>
                      <button
                        onClick={() => handleUnlockDevice(device.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Unlock className="w-4 h-4" />
                        Desbloquear
                      </button>
                      <button
                        onClick={() => setSelectedDevice(device)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </>
                  )}

                  {(device.status === 'ACTIVO' || device.status === 'BLOQUEADO') && (
                    <button
                      onClick={() => handleReleaseDevice(device.id)}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      title="Liberar dispositivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDevice && (
        <DeviceDetailModal 
          device={selectedDevice} 
          token={token}
          onClose={() => setSelectedDevice(null)} 
        />
      )}
    </div>
  );
};

// Modal de Detalle del Dispositivo
const DeviceDetailModal = ({ device, token, onClose }) => {
  const [locationHistory, setLocationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationHistory();
  }, []);

  const fetchLocationHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/reseller/device/${device.id}/location/history?days=7`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      setLocationHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching location history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Detalles del Dispositivo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Información del Cliente</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium">{device.client_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{device.client_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IMEI</p>
                <p className="font-medium font-mono">{device.imei}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium">{device.status}</p>
              </div>
            </div>
          </div>

          {/* Ubicación Actual */}
          {device.last_location_lat && device.last_location_lon && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Última Ubicación Conocida
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Latitud</p>
                  <p className="font-medium">{device.last_location_lat.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Longitud</p>
                  <p className="font-medium">{device.last_location_lon.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Actualización</p>
                  <p className="font-medium">
                    {device.last_connection ? new Date(device.last_connection).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batería</p>
                  <p className="font-medium">{device.battery_level || 0}%</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${device.last_location_lat},${device.last_location_lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Navigation className="w-4 h-4" />
                Ver en Google Maps
              </a>
            </div>
          )}

          {/* Historial de Ubicaciones */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Historial de Ubicaciones (Últimos 7 días)</h4>
            {loading ? (
              <p className="text-gray-600">Cargando historial...</p>
            ) : locationHistory.length === 0 ? (
              <p className="text-gray-600">No hay historial disponible</p>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Fecha/Hora</th>
                      <th className="px-4 py-2 text-left">Latitud</th>
                      <th className="px-4 py-2 text-left">Longitud</th>
                      <th className="px-4 py-2 text-left">Batería</th>
                      <th className="px-4 py-2 text-left">Ver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {locationHistory.map((loc, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{new Date(loc.recorded_at).toLocaleString()}</td>
                        <td className="px-4 py-2">{parseFloat(loc.latitude).toFixed(6)}</td>
                        <td className="px-4 py-2">{parseFloat(loc.longitude).toFixed(6)}</td>
                        <td className="px-4 py-2">{loc.battery_level || 'N/A'}%</td>
                        <td className="px-4 py-2">
                          <a
                            href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <MapPin className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Enrolar Dispositivo (Generar QR)
const EnrollDevice = ({ token }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reseller/qr/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        setQrData(data);
      } else {
        setError(data.error || 'Error generando QR');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <QrCode className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enrolar Nuevo Dispositivo</h2>
          <p className="text-gray-600">Genera un código QR para activar un dispositivo nuevo</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!qrData ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📱 Instrucciones:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Asegúrate de tener licencias disponibles</li>
                <li>Haz clic en "Generar Código QR"</li>
                <li>En el dispositivo Android NUEVO (factory reset), toca 5-6 veces en la pantalla de bienvenida</li>
                <li>Escanea el código QR que aparecerá aquí</li>
                <li>El dispositivo se enrolará automáticamente</li>
              </ol>
            </div>

            <button
              onClick={generateQR}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-semibold text-lg"
            >
              <QrCode className="w-6 h-6" />
              {loading ? 'Generando...' : 'Generar Código QR'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ Código QR generado exitosamente. Expira en 24 horas.
              </p>
            </div>

            <div className="border-4 border-purple-200 rounded-lg p-8 bg-white">
              <div className="flex justify-center">
                <img 
                  src={qrData.qr_code} 
                  alt="QR Code" 
                  className="w-80 h-80"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-mono text-gray-800">{qrData.token.substring(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Licencia:</span>
                <span className="font-mono text-gray-800">{qrData.license_key}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expira:</span>
                <span className="text-gray-800">{new Date(qrData.expires_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setQrData(null)}
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Generar Otro QR
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Imprimir QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mapa de Dispositivos
const DevicesMap = ({ token }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/reseller/devices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const devicesWithLocation = devices.filter(d => d.last_location_lat && d.last_location_lon);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mapa de Dispositivos</h2>
        <p className="text-gray-600 mb-6">
          Dispositivos con ubicación: {devicesWithLocation.length} de {devices.length}
        </p>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : devicesWithLocation.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay dispositivos con ubicación disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {devicesWithLocation.map(device => (
              <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{device.client_name || 'Sin nombre'}</h3>
                    <p className="text-sm text-gray-600 font-mono">{device.imei}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    device.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {device.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Lat: {device.last_location_lat.toFixed(6)}, Lon: {device.last_location_lon.toFixed(6)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {device.last_connection ? new Date(device.last_connection).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${device.last_location_lat},${device.last_location_lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Ver en Google Maps
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerPanel;