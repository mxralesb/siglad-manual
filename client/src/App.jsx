import React, { useState, useEffect } from "react";
import { DeclarationsPieChart, DeclarationsBarChart } from './charts.jsx';
import MapaRuta from './mapa-ruta.jsx';
import Swal from 'sweetalert2';
import { 
  User, 
  Lock, 
  SignIn, 
  SignOut, 
  Eye, 
  EyeSlash, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Warning, 
  Info, 
  Plus, 
  Trash, 
  MagnifyingGlass, 
  Truck, 
  Shield, 
  Gear, 
  FileText, 
  Package, 
  MapPin, 
  CurrencyDollar, 
  Calendar, 
  Globe, 
  Car, 
  UserCircle, 
  Building, 
  ListBullets,
  Spinner
} from '@phosphor-icons/react';

const API = import.meta.env.VITE_API_URL || "http://localhost:4001";

// SweetAlert2 utility functions with dark mode support
const getThemeConfig = () => {
  const isDark = document.body.classList.contains('theme--dark');
  return {
    colorScheme: isDark ? 'dark' : 'light',
    background: isDark ? '#1E293B' : '#ffffff',
    text: isDark ? '#F8FAFC' : '#0F172A',
    confirmButtonColor: isDark ? '#34D399' : '#10B981',
    cancelButtonColor: isDark ? '#94A3B8' : '#6B7280',
    iconColor: isDark ? '#60A5FA' : '#2563EB'
  };
};

const formatCurrency = (value, currency) => {
  const number = Number(value);
  if (isNaN(number)) {
    return `0.00 ${currency}`;
  }
  return `${number.toFixed(2)} ${currency}`;
};

const showSuccess = (title, text = '') => {
  const theme = getThemeConfig();
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: theme.confirmButtonColor,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: true,
    colorScheme: theme.colorScheme,
    background: theme.background,
    color: theme.text,
    customClass: {
      popup: 'swal-dark-popup',
      title: 'swal-dark-title',
      content: 'swal-dark-content',
      confirmButton: 'swal-dark-confirm-button'
    }
  });
};

const showError = (title, text = '') => {
  const theme = getThemeConfig();
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#EF4444',
    colorScheme: theme.colorScheme,
    background: theme.background,
    color: theme.text,
    customClass: {
      popup: 'swal-dark-popup',
      title: 'swal-dark-title',
      content: 'swal-dark-content',
      confirmButton: 'swal-dark-confirm-button'
    }
  });
};

const showWarning = (title, text = '') => {
  const theme = getThemeConfig();
  Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#F59E0B',
    colorScheme: theme.colorScheme,
    background: theme.background,
    color: theme.text,
    customClass: {
      popup: 'swal-dark-popup',
      title: 'swal-dark-title',
      content: 'swal-dark-content',
      confirmButton: 'swal-dark-confirm-button'
    }
  });
};

const showConfirm = (title, text = '', confirmText = 'Sí, continuar') => {
  const theme = getThemeConfig();
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: theme.cancelButtonColor,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    colorScheme: theme.colorScheme,
    background: theme.background,
    color: theme.text,
    customClass: {
      popup: 'swal-dark-popup',
      title: 'swal-dark-title',
      content: 'swal-dark-content',
      confirmButton: 'swal-dark-confirm-button',
      cancelButton: 'swal-dark-cancel-button'
    }
  });
};

const showLoading = (title = 'Procesando...') => {
  const theme = getThemeConfig();
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    colorScheme: theme.colorScheme,
    background: theme.background,
    color: theme.text,
    customClass: {
      popup: 'swal-dark-popup',
      title: 'swal-dark-title',
      content: 'swal-dark-content'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

const hideLoading = () => {
  Swal.close();
};

function Card({ title, actions, children, className = "" }) {
  return (
    <div className={`card fade-in ${className}`}>
      <div className="card-pad pb-0 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        {actions}
      </div>
      <div className="card-pad pt-4">{children}</div>
    </div>
  );
}

export function Button({ variant = "ghost", className = "", loading = false, children, ...props }) {
  const base = "btn";
  const map = { 
    solid: "btn-solid", 
    ghost: "btn-ghost", 
    danger: "btn-danger",
    secondary: "btn-secondary"
  };
  
  return (
    <button 
      className={`${base} ${map[variant]} ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} 
      disabled={loading}
      {...props}
    >
      {loading && <Spinner className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
}

function PrimaryButton(props) {
  return <Button variant="solid" {...props} />;
}

function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export function Input({ className, ...props }) {
  return <input className={`input ${className || ''}`} {...props} />;
}

function Select({ className, ...props }) {
  return <select className={`select ${className || ''}`} {...props} />;
}

function useAuthFetch() {
  return async (path, options = {}) => {
    const token = localStorage.getItem("token");
    console.log(`🔗 Fetching: ${API}${path}`, { token: token ? 'present' : 'missing' });
    
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log(`📥 Response: ${res.status} ${res.statusText}`);
    
    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      data = {};
    }
    
    if (!res.ok) {
      console.error('❌ API Error (Status:', res.status, '):');
      console.error('📄 Error Data:', JSON.stringify(data, null, 2));
      console.error('📄 Raw Response:', res.statusText);
      throw new Error(data.error || data.detail || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  };
}

function ThemeSwitcher() {
  const [mode, setMode] = useState(() => {
    // Inicializar con el valor del localStorage o "light" por defecto
    return localStorage.getItem("theme") || "light";
  });
  
  useEffect(() => {
    const applyTheme = (themeMode) => {
      const body = document.body;
      
      // Limpiar todas las clases de tema
      body.classList.remove("theme--dark", "theme--light", "theme--gray");
      
      if (themeMode === "dark") {
        body.classList.add("theme--dark");
        console.log("🌙 Aplicando modo oscuro - Clases:", body.className);
      } else if (themeMode === "light") {
        body.classList.add("theme--light");
        console.log("☀️ Aplicando modo claro - Clases:", body.className);
      } else if (themeMode === "gray") {
        body.classList.add("theme--gray");
        console.log("🔘 Aplicando modo gris claro - Clases:", body.className);
      } else {
        // Auto mode - detectar preferencia del sistema
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          body.classList.add("theme--dark");
          console.log("🌙 Aplicando modo oscuro (auto) - Clases:", body.className);
        } else {
          body.classList.add("theme--light");
          console.log("☀️ Aplicando modo claro (auto) - Clases:", body.className);
        }
      }
      
      // Forzar re-renderizado de estilos
      body.style.display = 'none';
      body.offsetHeight; // Trigger reflow
      body.style.display = '';
    };
    
    // Aplicar tema inmediatamente
    applyTheme(mode);
    
    // Guardar en localStorage
    localStorage.setItem("theme", mode);
    
    // Escuchar cambios en la preferencia del sistema para modo auto
    if (mode === "auto" && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme("auto");
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);
  
  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    console.log("Cambiando a modo:", newMode);
  };
  
  return (
    <Select value={mode} onChange={handleModeChange}>
      <option value="auto">Apariencia: Auto</option>
      <option value="light">Claro</option>
      <option value="dark">Oscuro</option>
      <option value="gray">Gris Claro</option>
    </Select>
  );
}

function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      showSuccess("¡Bienvenido!", `Has iniciado sesión como ${data.role}`);
      onAuth(data.role);
    } catch (e) {
      showError("Error de autenticación", e.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6 animate-pulse hover:animate-bounce transition-all duration-300">
            <span className="text-4xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SIGLAD
          </h1>
          <p className="text-gray-600 text-lg">Sistema de Gestión de Logística Aduanera</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500">Accede a tu cuenta para continuar</p>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-5">
              <div className="field">
                <label className="label flex items-center gap-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Input 
                    type="email"
                    placeholder="tu@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />                </div>
              </div>
              
              <div className="field">
                <label className="label flex items-center gap-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <PrimaryButton 
              type="submit" 
              className="w-full py-3 text-lg font-semibold" 
              loading={loading}
            >
              {loading ? (
                <>
                  <Spinner className="w-5 h-5 animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <SignIn className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}

function Transportista() {
  const fetcher = useAuthFetch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const TIPOS = ["IMPORTACION", "EXPORTACION", "TRANSITO"];
  const MEDIOS = ["TERRESTRE", "MARITIMO", "AEREO"];
  const PAISES_2 = ["GT", "SV", "HN", "NI", "CR", "PA", "MX", "US", "CA", "CO", "PE", "BR", "AR", "CL", "EC", "VE", "PY", "UY", "BO"];
  const MONEDAS = ["USD", "GTQ", "EUR", "MXN", "CRC", "HNL", "NIO", "PAB", "COP", "PEN", "BRL", "ARS", "CLP", "UYU", "BOB"];
  const UNIDADES_MEDIDA = [
    "KG", "LBS", "TON", 
    "L", "ML", "GAL",
    "M", "CM", "M2", "M3",
    "PZA", "UNI", "PAR"
  ];
  const [imps, setImps] = useState([]);
  const [qImp, setQImp] = useState("");
  const [exps, setExps] = useState([]);
  const [qExp, setQExp] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState(null);
  // Generar número de documento único automáticamente
  const generateDocumentNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DUCA-${timestamp}-${random}`.slice(0, 20);
  };

  const [form, setForm] = useState({
    numeroDocumento: generateDocumentNumber(),
    fechaEmision: "",
    paisEmisor: "GT",
    tipoOperacion: "IMPORTACION",
    exportador: { idExportador: "", nombreExportador: "", direccionExportador: "", telefono: "", email: "" },
    importador: { idImportador: "", nombreImportador: "", direccionImportador: "", telefono: "", email: "" },
    transporte: {
      medioTransporte: "TERRESTRE",
      placaVehiculo: "",
      conductor: { nombreConductor: "", licenciaConductor: "", paisLicencia: "GT" },
      ruta: { aduanaSalida: "", aduanaEntrada: "", paisDestino: "SV", kilometrosAproximados: "" },
    },
    valores: { valorFactura: "", gastosTransporte: "", seguro: "", otrosGastos: "", valorAduanaTotal: "0.00", moneda: "USD" },
    resultadoSelectivo: { codigo: "", descripcion: "" },
    estadoDocumento: "CONFIRMADO",
    firmaElectronica: "",
  });
  const [items, setItems] = useState([{ linea: 1, descripcion: "", cantidad: "", unidadMedida: "", valorUnitario: "", paisOrigen: "GT" }]);
  const [tab, setTab] = useState("registro");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      let url = "/status/mine";
      const params = [];
      
      if (fechaInicio || fechaFin) {
        const queryParams = [];
        if (fechaInicio) queryParams.push(`fechaInicio=${fechaInicio}`);
        if (fechaFin) queryParams.push(`fechaFin=${fechaFin}`);
        url += `?${queryParams.join('&')}`;
      }
      
      console.log('🔍 Cargando declaraciones con URL:', url);
      const data = await fetcher(url);
      console.log('📦 Declaraciones recibidas:', data);
      setList(data);
    } catch (error) {
      showError("Error al cargar declaraciones", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadImps = async (q = "") => {
    try {
      const data = await fetcher(`/catalogs/importers?status=ACTIVO${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      setImps(data);
    } catch (error) {
      showError("Error al cargar importadores", error.message);
    }
  };
  
  const loadExps = async (q = "") => {
    try {
      const data = await fetcher(`/catalogs/exporters?status=ACTIVO${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      setExps(data);
    } catch (error) {
      showError("Error al cargar exportadores", error.message);
    }
  };

  useEffect(() => {
    loadImps();
    loadExps();

    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.result === 'success') {
          setExchangeRates(data.rates);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
  }, []);
  
  useEffect(() => {
    if (tab === "declaraciones") {
      load();
    }
  }, [tab, fechaInicio, fechaFin]);

  const addItem = () => {
    const next = (items[items.length - 1]?.linea || 0) + 1;
    setItems([...items, { linea: next, descripcion: "", cantidad: "", unidadMedida: "", valorUnitario: "", paisOrigen: "GT" }]);
  };
  const delItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updItem = (i, patch) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const registrar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validaciones
    if (!form.fechaEmision) {
      showWarning("Campo requerido", "La fecha de emisión es obligatoria");
      setSubmitting(false);
      return;
    }
    
    if (!form.exportador.idExportador) {
      showWarning("Campo requerido", "Debe seleccionar un exportador ACTIVO");
      setSubmitting(false);
      return;
    }
    
    if (!form.importador.idImportador) {
      showWarning("Campo requerido", "Debe seleccionar un importador ACTIVO");
      setSubmitting(false);
      return;
    }
    
    if (!form.valores.valorAduanaTotal || Number(form.valores.valorAduanaTotal) <= 0) {
      showWarning("Campo requerido", "El valor aduana total debe ser mayor a 0");
      setSubmitting(false);
      return;
    }
    
    // Validar que al menos una mercancía tenga descripción
    const hasValidItems = items.some(item => item.descripcion.trim() && item.cantidad && item.valorUnitario);
    if (!hasValidItems) {
      showWarning("Mercancías requeridas", "Debe agregar al menos una mercancía con descripción, cantidad y valor");
      setSubmitting(false);
      return;
    }
    
    // Validar que todas las mercancías tengan unidad de medida
    const hasValidUnits = items.every(item => item.unidadMedida.trim());
    if (!hasValidUnits) {
      showWarning("Unidad requerida", "Todas las mercancías deben tener una unidad de medida seleccionada");
      setSubmitting(false);
      return;
    }
    
    const payload = {
      duca: {
        numeroDocumento: form.numeroDocumento.trim(),
        fechaEmision: form.fechaEmision,
        paisEmisor: form.paisEmisor,
        tipoOperacion: form.tipoOperacion,
        exportador: {
          idExportador: form.exportador.idExportador.trim(),
          nombreExportador: form.exportador.nombreExportador.trim(),
          direccionExportador: form.exportador.direccionExportador || null,
          contactoExportador: { telefono: form.exportador.telefono || null, email: form.exportador.email || null },
        },
        importador: {
          idImportador: form.importador.idImportador.trim(),
          nombreImportador: form.importador.nombreImportador.trim(),
          direccionImportador: form.importador.direccionImportador || null,
          contactoImportador: { telefono: form.importador.telefono || null, email: form.importador.email || null },
        },
        transporte: {
          medioTransporte: form.transporte.medioTransporte,
          placaVehiculo: form.transporte.placaVehiculo.trim(),
          conductor: {
            nombreConductor: form.transporte.conductor.nombreConductor || null,
            licenciaConductor: form.transporte.conductor.licenciaConductor || null,
            paisLicencia: form.transporte.conductor.paisLicencia || null,
          },
          ruta: {
            aduanaSalida: form.transporte.ruta.aduanaSalida.trim(),
            aduanaEntrada: form.transporte.ruta.aduanaEntrada.trim(),
            paisDestino: form.transporte.ruta.paisDestino,
            kilometrosAproximados: form.transporte.ruta.kilometrosAproximados ? Number(form.transporte.ruta.kilometrosAproximados) : null,
          },
        },
        mercancias: {
          numeroItems: items.length,
          items: items.map((x) => ({
            linea: Number(x.linea),
            descripcion: x.descripcion.trim(),
            cantidad: Number(x.cantidad),
            unidadMedida: x.unidadMedida.trim().toUpperCase(),
            valorUnitario: Number(x.valorUnitario),
            paisOrigen: x.paisOrigen,
          })),
        },
        valores: {
          valorFactura: form.valores.valorFactura ? Number(form.valores.valorFactura) : null,
          gastosTransporte: form.valores.gastosTransporte ? Number(form.valores.gastosTransporte) : null,
          seguro: form.valores.seguro ? Number(form.valores.seguro) : null,
          otrosGastos: form.valores.otrosGastos ? Number(form.valores.otrosGastos) : null,
          valorAduanaTotal: Number(form.valores.valorAduanaTotal),
          moneda: form.valores.moneda,
        },
        resultadoSelectivo:
          form.resultadoSelectivo.codigo || form.resultadoSelectivo.descripcion
            ? { codigo: form.resultadoSelectivo.codigo || null, descripcion: form.resultadoSelectivo.descripcion || null }
            : undefined,
        estadoDocumento: form.estadoDocumento,
        firmaElectronica: form.firmaElectronica || null,
      },
    };
    
    try {
      await fetcher("/declarations", { method: "POST", body: JSON.stringify(payload) });
      
      showSuccess("¡Declaración registrada!", "La declaración DUCA ha sido registrada exitosamente");
      
      // Limpiar formulario y generar nuevo número de documento
      setItems([{ linea: 1, descripcion: "", cantidad: "", unidadMedida: "", valorUnitario: "", paisOrigen: "GT" }]);
      setForm((f) => ({
        ...f,
        numeroDocumento: generateDocumentNumber(), // Generar nuevo número
        fechaEmision: "",
        exportador: { ...f.exportador, idExportador: "", nombreExportador: "" },
        importador: { ...f.importador, idImportador: "", nombreImportador: "" },
        transporte: { ...f.transporte, placaVehiculo: "" },
        valores: { ...f.valores, valorFactura: "", gastosTransporte: "", seguro: "", otrosGastos: "", valorAduanaTotal: "0.00" },
      }));
      
      // No cargar automáticamente, solo cambiar de pestaña
      setTab("declaraciones");
    } catch (e) {
      console.error('❌ Error al registrar declaración:', e);
      showError("Error al registrar declaración", e?.error || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular estadísticas para dashboard
  const stats = {
    total: list.length,
    VALIDADA: list.filter(x => x.estado === "VALIDADA").length,
    RECHAZADA: list.filter(x => x.estado === "RECHAZADA").length,
    'EN REVISION': list.filter(x => x.estado === "EN REVISION").length,
    CONFIRMADO: list.filter(x => x.estado === "CONFIRMADO").length,
    PENDIENTE: list.filter(x => x.estado === "PENDIENTE").length,
  };

  return (
    <div className="space-y-6">
      {/* Pestañas de navegación */}
      <div className="card card-pad inline-flex gap-2">
        <Button 
          className={`${tab === "registro" ? "btn-solid text-white" : "btn-ghost text-[var(--text)] border-[var(--border)]"} h-12 px-6`} 
          onClick={() => setTab("registro")}
        >
          <FileText className="w-4 h-4" />
          Registro DUCA
        </Button>
        <Button 
          className={`${tab === "declaraciones" ? "btn-solid text-white" : "btn-ghost text-[var(--text)] border-[var(--border)]"} h-12 px-6`} 
          onClick={() => setTab("declaraciones")}
        >
          <ListBullets className="w-4 h-4" />
          Mis Declaraciones
        </Button>
      </div>

      {/* Contenido de las pestañas */}
      {tab === "registro" && (
      <form onSubmit={registrar} className="section">
        <h2 className="h2">Registro de Declaración DUCA</h2>
        
        {/* Información del Documento */}
        <div className="form-section">
          <h3 className="form-section-title flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información del Documento
          </h3>
          <div className="field-group two-cols">
            <div className="field">
              <label className="label flex items-center gap-2">
                Número de Documento (Generado Automáticamente)
                <div className="group relative">
                  <Info className="w-4 h-4 text-blue-500 cursor-help" />
                  <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                    Este código único es generado automáticamente por el sistema y no puede ser modificado
                  </div>
                </div>
              </label>
              <div className="relative">
                <Input 
                  value={form.numeroDocumento} 
                  readOnly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed font-mono text-sm font-semibold"
                  title="Código generado automáticamente por el sistema"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha de Emisión *</label>
              <Input 
                type="date" 
                value={form.fechaEmision} 
                onChange={(e) => setForm({ ...form, fechaEmision: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field-group two-cols">
            <div className="field">
              <label className="label">País Emisor</label>
              <Select value={form.paisEmisor} onChange={(e) => setForm({ ...form, paisEmisor: e.target.value })}>
                {PAISES_2.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div className="field">
              <label className="label">Tipo de Operación</label>
              <Select value={form.tipoOperacion} onChange={(e) => setForm({ ...form, tipoOperacion: e.target.value })}>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
          </div>
        </div>

        {/* Exportador e Importador */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-section">
            <h3 className="form-section-title flex items-center gap-2">
              <Building className="w-5 h-5" />
              Exportador
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Buscar por ID o nombre" 
                  value={qExp} 
                  onChange={(e) => setQExp(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && loadExps(qExp)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => loadExps(qExp)} 
                  className="bg-blue-100 text-blue-500 border-blue-200 hover:bg-blue-150 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800"
                >
                  <MagnifyingGlass className="w-4 h-4" />
                  Buscar
                </Button>
              </div>
              <div className="field">
                <label className="label">Seleccionar Exportador *</label>
                <Select
                  value={form.exportador.idExportador}
                  onChange={(e) => {
                    const id = e.target.value;
                    const sel = exps.find((x) => x.id === id);
                    setForm({ ...form, exportador: { ...form.exportador, idExportador: id, nombreExportador: sel ? sel.nombre : "" } });
                  }}
                  required
                >
                  <option value="">-- Selecciona exportador ACTIVO --</option>
                  {exps.map((x) => (
                    <option key={x.id} value={x.id}>{x.id} — {x.nombre}</option>
                  ))}
                </Select>
              </div>
              <div className="field">
                <label className="label">Nombre del Exportador</label>
                <Input 
                  placeholder="Nombre del exportador" 
                  value={form.exportador.nombreExportador} 
                  readOnly 
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Importador
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Buscar por ID o nombre" 
                  value={qImp} 
                  onChange={(e) => setQImp(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && loadImps(qImp)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => loadImps(qImp)} 
                  className="bg-blue-100 text-blue-500 border-blue-200 hover:bg-blue-150 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800"
                >
                  <MagnifyingGlass className="w-4 h-4" />
                  Buscar
                </Button>
              </div>
              <div className="field">
                <label className="label">Seleccionar Importador *</label>
                <Select
                  value={form.importador.idImportador}
                  onChange={(e) => {
                    const id = e.target.value;
                    const sel = imps.find((x) => x.id === id);
                    setForm({ ...form, importador: { ...form.importador, idImportador: id, nombreImportador: sel ? sel.nombre : "" } });
                  }}
                  required
                >
                  <option value="">-- Selecciona importador ACTIVO --</option>
                  {imps.map((x) => (
                    <option key={x.id} value={x.id}>{x.id} — {x.nombre}</option>
                  ))}
                </Select>
              </div>
              <div className="field">
                <label className="label">Nombre del Importador</label>
                <Input 
                  placeholder="Nombre del importador" 
                  value={form.importador.nombreImportador} 
                  readOnly 
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transporte y Ruta */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-section">
            <h3 className="form-section-title flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Información de Transporte
            </h3>
            <div className="space-y-4">
              <div className="field-group two-cols">
                <div className="field">
                  <label className="label">Medio de Transporte</label>
                  <Select value={form.transporte.medioTransporte} onChange={(e) => setForm({ ...form, transporte: { ...form.transporte, medioTransporte: e.target.value } })}>
                    {MEDIOS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </Select>
                </div>
                <div className="field">
                  <label className="label">Placa del Vehículo</label>
                  <Input 
                    placeholder="ABC-123" 
                    value={form.transporte.placaVehiculo} 
                    onChange={(e) => setForm({ ...form, transporte: { ...form.transporte, placaVehiculo: e.target.value.slice(0, 10) } })}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="field-group three-cols">
                <div className="field">
                  <label className="label">Conductor (Opcional)</label>
                  <Input 
                    placeholder="Nombre del conductor" 
                    value={form.transporte.conductor.nombreConductor} 
                    onChange={(e) => setForm({ ...form, transporte: { ...form.transporte, conductor: { ...form.transporte.conductor, nombreConductor: e.target.value.slice(0, 80) } } })}
                    maxLength={80}
                  />
                </div>
                <div className="field">
                  <label className="label">Licencia</label>
                  <Input 
                    placeholder="Número de licencia" 
                    value={form.transporte.conductor.licenciaConductor} 
                    onChange={(e) => setForm({ ...form, transporte: { ...form.transporte, conductor: { ...form.transporte.conductor, licenciaConductor: e.target.value.slice(0, 20) } } })}
                    maxLength={20}
                  />
                </div>
                <div className="field">
                  <label className="label">País de Licencia</label>
                  <Select value={form.transporte.conductor.paisLicencia} onChange={(e) => setForm({ ...form, transporte: { ...form.transporte, conductor: { ...form.transporte.conductor, paisLicencia: e.target.value } } })}>
                    {PAISES_2.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Información de Ruta
            </h3>
            <MapaRuta
              setRouteInfo={(routeInfo) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  transporte: {
                    ...prevForm.transporte,
                    ruta: {
                      ...prevForm.transporte.ruta,
                      ...routeInfo,
                    },
                  },
                }))
              }
            />
          </div>
        </div>

        {/* Mercancías */}
        <div className="form-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="form-section-title flex items-center gap-2">
              <Package className="w-5 h-5" />
              Mercancías ({items.length} líneas)
            </h3>
            <Button 
              onClick={addItem} 
              className="btn-sm bg-green-200 text-green-600 border-green-300 hover:bg-green-250 dark:bg-green-900 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800"
            >
              <Plus className="w-4 h-4" />
              Agregar Línea
            </Button>
          </div>
          
          <div className="space-y-4">
            {items.map((it, i) => {
              const cantidad = parseFloat(it.cantidad) || 0;
              const valorUnitario = parseFloat(it.valorUnitario) || 0;
              const subtotal = (cantidad * valorUnitario).toFixed(2);
              
              return (
                <div key={i} className="bg-[var(--card)] rounded-lg p-4 border-2 border-[var(--border)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[var(--text)]">Línea {it.linea}</span>
                    {items.length > 1 && (
                      <Button 
                        type="button" 
                        variant="danger" 
                        className="btn-sm"
                        onClick={() => delItem(i)}
                      >
                        <Trash className="w-4 h-4" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-6 gap-3">
                    <div className="field">
                      <label className="label text-xs">Línea</label>
                      <Input 
                        placeholder="1" 
                        type="number"
                        inputMode="numeric" 
                        value={it.linea} 
                        onChange={(e) => updItem(i, { linea: e.target.value.replace(/[^0-9]/g, "") })}
                        min="1"
                      />
                    </div>
                    
                    <div className="field md:col-span-2">
                      <label className="label text-xs">Descripción *</label>
                      <Input 
                        placeholder="Descripción de la mercancía" 
                        value={it.descripcion} 
                        onChange={(e) => updItem(i, { descripcion: e.target.value.slice(0, 120) })}
                        maxLength={120}
                        required
                      />
                    </div>
                    
                    <div className="field">
                      <label className="label text-xs">Cantidad *</label>
                      <Input 
                        placeholder="0" 
                        type="number"
                        inputMode="numeric" 
                        value={it.cantidad} 
                        onChange={(e) => {
                          updItem(i, { cantidad: e.target.value.replace(/[^0-9]/g, "") });
                          // Actualizar valor de factura
                          setTimeout(() => {
                            const totalMercancias = items.reduce((sum, item, idx) => {
                              const cant = idx === i ? parseFloat(e.target.value.replace(/[^0-9]/g, "")) || 0 : parseFloat(item.cantidad) || 0;
                              const valUnit = parseFloat(item.valorUnitario) || 0;
                              return sum + (cant * valUnit);
                            }, 0);
                            const newValues = { ...form.valores, valorFactura: totalMercancias.toFixed(2) };
                            const gastosTransporte = parseFloat(newValues.gastosTransporte) || 0;
                            const seguro = parseFloat(newValues.seguro) || 0;
                            const otrosGastos = parseFloat(newValues.otrosGastos) || 0;
                            newValues.valorAduanaTotal = (totalMercancias + gastosTransporte + seguro + otrosGastos).toFixed(2);
                            setForm({ ...form, valores: newValues });
                          }, 0);
                        }}
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="field">
                      <label className="label text-xs">Unidad *</label>
                      <Select 
                        value={it.unidadMedida} 
                        onChange={(e) => updItem(i, { unidadMedida: e.target.value })}
                        className="unidad-select"
                        required
                      >
                        <option value="" disabled>Seleccione unidad</option>
                        {UNIDADES_MEDIDA.map((unidad) => (
                          <option key={unidad} value={unidad}>{unidad}</option>
                        ))}
                      </Select>
                    </div>
                    
                    <div className="field">
                      <label className="label text-xs">País Origen</label>
                      <Select value={it.paisOrigen} onChange={(e) => updItem(i, { paisOrigen: e.target.value })}>
                        {PAISES_2.map((p) => <option key={p} value={p}>{p}</option>)}
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    <div className="field">
                      <label className="label text-xs">Valor Unitario *</label>
                      <Input 
                        placeholder="0.00" 
                        type="number"
                        inputMode="decimal" 
                        value={it.valorUnitario} 
                        onChange={(e) => {
                          updItem(i, { valorUnitario: e.target.value.replace(/[^0-9.]/g, "") });
                          // Actualizar valor de factura
                          setTimeout(() => {
                            const totalMercancias = items.reduce((sum, item, idx) => {
                              const cant = parseFloat(item.cantidad) || 0;
                              const valUnit = idx === i ? parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0 : parseFloat(item.valorUnitario) || 0;
                              return sum + (cant * valUnit);
                            }, 0);
                            const newValues = { ...form.valores, valorFactura: totalMercancias.toFixed(2) };
                            const gastosTransporte = parseFloat(newValues.gastosTransporte) || 0;
                            const seguro = parseFloat(newValues.seguro) || 0;
                            const otrosGastos = parseFloat(newValues.otrosGastos) || 0;
                            newValues.valorAduanaTotal = (totalMercancias + gastosTransporte + seguro + otrosGastos).toFixed(2);
                            setForm({ ...form, valores: newValues });
                          }, 0);
                        }}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="field">
                      <label className="label text-xs">Subtotal</label>
                      <Input 
                        value={subtotal}
                        readOnly
                        disabled
                        className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed font-semibold text-blue-600 dark:text-blue-400"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Total de mercancías */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Total de Mercancías:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {form.valores.moneda} {items.reduce((sum, item) => {
                    const cantidad = parseFloat(item.cantidad) || 0;
                    const valorUnitario = parseFloat(item.valorUnitario) || 0;
                    return sum + (cantidad * valorUnitario);
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="form-section">
          <h3 className="form-section-title flex items-center gap-2">
            <CurrencyDollar className="w-5 h-5" />
            Valores Comerciales
          </h3>
          {/* Moneda primero */}
          <div className="field-group">
            <div className="field">
              <label className="label">Moneda *</label>
              <Select value={form.valores.moneda} onChange={(e) => setForm({ ...form, valores: { ...form.valores, moneda: e.target.value } })}>
                {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
          </div>
          {/* Campos de valores individuales */}
          <div className="field-group four-cols">
            <div className="field">
              <label className="label">Valor de Factura (Calculado automáticamente)</label>
              <Input 
                placeholder="Calculado desde mercancías"
                type="text"
                value={form.valores.valorFactura} 
                readOnly
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed font-semibold text-blue-600 dark:text-blue-400"
              />
            </div>
            {[
              ["gastosTransporte", "Gastos de Transporte", "Costos de transporte"],
              ["seguro", "Seguro", "Costo del seguro"],
              ["otrosGastos", "Otros Gastos", "Otros gastos adicionales"],
            ].map(([key, label, placeholder]) => (
              <div key={key} className="field">
                <label className="label">{label}</label>
                <Input 
                  placeholder={placeholder}
                  type="number"
                  inputMode="decimal" 
                  value={form.valores[key]} 
                  onChange={(e) => {
                    const newValues = { ...form.valores, [key]: e.target.value.replace(/[^0-9.]/g, "") };
                    // Calcular automáticamente el total
                    const valorFactura = parseFloat(newValues.valorFactura) || 0;
                    const gastosTransporte = parseFloat(newValues.gastosTransporte) || 0;
                    const seguro = parseFloat(newValues.seguro) || 0;
                    const otrosGastos = parseFloat(newValues.otrosGastos) || 0;
                    const total = (valorFactura + gastosTransporte + seguro + otrosGastos).toFixed(2);
                    newValues.valorAduanaTotal = total;
                    setForm({ ...form, valores: newValues });
                  }}
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          {/* Valor Aduana Total calculado automáticamente */}
          <div className="field-group">
            <div className="field">
              <label className="label flex items-center gap-2">
                Valor Aduana Total (Calculado Automáticamente) *
                <div className="group relative">
                  <Info className="w-4 h-4 text-blue-500 cursor-help" />
                  <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg">
                    Este valor se calcula automáticamente sumando: Valor Factura + Gastos Transporte + Seguro + Otros Gastos
                  </div>
                </div>
              </label>
              <Input 
                placeholder="Se calcula automáticamente" 
                type="text"
                value={form.valores.valorAduanaTotal} 
                readOnly
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed font-semibold text-lg text-green-600 dark:text-green-400"
                title="Valor calculado automáticamente"
              />
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="form-section">
          <h3 className="form-section-title flex items-center gap-2">
            <ListBullets className="w-5 h-5" />
            Información Adicional
          </h3>
          <div className="field-group two-cols">
            <div className="field">
              <label className="label">Código Selectivo</label>
              <Select 
                value={form.resultadoSelectivo.codigo} 
                onChange={(e) => setForm({ ...form, resultadoSelectivo: { ...form.resultadoSelectivo, codigo: e.target.value } })}
              >
                <option value="">Seleccione un código</option>
                <option value="V">V - Verde (Despacho directo)</option>
                <option value="A">A - Amarillo (Revisión documental)</option>
                <option value="R">R - Rojo (Revisión física)</option>
                <option value="N">N - Negro (Canal de auditoría)</option>
              </Select>
            </div>
            <div className="field">
              <label className="label">Descripción Selectiva</label>
              <Input 
                placeholder="Descripción del resultado selectivo" 
                value={form.resultadoSelectivo.descripcion} 
                onChange={(e) => setForm({ ...form, resultadoSelectivo: { ...form.resultadoSelectivo, descripcion: e.target.value.slice(0, 60) } })}
                maxLength={60}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Firma Electrónica</label>
            <Input 
              placeholder="Firma electrónica del documento" 
              value={form.firmaElectronica} 
              onChange={(e) => setForm({ ...form, firmaElectronica: e.target.value.slice(0, 64) })}
              maxLength={64}
            />
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex items-center justify-center pt-6 border-t border-gray-200">
          <PrimaryButton 
            type="submit" 
            className="px-8 py-3 text-lg"
            loading={submitting}
          >
            {submitting ? (
              <>
                <Spinner className="w-5 h-5 animate-spin mr-2" />
                Registrando...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Registrar Declaración DUCA
              </>
            )}
          </PrimaryButton>
        </div>
      </form>
      )}

      {/* Pestaña de Declaraciones con Dashboard */}
      {tab === "declaraciones" && (
        <div className="space-y-6">
          {/* Dashboard de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-6 shadow-md transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -top-4 text-blue-500 opacity-10">
                <FileText size={80} weight="fill" />
              </div>
              <div className="relative">
                <div className="text-sm font-semibold uppercase text-blue-600">Total</div>
                <div className="text-4xl font-bold text-blue-800 mt-2">{stats.total}</div>
                <div className="text-sm text-blue-700/80 mt-1">Declaraciones totales</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-green-200 bg-green-50/30 p-6 shadow-md transition-all duration-300 hover:border-green-400 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -top-4 text-green-500 opacity-10">
                <CheckCircle size={80} weight="fill" />
              </div>
              <div className="relative">
                <div className="text-sm font-semibold uppercase text-green-600">Validadas</div>
                <div className="text-4xl font-bold text-green-800 mt-2">{stats.VALIDADA}</div>
                <div className="text-sm text-green-700/80 mt-1">Aprobadas</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-red-50/30 p-6 shadow-md transition-all duration-300 hover:border-red-400 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -top-4 text-red-500 opacity-10">
                <XCircle size={80} weight="fill" />
              </div>
              <div className="relative">
                <div className="text-sm font-semibold uppercase text-red-600">Rechazadas</div>
                <div className="text-4xl font-bold text-red-800 mt-2">{stats.RECHAZADA}</div>
                <div className="text-sm text-red-700/80 mt-1">No aprobadas</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50/30 p-6 shadow-md transition-all duration-300 hover:border-gray-400 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -top-4 text-gray-500 opacity-10">
                <Clock size={80} weight="fill" />
              </div>
              <div className="relative">
                <div className="text-sm font-semibold uppercase text-gray-600">Pendientes</div>
                <div className="text-4xl font-bold text-gray-800 mt-2">{stats.PENDIENTE}</div>
                <div className="text-sm text-gray-700/80 mt-1">En proceso</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-purple-50/30 p-6 shadow-md transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -top-4 text-purple-500 opacity-10">
                <CurrencyDollar size={80} weight="fill" />
              </div>
              <div className="relative">
                <div className="text-sm font-semibold uppercase text-purple-600">Valor Total</div>
                <div className="text-3xl font-bold text-purple-800 mt-2">
                  {exchangeRates ? (
                    formatCurrency(list.reduce((acc, x) => acc + Number(x.valor_aduana_total), 0) * exchangeRates[selectedCurrency], selectedCurrency)
                  ) : (
                    formatCurrency(list.reduce((acc, x) => acc + Number(x.valor_aduana_total), 0), 'USD')
                  )}
                </div>
                <div className="text-sm text-purple-700/80 mt-1">Valor total declarado</div>
                <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="mt-2 !w-full !py-1 !text-xs">
                  {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Distribución de Estados" className="fade-in lg:col-span-1">
              <DeclarationsPieChart data={stats} />
            </Card>
            <Card title="Declaraciones por Mes" className="fade-in lg:col-span-2">
              <DeclarationsBarChart data={
                list.reduce((acc, x) => {
                  const month = new Date(x.fecha_emision).toLocaleString('es-ES', { month: 'short' });
                  const year = new Date(x.fecha_emision).getFullYear();
                  const key = `${month} ${year}`;
                  const existing = acc.find(item => item.name === key);
                  if (existing) {
                    existing.declaraciones += 1;
                  } else {
                    acc.push({ name: key, declaraciones: 1 });
                  }
                  return acc;
                }, [])
              } />
            </Card>
          </div>

          {/* Filtros por fecha */}
          <Card title={
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Filtrar por Fecha
            </div>
          } className="fade-in">
            <div className="flex items-end gap-4">
              <div className="field flex-1">
                <label className="label">Fecha Inicio</label>
                <Input 
                  type="date" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="field flex-1">
                <label className="label">Fecha Fin</label>
                <Input 
                  type="date" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <SecondaryButton 
                onClick={() => {
                  setFechaInicio("");
                  setFechaFin("");
                }} 
                className="h-10"
              >
                Limpiar
              </SecondaryButton>
            </div>
            {(fechaInicio || fechaFin) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg animate-pulse">
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Info className="w-4 h-4" />
                  <span>
                    {fechaInicio && fechaFin 
                      ? `Mostrando declaraciones desde ${new Date(fechaInicio).toLocaleDateString()} hasta ${new Date(fechaFin).toLocaleDateString()}`
                      : fechaInicio 
                      ? `Mostrando declaraciones desde ${new Date(fechaInicio).toLocaleDateString()}`
                      : `Mostrando declaraciones hasta ${new Date(fechaFin).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Lista de Declaraciones */}
          <Card title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mis Declaraciones ({list.length})
            </div>
          } className="fade-in">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner mr-3"></div>
                <span className="text-[var(--subtle)]">Cargando declaraciones...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {list.map((x, index) => (
                  <div 
                    key={x.id} 
                    className="group relative bg-gradient-to-r from-[var(--card)] to-[var(--bg)] rounded-2xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 shadow-md hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Indicador de estado lateral */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                      x.estado === "VALIDADA" ? "bg-gradient-to-b from-green-400 to-green-600" :
                      x.estado === "RECHAZADA" ? "bg-gradient-to-b from-red-400 to-red-600" :
                      x.estado === "EN REVISION" ? "bg-gradient-to-b from-yellow-400 to-yellow-600" :
                      "bg-gradient-to-b from-gray-400 to-gray-600"
                    } group-hover:w-3 transition-all duration-300`}></div>
                    
                    <div className="p-6 pl-8">
                      {/* Header con número de documento y estado */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-[var(--primary)] animate-pulse" />
                            <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                              {x.numero_documento}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--subtle)]">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              Emitido: {x.fecha_emision && new Date(x.fecha_emision).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <span className={`badge text-sm px-4 py-2 font-semibold shadow-lg ${
                          x.estado === "VALIDADA" ? "badge-success" :
                          x.estado === "RECHAZADA" ? "badge-error" :
                          x.estado === "EN REVISION" ? "badge-warning" : "badge-mute"
                        }`}>
                          {x.estado === "VALIDADA" && <CheckCircle className="w-4 h-4" />}
                          {x.estado === "RECHAZADA" && <XCircle className="w-4 h-4" />}
                          {x.estado === "EN REVISION" && <Clock className="w-4 h-4" />}
                          {x.estado}
                        </span>
                      </div>
                      
                      {/* Detalles de la declaración */}
                      <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg hover:bg-[var(--primary-light)] transition-colors duration-200">
                          <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-[var(--subtle)] font-medium uppercase tracking-wide">Exportador</div>
                            <div className="text-sm font-semibold text-[var(--text)] truncate" title={x.exportador_nombre}>
                              {x.exportador_nombre || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg hover:bg-[var(--primary-light)] transition-colors duration-200">
                          <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-md">
                            <UserCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-[var(--subtle)] font-medium uppercase tracking-wide">Importador</div>
                            <div className="text-sm font-semibold text-[var(--text)] truncate" title={x.importador_nombre}>
                              {x.importador_nombre || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg hover:bg-[var(--primary-light)] transition-colors duration-200">
                          <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md">
                            <CurrencyDollar className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-[var(--subtle)] font-medium uppercase tracking-wide">Valor Total</div>
                            <div className="text-sm font-bold text-[var(--text)]">
                              {x.moneda} {x.valor_aduana_total ? Number(x.valor_aduana_total).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info adicional */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--subtle)]">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>País: {x.pais_emisor || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Transporte: {x.medio_transporte || 'N/A'}</span>
                        </div>
                        {x.tipo_operacion && (
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span>Tipo: {x.tipo_operacion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {!list.length && (
                  <div className="empty">
                    <FileText className="empty-icon" />
                    <div className="text-[var(--subtle)]">No se encontraron declaraciones</div>
                    <div className="text-sm text-[var(--muted)] mt-1">Intenta ajustar los filtros de fecha o registra una nueva declaración</div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function Agente() {
  const fetcher = useAuthFetch();
  const [pend, setPend] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetcher("/validation/pending");
      setPend(data);
    } catch (error) {
      showError("Error al cargar declaraciones", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { load(); }, []);
  
  const ver = async (id) => { 
    setLoadingDetail(true);
    try { 
      const data = await fetcher(`/declarations/${id}`);
      setDetalle(data);
    } catch (e) { 
      showError("Error al cargar detalle", e.message);
    } finally {
      setLoadingDetail(false);
    }
  };
  
  const decidir = async (id, decision) => { 
    const result = await showConfirm(
      decision === "VALIDADA" ? "¿Validar declaración?" : "¿Rechazar declaración?",
      decision === "VALIDADA" 
        ? "¿Estás seguro de que quieres validar esta declaración?" 
        : "¿Estás seguro de que quieres rechazar esta declaración?",
      decision === "VALIDADA" ? "Sí, validar" : "Sí, rechazar"
    );
    
    if (!result.isConfirmed) return;
    
    setProcessing(true);
    try { 
      await fetcher(`/validation/${id}/decision`, { method: "POST", body: JSON.stringify({ decision }) }); 
      setDetalle(null); 
      await load();
      showSuccess(
        decision === "VALIDADA" ? "Declaración validada" : "Declaración rechazada",
        `La declaración ha sido ${decision === "VALIDADA" ? "validada" : "rechazada"} exitosamente`
      );
    } catch (e) { 
      showError("Error al procesar decisión", e.message);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title={
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Declaraciones Pendientes
        </div>
      } className="fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner mr-3"></div>
            <span className="text-[var(--subtle)]">Cargando declaraciones...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {pend.map((x) => (
              <div key={x.id} className="flex items-center justify-between border-2 border-[var(--border)] rounded-xl p-4 hover:bg-[var(--bg)] hover:border-[var(--primary)] transition-all duration-200 shadow-sm bg-[var(--card)]">
                <div className="flex-1">
                  <div className="font-semibold text-[var(--text)]">{x.numero_documento}</div>
                  <div className="text-sm text-[var(--subtle)] mt-1">
                    <div className="flex items-center gap-1">
                      <UserCircle className="w-3 h-3" />
                      {x.importador_nombre}
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyDollar className="w-3 h-3" />
                      {x.valor_aduana_total} {x.moneda}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => ver(x.id)} 
                    variant="ghost"
                    className="btn-sm border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                    loading={loadingDetail}
                    title="Ver detalles de la declaración"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  <PrimaryButton 
                    onClick={() => decidir(x.id, "VALIDADA")} 
                    className="btn-sm"
                    loading={processing}
                    title="Validar declaración"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Validar
                  </PrimaryButton>
                  <Button 
                    variant="danger" 
                    onClick={() => decidir(x.id, "RECHAZADA")}
                    className="btn-sm"
                    loading={processing}
                    title="Rechazar declaración"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
            {!pend.length && (
              <div className="empty">
                <CheckCircle className="empty-icon" />
                <div className="text-[var(--subtle)]">No hay declaraciones pendientes</div>
                <div className="text-sm text-[var(--muted)] mt-1">Todas las declaraciones han sido procesadas</div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalle de Declaración
          </div>
        }
        actions={detalle && <span className="text-sm text-[var(--text)] bg-blue-50 dark:bg-gray-700 px-2 py-1 rounded border border-blue-200 dark:border-gray-600 font-medium">{detalle.numero_documento}</span>}
        className="fade-in"
      >
        {loadingDetail ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner mr-3"></div>
            <span className="text-[var(--subtle)]">Cargando detalle...</span>
          </div>
        ) : !detalle ? (
          <div className="empty">
            <FileText className="empty-icon" />
            <div className="text-[var(--subtle)]">Selecciona una declaración para ver el detalle</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="detail-card bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-sm">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">FECHA DE EMISIÓN</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{detalle.fecha_emision?.slice(0, 10)}</div>
              </div>
              <div className="detail-card bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-2 border-green-200 dark:border-green-700 shadow-sm">
                <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">MONEDA</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{detalle.moneda}</div>
              </div>
              <div className="detail-card bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">EXPORTADOR</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{detalle.exportador_nombre}</div>
              </div>
              <div className="detail-card bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-700 shadow-sm">
                <div className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-2">IMPORTADOR</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{detalle.importador_nombre}</div>
              </div>
              <div className="detail-card bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">MEDIO DE TRANSPORTE</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{detalle.medio_transporte}</div>
              </div>
              <div className="detail-card bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-700 shadow-sm">
                <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">VALOR ADUANA</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{detalle.valor_aduana_total} {detalle.moneda}</div>
              </div>
            </div>
            
            {detalle.items && detalle.items.length > 0 && (
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Mercancías
                </h4>
                <div className="space-y-2">
                  {detalle.items.map((it) => (
                    <div key={it.linea} className="bg-[var(--card)] p-4 rounded-lg border-2 border-[var(--border)] shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[var(--primary)]">Línea {it.linea}</span>
                        <span className="text-xs text-[var(--subtle)]">{it.pais_origen}</span>
                      </div>
                      <div className="text-sm text-[var(--text)] mb-1">{it.descripcion}</div>
                      <div className="flex items-center gap-4 text-xs text-[var(--subtle)]">
                        <span>Cantidad: {it.cantidad} {it.unidad_medida}</span>
                        <span>Valor unitario: {it.valor_unitario}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function AdminUsuarios({ fetcher }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "TRANSPORTISTA", status: "ACTIVE" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetcher("/users");
      setUsers(data);
    } catch (error) {
      showError("Error al cargar usuarios", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { load(); }, []);
  
  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await fetcher("/users", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", email: "", password: "", role: "TRANSPORTISTA", status: "ACTIVE" });
      await load();
      showSuccess("Usuario creado", "El usuario ha sido creado exitosamente");
    } catch (e) { 
      showError("Error al crear usuario", e.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggle = async (u) => { 
    const result = await showConfirm(
      u.status === "ACTIVE" ? "¿Desactivar usuario?" : "¿Activar usuario?",
      `¿Estás seguro de que quieres ${u.status === "ACTIVE" ? "desactivar" : "activar"} al usuario ${u.name}?`,
      u.status === "ACTIVE" ? "Sí, desactivar" : "Sí, activar"
    );
    
    if (!result.isConfirmed) return;
    
    try {
      await fetcher(`/users/${u.id}`, { method: "PATCH", body: JSON.stringify({ status: u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }) }); 
      await load();
      showSuccess(
        u.status === "ACTIVE" ? "Usuario desactivado" : "Usuario activado",
        `El usuario ${u.name} ha sido ${u.status === "ACTIVE" ? "desactivado" : "activado"} exitosamente`
      );
    } catch (error) {
      showError("Error al cambiar estado", error.message);
    }
  };
  
  const del = async (u) => { 
    const result = await showConfirm(
      "¿Eliminar usuario?",
      `¿Estás seguro de que quieres eliminar permanentemente al usuario ${u.name}? Esta acción no se puede deshacer.`,
      "Sí, eliminar"
    );
    
    if (!result.isConfirmed) return;
    
    try {
      await fetcher(`/users/${u.id}`, { method: "DELETE" }); 
      await load();
      showSuccess("Usuario eliminado", `El usuario ${u.name} ha sido eliminado exitosamente`);
    } catch (error) {
      showError("Error al eliminar usuario", error.message);
    }
  };
  return (
     <div className="grid md:grid-cols-2 gap-6 h-full">
       <Card title={
         <div className="flex items-center gap-2">
           <User className="w-5 h-5" />
           Crear Usuario
         </div>
       } className="fade-in flex flex-col min-h-[500px]">
         <div className="flex-1">
          <form onSubmit={create} className="space-y-4">
            <div className="field">
              <label className="label">Nombre Completo *</label>
              <Input 
                placeholder="Nombre del usuario" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            
            <div className="field">
              <label className="label">Correo Electrónico *</label>
              <Input 
                type="email"
                placeholder="usuario@ejemplo.com" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div className="field">
              <label className="label">Contraseña *</label>
              <Input 
                type="password" 
                placeholder="Contraseña segura" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            
            <div className="field-group two-cols">
              <div className="field">
                <label className="label">Rol *</label>
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="TRANSPORTISTA">Transportista</option>
                  <option value="AGENTE">Agente</option>
                  <option value="ADMIN">Administrador</option>
                </Select>
              </div>
              
              <div className="field">
                <label className="label">Estado *</label>
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </Select>
              </div>
            </div>
            
            <PrimaryButton type="submit" className="w-full" loading={submitting}>
              {submitting ? (
                <>
                  <Spinner className="w-4 h-4 animate-spin mr-2" />
                  Creando usuario...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </PrimaryButton>
          </form>
        </div>
      </Card>

       <Card title={
         <div className="flex items-center gap-2">
           <UserCircle className="w-5 h-5" />
           Lista de Usuarios
         </div>
       } className="fade-in flex flex-col min-h-[500px]">
         <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner mr-3"></div>
              <span className="text-[var(--subtle)]">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="tbl admin-table">
                <thead>
                  <tr>
                    <th className="th">Usuario</th>
                    <th className="th">Rol</th>
                    <th className="th">Estado</th>
                    <th className="th">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="td">
                        <div>
                          <div className="font-semibold text-[var(--text)]">{u.name}</div>
                          <div className="text-sm text-[var(--subtle)]">{u.email}</div>
                        </div>
                      </td>
                      <td className="td">
                        <span className={`badge ${
                          u.role === "ADMIN" ? "badge-info" :
                          u.role === "AGENTE" ? "badge-warning" : "badge-mute"
                        }`}>
                          {u.role === "ADMIN" && <Gear className="w-3 h-3" />}
                          {u.role === "AGENTE" && <Shield className="w-3 h-3" />}
                          {u.role === "TRANSPORTISTA" && <Truck className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="td">
                        <span className={`badge ${u.status === "ACTIVE" ? "badge-success" : "badge-error"}`}>
                          {u.status === "ACTIVE" && <CheckCircle className="w-3 h-3" />}
                          {u.status === "INACTIVE" && <XCircle className="w-3 h-3" />}
                          {u.status}
                        </span>
                      </td>
                       <td className="td">
                         <div className="flex gap-2">
                           <Button 
                             variant="ghost" 
                             className="btn-sm border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                             onClick={() => toggle(u)}
                             title={u.status === "ACTIVE" ? "Desactivar usuario" : "Activar usuario"}
                           >
                             {u.status === "ACTIVE" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                           </Button>
                           <Button 
                             variant="danger" 
                             className="btn-sm"
                             onClick={() => del(u)}
                             title="Eliminar usuario"
                           >
                             <Trash className="w-4 h-4" />
                           </Button>
                         </div>
                       </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td className="td py-8 text-center text-[var(--subtle)]" colSpan="4">
                        <div className="empty">
                          <UserCircle className="empty-icon" />
                          <div>No hay usuarios registrados</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function AdminImportadores({ fetcher }) {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ id: "", nombre: "", estado: "ACTIVO" });
  const [msg, setMsg] = useState("");
  const load = async () => setList(await fetcher(`/admin/importers${q ? `?q=${encodeURIComponent(q)}` : ""}`));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.id || !form.nombre) return setMsg("id y nombre son requeridos");
    await fetcher(`/admin/importers/${encodeURIComponent(form.id)}`, { method: "PUT", body: JSON.stringify({ nombre: form.nombre, estado: form.estado }) });
    setMsg("Guardado ✔️");
    setForm({ id: "", nombre: "", estado: "ACTIVO" });
    await load();
  };
  const toggle = async (imp) => {
    const next = imp.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    await fetcher(`/admin/importers/${encodeURIComponent(imp.id)}/estado`, { method: "PATCH", body: JSON.stringify({ estado: next }) });
    await load();
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card card-pad">
        <h3 className="text-lg font-semibold mb-3">Crear / Actualizar importador</h3>
        <form onSubmit={save} className="grid gap-3">
          <Input placeholder="ID (15)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.slice(0, 15) })} />
          <Input placeholder="Nombre (100)" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value.slice(0, 100) })} />
          <Select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </Select>
          <PrimaryButton>Guardar</PrimaryButton>
          {msg && <p className="text-sm text-[var(--accent)]">{msg}</p>}
        </form>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold">Importadores</h3>
          <Input className="ml-auto w-64" placeholder="Buscar por id/nombre" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
          <Button 
            onClick={load}
            className="bg-blue-100 text-blue-500 border-blue-200 hover:bg-blue-150 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800"
          >
            Buscar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th className="th">ID</th><th className="th">Nombre</th><th className="th">Estado</th><th className="th">Creado</th><th className="th"></th></tr>
            </thead>
            <tbody>
              {list.map((imp) => (
                <tr key={imp.id}>
                  <td className="td">{imp.id}</td>
                  <td className="td">{imp.nombre}</td>
                  <td className="td"><span className={`badge ${imp.estado === "ACTIVO" ? "badge-ok" : "badge-mute"}`}>{imp.estado}</span></td>
                  <td className="td">{new Date(imp.created_at).toLocaleString()}</td>
                  <td className="td text-right">
                    <Button 
                      onClick={() => toggle(imp)}
                      className={imp.estado === "ACTIVO" ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"}
                    >
                      {imp.estado === "ACTIVO" ? "Inactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td className="td py-6 text-center text-slate-500" colSpan="5">Sin resultados</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminExportadores({ fetcher }) {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ id: "", nombre: "", estado: "ACTIVO" });
  const [msg, setMsg] = useState("");
  const load = async () => setList(await fetcher(`/admin/exporters${q ? `?q=${encodeURIComponent(q)}` : ""}`));
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.id || !form.nombre) return setMsg("id y nombre son requeridos");
    await fetcher(`/admin/exporters/${encodeURIComponent(form.id)}`, { method: "PUT", body: JSON.stringify({ nombre: form.nombre, estado: form.estado }) });
    setMsg("Guardado ✔️");
    setForm({ id: "", nombre: "", estado: "ACTIVO" });
    await load();
  };
  const toggle = async (exp) => {
    const next = exp.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    await fetcher(`/admin/exporters/${encodeURIComponent(exp.id)}/estado`, { method: "PATCH", body: JSON.stringify({ estado: next }) });
    await load();
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card card-pad">
        <h3 className="text-lg font-semibold mb-3">Crear / Actualizar exportador</h3>
        <form onSubmit={save} className="grid gap-3">
          <Input placeholder="ID (15)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.slice(0, 15) })} />
          <Input placeholder="Nombre (100)" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value.slice(0, 100) })} />
          <Select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </Select>
          <PrimaryButton>Guardar</PrimaryButton>
          {msg && <p className="text-sm text-[var(--accent)]">{msg}</p>}
        </form>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold">Exportadores</h3>
          <Input className="ml-auto w-64" placeholder="Buscar por id/nombre" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
          <Button 
            onClick={load}
            className="bg-blue-100 text-blue-500 border-blue-200 hover:bg-blue-150 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800"
          >
            Buscar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th className="th">ID</th><th className="th">Nombre</th><th className="th">Estado</th><th className="th">Creado</th><th className="th"></th></tr>
            </thead>
            <tbody>
              {list.map((exp) => (
                <tr key={exp.id}>
                  <td className="td">{exp.id}</td>
                  <td className="td">{exp.nombre}</td>
                  <td className="td"><span className={`badge ${exp.estado === "ACTIVO" ? "badge-ok" : "badge-mute"}`}>{exp.estado}</span></td>
                  <td className="td">{new Date(exp.created_at).toLocaleString()}</td>
                  <td className="td text-right">
                    <Button 
                      onClick={() => toggle(exp)}
                      className={exp.estado === "ACTIVO" ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"}
                    >
                      {exp.estado === "ACTIVO" ? "Inactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td className="td py-6 text-center text-slate-500" colSpan="5">Sin resultados</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const fetcher = useAuthFetch();
  const [tab, setTab] = useState("usuarios");
  return (
    <div className="space-y-6 min-h-screen">
       <div className="card card-pad inline-flex gap-2">
         <Button className={`${tab === "usuarios" ? "btn-solid text-white" : "btn-ghost text-[var(--text)] border-[var(--border)]"} h-12 px-6`} onClick={() => setTab("usuarios")}>
           <UserCircle className="w-4 h-4" />
           Usuarios
         </Button>
         <Button className={`${tab === "importadores" ? "btn-solid text-white" : "btn-ghost text-[var(--text)] border-[var(--border)]"} h-12 px-6`} onClick={() => setTab("importadores")}>
           <Building className="w-4 h-4" />
           Importadores
         </Button>
         <Button className={`${tab === "exportadores" ? "btn-solid text-white" : "btn-ghost text-[var(--text)] border-[var(--border)]"} h-12 px-6`} onClick={() => setTab("exportadores")}>
           <Building className="w-4 h-4" />
           Exportadores
         </Button>
       </div>
      <div className="min-h-[600px]">
        {tab === "usuarios" ? <AdminUsuarios fetcher={fetcher} /> : tab === "importadores" ? <AdminImportadores fetcher={fetcher} /> : <AdminExportadores fetcher={fetcher} />}
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  if (!role) return <Login onAuth={setRole} />;
  
  const handleLogout = () => {
    showConfirm(
      "¿Cerrar sesión?",
      "¿Estás seguro de que quieres cerrar sesión?",
      "Sí, cerrar sesión"
    ).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        location.reload();
      }
    });
  };
  
  return (
    <>
      <header className="header">
        <div className="container-ux py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="brand-square">S</div>
            <div>
              <div className="h1 text-2xl font-bold text-[var(--text)]">SIGLAD</div>
              <div className="text-xs text-[var(--subtle)] font-medium">Sistema de Gestión de Logística Aduanera</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-sm font-medium flex items-center gap-2">
              {role === "TRANSPORTISTA" && <><Truck className="w-4 h-4 text-blue-600" />Transportista</>}
              {role === "AGENTE" && <><Shield className="w-4 h-4 text-green-600" />Agente</>}
              {role === "ADMIN" && <><Gear className="w-4 h-4 text-purple-600" />Administrador</>}
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher />
            <Button 
              onClick={handleLogout}
              className="bg-red-100 text-red-500 border-red-200 hover:bg-red-150 dark:bg-red-900 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-800 flex items-center gap-2"
            >
              <SignOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container-ux py-8 space-y-8">
        {role === "TRANSPORTISTA" && <Transportista />}
        {role === "AGENTE" && <Agente />}
        {role === "ADMIN" && <Admin />}
      </main>
    </>
  );
}
