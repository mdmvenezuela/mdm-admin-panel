import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, Wifi, Camera, AlertCircle, Save, Plus, Edit, Trash2, Copy, Eye, EyeOff, Settings } from 'lucide-react';

const API_URL = 'https://app.solvenca.lat/api';

// Componente principal de gestión de políticas
const PolicyManagement = ({ token }) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/policies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (err) {
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (!confirm('¿Eliminar esta política? Los dispositivos que la usen cambiarán a la política por defecto.')) return;

    try {
      const response = await fetch(`${API_URL}/admin/policy/${policyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Política eliminada exitosamente');
        fetchPolicies();
      } else {
        alert('Error eliminando política');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleDuplicatePolicy = async (policy) => {
    setSelectedPolicy({
      ...policy,
      name: policy.name + ' (Copia)',
      id: null
    });
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-7 h-7 text-blue-600" />
              Gestión de Políticas Android Enterprise
            </h2>
            <p className="text-gray-600 mt-1">Configura políticas de seguridad y restricciones para dispositivos</p>
          </div>
          <button
            onClick={() => {
              setSelectedPolicy(null);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Política
          </button>
        </div>
      </div>

      {/* Lista de Políticas */}
      {loading ? (
        <div className="text-center py-12">Cargando políticas...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {policies.map(policy => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onEdit={() => {
                setSelectedPolicy(policy);
                setShowEditModal(true);
              }}
              onDelete={() => handleDeletePolicy(policy.id)}
              onDuplicate={() => handleDuplicatePolicy(policy)}
            />
          ))}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {(showCreateModal || showEditModal) && (
        <PolicyEditorModal
          token={token}
          policy={selectedPolicy}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedPolicy(null);
            fetchPolicies();
          }}
        />
      )}
    </div>
  );
};

// Tarjeta de Política
const PolicyCard = ({ policy, onEdit, onDelete, onDuplicate }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const config = typeof policy.configuration === 'string' 
    ? JSON.parse(policy.configuration) 
    : policy.configuration;

  const getRestrictionCount = () => {
    let count = 0;
    if (config.passwordRequired) count++;
    if (config.cameraDisabled) count++;
    if (config.screenCaptureDisabled) count++;
    if (config.bluetoothDisabled) count++;
    if (config.usbFileTransferDisabled) count++;
    if (config.factoryResetDisabled) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{policy.name}</h3>
            <p className="text-sm text-gray-600">{policy.description || 'Sin descripción'}</p>
          </div>
          {policy.is_default && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              Por Defecto
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Dispositivos usando</div>
            <div className="text-2xl font-bold text-gray-800">{policy.device_count || 0}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Restricciones</div>
            <div className="text-2xl font-bold text-gray-800">{getRestrictionCount()}</div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {config.passwordRequired && (
            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Contraseña obligatoria</span>
            </div>
          )}
          {config.cameraDisabled && (
            <div className="flex items-center gap-2 text-sm">
              <Camera className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">Cámara deshabilitada</span>
            </div>
          )}
          {config.kioskMode && (
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700">Modo Kiosk activo</span>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showDetails ? 'Ocultar' : 'Ver Detalles'}
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={onDuplicate}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Duplicar política"
          >
            <Copy className="w-4 h-4" />
          </button>
          {!policy.is_default && (
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Eliminar política"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Detalles Expandibles */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <h4 className="font-semibold text-gray-800 mb-2">Configuración Completa:</h4>
            
            {/* Seguridad */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Seguridad
              </h5>
              <div className="space-y-1 text-sm">
                <PolicyDetailItem label="Contraseña requerida" value={config.passwordRequired} />
                <PolicyDetailItem label="Mín. longitud contraseña" value={config.passwordMinLength || 'N/A'} />
                <PolicyDetailItem label="Tiempo bloqueo auto" value={config.maximumTimeToLock ? `${config.maximumTimeToLock}ms` : 'N/A'} />
                <PolicyDetailItem label="Encriptación" value={config.encryptionPolicy || 'N/A'} />
              </div>
            </div>

            {/* Restricciones */}
            <div className="bg-red-50 rounded-lg p-3">
              <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Restricciones
              </h5>
              <div className="space-y-1 text-sm">
                <PolicyDetailItem label="Cámara deshabilitada" value={config.cameraDisabled} />
                <PolicyDetailItem label="Captura de pantalla" value={config.screenCaptureDisabled} />
                <PolicyDetailItem label="Bluetooth" value={config.bluetoothDisabled} />
                <PolicyDetailItem label="USB File Transfer" value={config.usbFileTransferDisabled} />
                <PolicyDetailItem label="Factory Reset" value={config.factoryResetDisabled} />
              </div>
            </div>

            {/* Apps */}
            {config.allowedApps && config.allowedApps.length > 0 && (
              <div className="bg-green-50 rounded-lg p-3">
                <h5 className="font-semibold text-green-900 mb-2">Apps Permitidas</h5>
                <div className="flex flex-wrap gap-2">
                  {config.allowedApps.map((app, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente helper para mostrar detalles
const PolicyDetailItem = ({ label, value }) => {
  const displayValue = typeof value === 'boolean' 
    ? (value ? '✅ Sí' : '❌ No')
    : value || 'N/A';
    
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-800">{displayValue}</span>
    </div>
  );
};

// Modal de Edición/Creación de Política
const PolicyEditorModal = ({ token, policy, onClose }) => {
  const isEditing = !!policy?.id;
  
  const initialConfig = policy?.configuration 
    ? (typeof policy.configuration === 'string' ? JSON.parse(policy.configuration) : policy.configuration)
    : {};

  const [formData, setFormData] = useState({
    name: policy?.name || '',
    description: policy?.description || '',
    is_default: policy?.is_default || false
  });

  const [config, setConfig] = useState({
    // Seguridad
    passwordRequired: initialConfig.passwordRequired || false,
    passwordMinLength: initialConfig.passwordMinLength || 6,
    passwordQuality: initialConfig.passwordQuality || 'NUMERIC',
    maximumTimeToLock: initialConfig.maximumTimeToLock || 300000,
    encryptionPolicy: initialConfig.encryptionPolicy || 'ENABLED_WITHOUT_PASSWORD',
    
    // Restricciones
    cameraDisabled: initialConfig.cameraDisabled || false,
    screenCaptureDisabled: initialConfig.screenCaptureDisabled || false,
    bluetoothDisabled: initialConfig.bluetoothDisabled || false,
    usbFileTransferDisabled: initialConfig.usbFileTransferDisabled || false,
    factoryResetDisabled: initialConfig.factoryResetDisabled || false,
    installUnknownSourcesAllowed: initialConfig.installUnknownSourcesAllowed || false,
    
    // Modo Kiosk
    kioskMode: initialConfig.kioskMode || false,
    kioskApps: initialConfig.kioskApps || [],
    
    // Apps
    allowedApps: initialConfig.allowedApps || [],
    blockedApps: initialConfig.blockedApps || [],
    
    // Red
    wifiConfigsLockdownEnabled: initialConfig.wifiConfigsLockdownEnabled || false,
    
    // Otras
    statusBarDisabled: initialConfig.statusBarDisabled || false,
    keyguardDisabled: initialConfig.keyguardDisabled || false
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      configuration: JSON.stringify(config)
    };

    try {
      const url = isEditing 
        ? `${API_URL}/admin/policy/${policy.id}`
        : `${API_URL}/admin/policy`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Política ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
        onClose();
      } else {
        alert(data.error || 'Error guardando política');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
          <h3 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar' : 'Crear'} Política
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Información Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Política *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Política Restrictiva, Política Estándar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Descripción de la política y casos de uso"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                  Establecer como política por defecto
                </label>
              </div>
            </div>

            {/* Tabs de Configuración */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-2 mb-6 overflow-x-auto">
                <TabButton 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                  icon={<Lock className="w-4 h-4" />}
                  label="Seguridad"
                />
                <TabButton 
                  active={activeTab === 'restrictions'} 
                  onClick={() => setActiveTab('restrictions')}
                  icon={<AlertCircle className="w-4 h-4" />}
                  label="Restricciones"
                />
                <TabButton 
                  active={activeTab === 'apps'} 
                  onClick={() => setActiveTab('apps')}
                  icon={<Smartphone className="w-4 h-4" />}
                  label="Aplicaciones"
                />
                <TabButton 
                  active={activeTab === 'kiosk'} 
                  onClick={() => setActiveTab('kiosk')}
                  icon={<Settings className="w-4 h-4" />}
                  label="Modo Kiosk"
                />
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'security' && (
                  <SecurityTab config={config} setConfig={setConfig} />
                )}
                {activeTab === 'restrictions' && (
                  <RestrictionsTab config={config} setConfig={setConfig} />
                )}
                {activeTab === 'apps' && (
                  <AppsTab config={config} setConfig={setConfig} />
                )}
                {activeTab === 'kiosk' && (
                  <KioskTab config={config} setConfig={setConfig} />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Política' : 'Crear Política')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

// Tab de Seguridad
const SecurityTab = ({ config, setConfig }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 rounded-lg p-4">
      <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <Lock className="w-5 h-5" />
        Configuración de Seguridad
      </h5>
      
      <div className="space-y-4">
        <ToggleSwitch
          label="Requerir Contraseña"
          checked={config.passwordRequired}
          onChange={(val) => setConfig({...config, passwordRequired: val})}
          description="El usuario debe configurar una contraseña para desbloquear el dispositivo"
        />

        {config.passwordRequired && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud Mínima de Contraseña
              </label>
              <input
                type="number"
                min="4"
                max="16"
                value={config.passwordMinLength}
                onChange={(e) => setConfig({...config, passwordMinLength: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calidad de Contraseña
              </label>
              <select
                value={config.passwordQuality}
                onChange={(e) => setConfig({...config, passwordQuality: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="NUMERIC">Numérica</option>
                <option value="NUMERIC_COMPLEX">Numérica Compleja</option>
                <option value="ALPHABETIC">Alfabética</option>
                <option value="ALPHANUMERIC">Alfanumérica</option>
                <option value="COMPLEX">Compleja (letras, números, símbolos)</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo Máximo de Bloqueo Automático (milisegundos)
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={config.maximumTimeToLock}
            onChange={(e) => setConfig({...config, maximumTimeToLock: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            300000ms = 5 minutos, 600000ms = 10 minutos
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Política de Encriptación
          </label>
          <select
            value={config.encryptionPolicy}
            onChange={(e) => setConfig({...config, encryptionPolicy: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ENABLED_WITHOUT_PASSWORD">Habilitada sin contraseña</option>
            <option value="ENABLED_WITH_PASSWORD">Habilitada con contraseña</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

// Tab de Restricciones
const RestrictionsTab = ({ config, setConfig }) => (
  <div className="space-y-4">
    <div className="bg-red-50 rounded-lg p-4">
      <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Restricciones del Dispositivo
      </h5>
      
      <div className="space-y-3">
        <ToggleSwitch
          label="Deshabilitar Cámara"
          checked={config.cameraDisabled}
          onChange={(val) => setConfig({...config, cameraDisabled: val})}
          description="El usuario no podrá usar la cámara del dispositivo"
        />

        <ToggleSwitch
          label="Deshabilitar Captura de Pantalla"
          checked={config.screenCaptureDisabled}
          onChange={(val) => setConfig({...config, screenCaptureDisabled: val})}
          description="Se bloquea la captura de pantalla y grabación de pantalla"
        />

        <ToggleSwitch
          label="Deshabilitar Bluetooth"
          checked={config.bluetoothDisabled}
          onChange={(val) => setConfig({...config, bluetoothDisabled: val})}
          description="El Bluetooth estará desactivado y no se podrá activar"
        />

        <ToggleSwitch
          label="Deshabilitar Transferencia USB"
          checked={config.usbFileTransferDisabled}
          onChange={(val) => setConfig({...config, usbFileTransferDisabled: val})}
          description="No se podrán transferir archivos por USB"
        />

        <ToggleSwitch
          label="Deshabilitar Factory Reset"
          checked={config.factoryResetDisabled}
          onChange={(val) => setConfig({...config, factoryResetDisabled: val})}
          description="El usuario no podrá restablecer el dispositivo de fábrica"
        />

        <ToggleSwitch
          label="Permitir Instalación de Fuentes Desconocidas"
          checked={config.installUnknownSourcesAllowed}
          onChange={(val) => setConfig({...config, installUnknownSourcesAllowed: val})}
          description="Permite instalar apps fuera de Google Play"
        />

        <ToggleSwitch
          label="Bloquear Configuración WiFi"
          checked={config.wifiConfigsLockdownEnabled}
          onChange={(val) => setConfig({...config, wifiConfigsLockdownEnabled: val})}
          description="El usuario no podrá modificar las configuraciones WiFi"
        />

        <ToggleSwitch
          label="Deshabilitar Barra de Estado"
          checked={config.statusBarDisabled}
          onChange={(val) => setConfig({...config, statusBarDisabled: val})}
          description="Oculta la barra de notificaciones"
        />

        <ToggleSwitch
          label="Deshabilitar Bloqueo de Pantalla"
          checked={config.keyguardDisabled}
          onChange={(val) => setConfig({...config, keyguardDisabled: val})}
          description="El dispositivo no mostrará pantalla de bloqueo"
        />
      </div>
    </div>
  </div>
);

// Tab de Apps
const AppsTab = ({ config, setConfig }) => {
  const [newApp, setNewApp] = useState('');
  const [newBlockedApp, setNewBlockedApp] = useState('');

  const addAllowedApp = () => {
    if (newApp.trim()) {
      setConfig({
        ...config,
        allowedApps: [...(config.allowedApps || []), newApp.trim()]
      });
      setNewApp('');
    }
  };

  const removeAllowedApp = (app) => {
    setConfig({
      ...config,
      allowedApps: config.allowedApps.filter(a => a !== app)
    });
  };

  const addBlockedApp = () => {
    if (newBlockedApp.trim()) {
      setConfig({
        ...config,
        blockedApps: [...(config.blockedApps || []), newBlockedApp.trim()]
      });
      setNewBlockedApp('');
    }
  };

  const removeBlockedApp = (app) => {
    setConfig({
      ...config,
      blockedApps: config.blockedApps.filter(a => a !== app)
    });
  };

  return (
    <div className="space-y-6">
      {/* Apps Permitidas */}
      <div className="bg-green-50 rounded-lg p-4">
        <h5 className="font-semibold text-green-900 mb-3">Apps Permitidas (Whitelist)</h5>
        <p className="text-sm text-gray-600 mb-4">
          Solo estas aplicaciones estarán disponibles en el dispositivo. Deja vacío para permitir todas.
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAllowedApp()}
            placeholder="com.ejemplo.app"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={addAllowedApp}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(config.allowedApps || []).map((app, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-green-200 text-green-800 rounded-lg">
              <span className="text-sm font-mono">{app}</span>
              <button
                type="button"
                onClick={() => removeAllowedApp(app)}
                className="hover:text-green-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Apps Bloqueadas */}
      <div className="bg-red-50 rounded-lg p-4">
        <h5 className="font-semibold text-red-900 mb-3">Apps Bloqueadas (Blacklist)</h5>
        <p className="text-sm text-gray-600 mb-4">
          Estas aplicaciones no estarán disponibles en el dispositivo.
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newBlockedApp}
            onChange={(e) => setNewBlockedApp(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addBlockedApp()}
            placeholder="com.ejemplo.app"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={addBlockedApp}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(config.blockedApps || []).map((app, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-red-200 text-red-800 rounded-lg">
              <span className="text-sm font-mono">{app}</span>
              <button
                type="button"
                onClick={() => removeBlockedApp(app)}
                className="hover:text-red-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Ejemplos de Package Names</h5>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Chrome: <code className="bg-white px-2 py-1 rounded">com.android.chrome</code></p>
          <p>• Gmail: <code className="bg-white px-2 py-1 rounded">com.google.android.gm</code></p>
          <p>• WhatsApp: <code className="bg-white px-2 py-1 rounded">com.whatsapp</code></p>
          <p>• YouTube: <code className="bg-white px-2 py-1 rounded">com.google.android.youtube</code></p>
        </div>
      </div>
    </div>
  );
};

// Tab de Modo Kiosk
const KioskTab = ({ config, setConfig }) => {
  const [newKioskApp, setNewKioskApp] = useState('');

  const addKioskApp = () => {
    if (newKioskApp.trim()) {
      setConfig({
        ...config,
        kioskApps: [...(config.kioskApps || []), newKioskApp.trim()]
      });
      setNewKioskApp('');
    }
  };

  const removeKioskApp = (app) => {
    setConfig({
      ...config,
      kioskApps: config.kioskApps.filter(a => a !== app)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-lg p-4">
        <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Modo Kiosk
        </h5>
        
        <ToggleSwitch
          label="Habilitar Modo Kiosk"
          checked={config.kioskMode}
          onChange={(val) => setConfig({...config, kioskMode: val})}
          description="El dispositivo solo permitirá usar las aplicaciones especificadas"
        />

        {config.kioskMode && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aplicaciones de Kiosk
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Especifica qué aplicaciones estarán disponibles en modo kiosk
              </p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newKioskApp}
                  onChange={(e) => setNewKioskApp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKioskApp()}
                  placeholder="com.ejemplo.app"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addKioskApp}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(config.kioskApps || []).map((app, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-purple-200 text-purple-800 rounded-lg">
                    <span className="text-sm font-mono">{app}</span>
                    <button
                      type="button"
                      onClick={() => removeKioskApp(app)}
                      className="hover:text-purple-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {config.kioskApps.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Debes agregar al menos una aplicación para el modo kiosk
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ label, checked, onChange, description }) => (
  <div className="flex items-start justify-between py-3">
    <div className="flex-1">
      <label className="font-medium text-gray-800">{label}</label>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default PolicyManagement;