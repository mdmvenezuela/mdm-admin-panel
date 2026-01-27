import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Smartphone, Key, Activity, Plus, Lock, Unlock, MapPin, Search, X, QrCode, Trash2, Eye, AlertCircle, Battery, Wifi, Clock, Navigation } from 'lucide-react';

// Configuración de la API
const API_URL = 'https://app.solvenca.lat/api';

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

      const contentType = response.headers.get('content-type');

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { error: await response.text() };
      }

      if (response.ok) {
        localStorage.setItem('reseller_token', data.token);
        localStorage.setItem('reseller_user', JSON.stringify(data.user));
        onLogin(data.token);
      } else {
        console.error('❌ Error login:', data);
        setError(data.error || `Error del servidor (${response.status})`);
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
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
    const device = devices.find(d => d.id === deviceId);
    
    const customMessage = prompt(
      `¿Deseas agregar un mensaje personalizado?\n\n(Deja en blanco para usar el mensaje por defecto con la info de contacto)`,
      ''
    );
    
    if (customMessage === null) return;

    try {
      const response = await fetch(`${API_URL}/reseller/device/${deviceId}/lock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: customMessage || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Dispositivo bloqueado exitosamente\n\nEl cliente verá el mensaje en su pantalla de bloqueo.`);
        fetchDevices();
      } else {
        alert(data.error || 'Error bloqueando dispositivo');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleUnlockDevice = async (deviceId) => {
    try {
      const response = await fetch(`${API_URL}/reseller/device/${deviceId}/unlock`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        const device = devices.find(d => d.id === deviceId);
        const message = `🔓 DISPOSITIVO DESBLOQUEADO

Código de desbloqueo: ${data.unlock_code}

📞 Comunica este código al cliente:
${device?.client_name || 'Cliente'}
${device?.client_phone || ''}

El cliente debe ingresar este código en el dispositivo para desbloquearlo.`;
        
        alert(message);
        
        // Copiar al portapapeles automáticamente
        if (navigator.clipboard) {
          navigator.clipboard.writeText(data.unlock_code);
          setTimeout(() => alert('✅ Código copiado al portapapeles'), 100);
        }
        
        fetchDevices();
      } else {
        alert(data.error || 'Error desbloqueando dispositivo');
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
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                    {device.google_device_name && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1" title="Android Enterprise">
                        <Smartphone className="w-3 h-3" />
                        AE
                      </span>
                    )}
                  </div>
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
const DeviceDetailModal = ({ device, token, onClose, onRefresh }) => {
  const [deviceDetail, setDeviceDetail] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchDeviceDetail();
    fetchAvailablePolicies();
  }, [device.id]);

  const fetchDeviceDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/reseller/device/${device.id}/detail`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDeviceDetail(data.device);
      
      // Si tiene política actual, seleccionarla
      if (data.device.google_info?.policyName) {
        setSelectedPolicy(data.device.google_info.policyName);
      }
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
    }
  };

  const fetchAvailablePolicies = async () => {
    try {
      const response = await fetch(`${API_URL}/reseller/policies/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Error obteniendo políticas:', error);
    }
  };

  const handleChangePolicy = async () => {
    if (!selectedPolicy) {
      alert('Selecciona una política');
      return;
    }

    if (!confirm('¿Cambiar la política de este dispositivo? Los cambios se aplicarán en el próximo sync.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reseller/device/${device.id}/change-policy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ policyName: selectedPolicy })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Política cambiada exitosamente\n\nLos cambios se aplicarán en el próximo sync del dispositivo (puede tomar unos minutos)');
        fetchDeviceDetail();
        if (onRefresh) onRefresh();
      } else {
        alert(`Error: ${data.error || 'No se pudo cambiar la política'}`);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleReboot = async () => {
    if (!confirm('¿Reiniciar este dispositivo? El dispositivo se reiniciará remotamente.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reseller/device/${device.id}/reboot`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Comando de reinicio enviado\n\nEl dispositivo se reiniciará en unos momentos.');
      } else {
        alert(`Error: ${data.error || 'No se pudo reiniciar'}`);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const googleInfo = deviceDetail?.google_info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Detalles del Dispositivo</h3>
            <p className="text-sm text-gray-600">{device.client_name || 'Sin nombre'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-[88px] bg-white border-b border-gray-200 px-6 z-10">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'info' 
                  ? 'border-purple-600 text-purple-600 font-semibold' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              📱 Información
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'policy' 
                  ? 'border-purple-600 text-purple-600 font-semibold' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              🛡️ Política
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === 'actions' 
                  ? 'border-purple-600 text-purple-600 font-semibold' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              ⚡ Acciones
            </button>
            {googleInfo && (
              <button
                onClick={() => setActiveTab('technical')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'technical' 
                    ? 'border-purple-600 text-purple-600 font-semibold' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                🔧 Info Técnica
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Tab: Información */}
          {activeTab === 'info' && (
            <>
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      device.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 
                      device.status === 'BLOQUEADO' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Android Enterprise */}
              {device.google_device_name && googleInfo && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Android Enterprise
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Estado</p>
                      <p className="font-medium">{googleInfo.state || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Último Reporte</p>
                      <p className="font-medium text-xs">
                        {googleInfo.lastStatusReportTime 
                          ? new Date(googleInfo.lastStatusReportTime).toLocaleString() 
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Política Actual</p>
                      <p className="font-medium text-xs break-all">
                        {googleInfo.policyName ? googleInfo.policyName.split('/').pop() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de Enrolamiento</p>
                      <p className="font-medium text-xs">
                        {googleInfo.enrollmentTime 
                          ? new Date(googleInfo.enrollmentTime).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ubicación */}
              {device.last_location_lat && device.last_location_lon && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Ubicación Actual
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Latitud</p>
                      <p className="font-medium">{device.last_location_lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Longitud</p>
                      <p className="font-medium">{device.last_location_lon.toFixed(6)}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${device.last_location_lat},${device.last_location_lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    Ver en Google Maps
                  </a>
                </div>
              )}
            </>
          )}

          {/* Tab: Política */}
          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Gestión de Política
                </h4>
                <p className="text-sm text-purple-800 mb-4">
                  Cambia la política de seguridad y configuración de este dispositivo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Política Actual:
                </label>
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <p className="font-mono text-sm">
                    {googleInfo?.policyName ? googleInfo.policyName.split('/').pop() : 'Sin política asignada'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar a:
                </label>
                <select
                  value={selectedPolicy}
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecciona una política</option>
                  {policies.map(policy => (
                    <option key={policy.fullName} value={policy.fullName}>
                      {policy.name} (v{policy.version})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleChangePolicy}
                disabled={loading || !selectedPolicy}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-semibold"
              >
                <Shield className="w-5 h-5" />
                {loading ? 'Cambiando...' : 'Cambiar Política'}
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ Los cambios se aplicarán en el próximo sync del dispositivo (puede tomar unos minutos)
              </div>
            </div>
          )}

          {/* Tab: Acciones */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Acciones Remotas</h4>
                <p className="text-sm text-blue-800">
                  Ejecuta comandos remotos en el dispositivo
                </p>
              </div>

              <button
                onClick={handleReboot}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                <RefreshCw className="w-5 h-5" />
                Reiniciar Dispositivo
              </button>

              <button
                onClick={fetchDeviceDetail}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Zap className="w-5 h-5" />
                Actualizar Información
              </button>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-semibold mb-2">💡 Otras acciones disponibles:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Bloquear dispositivo (desde la lista principal)</li>
                  <li>Desbloquear con código (desde la lista principal)</li>
                  <li>Liberar dispositivo (desde la lista principal)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Info Técnica */}
          {activeTab === 'technical' && googleInfo && (
            <div className="space-y-4">
              {/* Hardware */}
              {googleInfo.hardwareInfo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">💻 Hardware</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Fabricante</p>
                      <p className="font-medium">{googleInfo.hardwareInfo.manufacturer || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Modelo</p>
                      <p className="font-medium">{googleInfo.hardwareInfo.model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Serial Number</p>
                      <p className="font-medium font-mono text-xs">{googleInfo.hardwareInfo.serialNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">CPU</p>
                      <p className="font-medium text-xs">{googleInfo.hardwareInfo.cpuInfo || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Software */}
              {googleInfo.softwareInfo && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📱 Software</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Versión Android</p>
                      <p className="font-medium">{googleInfo.softwareInfo.androidVersion || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Build Number</p>
                      <p className="font-medium font-mono text-xs">{googleInfo.softwareInfo.androidBuildNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Security Patch</p>
                      <p className="font-medium text-xs">{googleInfo.softwareInfo.securityPatchLevel || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Memoria */}
              {googleInfo.memoryInfo && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">💾 Memoria</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">RAM Total</p>
                      <p className="font-medium">
                        {googleInfo.memoryInfo.totalRam 
                          ? `${(googleInfo.memoryInfo.totalRam / (1024**3)).toFixed(2)} GB` 
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Almacenamiento Total</p>
                      <p className="font-medium">
                        {googleInfo.memoryInfo.totalInternalStorage 
                          ? `${(googleInfo.memoryInfo.totalInternalStorage / (1024**3)).toFixed(2)} GB` 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Apps Instaladas */}
              {googleInfo.applicationReports && googleInfo.applicationReports.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📲 Aplicaciones Instaladas ({googleInfo.applicationReports.length})</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {googleInfo.applicationReports.slice(0, 10).map((app, idx) => (
                      <div key={idx} className="bg-white rounded p-2 text-sm">
                        <p className="font-medium">{app.displayName || app.packageName}</p>
                        <p className="text-xs text-gray-600 font-mono">{app.packageName}</p>
                        {app.versionName && (
                          <p className="text-xs text-gray-500">v{app.versionName}</p>
                        )}
                      </div>
                    ))}
                    {googleInfo.applicationReports.length > 10 && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        ...y {googleInfo.applicationReports.length - 10} apps más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
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

export default ResellerPanel;