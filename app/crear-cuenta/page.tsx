'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Building2, CheckCircle2, AlertCircle, Search, Loader2, Eye, EyeOff } from 'lucide-react';
import { getDepartamentos, getProvincias, getDistritos } from '@/lib/ubigeo';
import { useAuthStore } from '@/lib/store';

type TipoPersona = 'natural' | 'juridica';
type TipoDocumento = 'DNI' | 'CE' | 'RUC';

const PHONE_CODES = [
  { code: '+51', iso: 'PE', country: 'Perú', flag: '🇵🇪' },
  { code: '+54', iso: 'AR', country: 'Argentina', flag: '🇦🇷' },
  { code: '+591', iso: 'BO', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+55', iso: 'BR', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', iso: 'CL', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', iso: 'CO', country: 'Colombia', flag: '🇨🇴' },
  { code: '+506', iso: 'CR', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+53', iso: 'CU', country: 'Cuba', flag: '🇨🇺' },
  { code: '+593', iso: 'EC', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+503', iso: 'SV', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+502', iso: 'GT', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+504', iso: 'HN', country: 'Honduras', flag: '🇭🇳' },
  { code: '+52', iso: 'MX', country: 'México', flag: '🇲🇽' },
  { code: '+505', iso: 'NI', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+507', iso: 'PA', country: 'Panamá', flag: '🇵🇦' },
  { code: '+595', iso: 'PY', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+1787', iso: 'PR', country: 'Puerto Rico', flag: '🇵🇷' },
  { code: '+1809', iso: 'DO', country: 'Rep. Dominicana', flag: '🇩🇴' },
  { code: '+598', iso: 'UY', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+58', iso: 'VE', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+1', iso: 'US', country: 'EE.UU. / Canadá', flag: '🇺🇸' },
  { code: '+34', iso: 'ES', country: 'España', flag: '🇪🇸' },
  { code: '+39', iso: 'IT', country: 'Italia', flag: '🇮🇹' },
  { code: '+33', iso: 'FR', country: 'Francia', flag: '🇫🇷' },
  { code: '+49', iso: 'DE', country: 'Alemania', flag: '🇩🇪' },
  { code: '+44', iso: 'GB', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+351', iso: 'PT', country: 'Portugal', flag: '🇵🇹' },
  { code: '+81', iso: 'JP', country: 'Japón', flag: '🇯🇵' },
  { code: '+86', iso: 'CN', country: 'China', flag: '🇨🇳' },
  { code: '+82', iso: 'KR', country: 'Corea del Sur', flag: '🇰🇷' },
  { code: '+91', iso: 'IN', country: 'India', flag: '🇮🇳' },
  { code: '+971', iso: 'AE', country: 'Emiratos Árabes', flag: '🇦🇪' },
  { code: '+966', iso: 'SA', country: 'Arabia Saudita', flag: '🇸🇦' },
  { code: '+61', iso: 'AU', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', iso: 'NZ', country: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: '+27', iso: 'ZA', country: 'Sudáfrica', flag: '🇿🇦' },
  { code: '+20', iso: 'EG', country: 'Egipto', flag: '🇪🇬' },
  { code: '+234', iso: 'NG', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+7', iso: 'RU', country: 'Rusia', flag: '🇷🇺' },
];

const OCUPACIONES = [
  'Abogado/a', 'Actor / Actriz', 'Actuario/a', 'Administrador/a', 'Aduanero/a',
  'Agente de aduanas', 'Agente de seguros', 'Agente de viajes', 'Agrónomo/a', 'Analista financiero/a',
  'Analista de sistemas', 'Antropólogo/a', 'Arquitecto/a', 'Artista', 'Asistente administrativo/a',
  'Auditor/a', 'Bacteriólogo/a', 'Biólogo/a', 'Bombero/a', 'Bróker', 'Cajero/a',
  'Chef / Cocinero/a', 'Cirujano/a', 'Coach', 'Comerciante', 'Comunicador/a social',
  'Conductor/a', 'Consultor/a', 'Contador/a', 'Dentista', 'Deportista', 'Diseñador/a gráfico/a',
  'Diseñador/a de interiores', 'Doctor/a', 'Economista', 'Editor/a', 'Educador/a',
  'Electricista', 'Empresario/a', 'Enfermero/a', 'Escritor/a', 'Estadístico/a',
  'Estudiante', 'Farmacéutico/a', 'Fotógrafo/a', 'Funcionario/a público/a', 'Gastrónomo/a',
  'Geógrafo/a', 'Geólogo/a', 'Gerente', 'Gestor/a de proyectos', 'Importador/a / Exportador/a',
  'Ingeniero/a civil', 'Ingeniero/a de sistemas', 'Ingeniero/a industrial', 'Ingeniero/a mecánico/a',
  'Ingeniero/a electrónico/a', 'Intérprete / Traductor/a', 'Inversionista', 'Jubilado/a',
  'Joyero/a', 'Juez / Magistrado/a', 'Logístico/a', 'Marketing / Publicidad',
  'Médico/a general', 'Militar / Policía', 'Notario/a', 'Nutricionista', 'Odontólogo/a',
  'Optometrista', 'Periodista', 'Piloto', 'Planificador/a', 'Productor/a',
  'Programador/a', 'Psicólogo/a', 'Publicista', 'Químico/a', 'Radiólogo/a',
  'Relacionista público/a', 'Representante de ventas', 'Sociólogo/a', 'Técnico/a',
  'Terapeuta', 'Trader / Operador financiero', 'Transportista', 'Veterinario/a',
  'Trabajador/a independiente', 'Otro',
];

const RELACIONES_EMPRESA = [
  'Representante Legal', 'Gerente', 'Gerente General', 'Accionista',
  'Encargado/a de Finanzas', 'Encargado/a de Tesorería', 'Contador/a',
  'Empleado/a', 'Otro',
];

const NACIONALIDADES = [
  'Argentina', 'Boliviana', 'Brasileña', 'Chilena', 'Colombiana',
  'Costarricense', 'Cubana', 'Dominicana', 'Ecuatoriana', 'Española',
  'Estadounidense', 'Francesa', 'Guatemalteca', 'Hondureña', 'Italiana',
  'Japonesa', 'Mexicana', 'Nicaragüense', 'Panameña', 'Paraguaya',
  'Portuguesa', 'Puertorriqueña', 'Salvadoreña', 'Uruguaya', 'Venezolana',
  'Alemana', 'Australiana', 'Británica', 'Canadiense', 'China', 'Coreana',
  'India', 'Rusa', 'Otra',
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const DIAS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const ANIOS = Array.from({ length: 85 }, (_, i) => 2010 - i);

const SELECT_ARROW_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
const SELECT_ARROW_STYLE: React.CSSProperties = {
  backgroundImage: SELECT_ARROW_BG,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  paddingRight: '24px',
};

export default function CrearCuentaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginStore = useAuthStore((state) => state.login);
  const errorRef = useRef<HTMLDivElement>(null);

  // Estado del flujo
  const [paso, setPaso] = useState(0);
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>('natural');

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Documento
    tipoDocumento: '' as TipoDocumento,
    dni: '',

    // Persona Natural
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',

    // Persona Jurídica
    razonSocial: '',
    personaContacto: '',
    relacionEmpresa: '',

    // Contacto
    email: '',
    telefono: '',
    telefonoCodigo: '+51',
    ocupacion: '',

    // Ubicación
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',

    // Seguridad
    password: '',
    confirmPassword: '',

    // CE — campos adicionales
    nacionalidad: '',
    diaNac: '',
    mesNac: '',
    anioNac: '',
    paisResidencia: 'Perú',

    // Términos
    acceptTerms: false,
    acceptPrivacy: false,
    acceptPromotions: false,
  });

  // Si viene desde /empresa, saltar directo al formulario de empresa
  useEffect(() => {
    if (searchParams.get('tipo') === 'empresa') {
      setTipoPersona('juridica');
      setFormData(prev => ({ ...prev, tipoDocumento: 'RUC' }));
      setPaso(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ubigeo
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [regStage, setRegStage] = useState<'processing' | 'confirmed' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [editingDni, setEditingDni] = useState(false);
  const [dniEditValue, setDniEditValue] = useState('');
  const [intentoContinuar, setIntentoContinuar] = useState(false);
  const [transicionando, setTransicionando] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoEnviando, setCodigoEnviando] = useState(false);
  const [codigoValue, setCodigoValue] = useState('');
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codigoValidando, setCodigoValidando] = useState(false);
  const [codigoValido, setCodigoValido] = useState<boolean | null>(null);
  const [dniTouched, setDniTouched] = useState(false);
  const [documentoRegistrado, setDocumentoRegistrado] = useState(false);
  const [checkingDoc, setCheckingDoc] = useState(false);

  // Password requirements
  const pwdReqs = [
    { label: 'Mínimo 8 caracteres',      met: formData.password.length >= 8 },
    { label: 'Al menos 1 letra',         met: /[a-zA-Z]/.test(formData.password) },
    { label: 'Al menos 1 número',        met: /[0-9]/.test(formData.password) },
    { label: 'Al menos 1 carácter especial (!@#$...)', met: /[!@#$%^&*()\,\.?\"\:\<\>\-\_\/\+=]/.test(formData.password) },
  ];
  const pwdValid = pwdReqs.every(r => r.met);

  // Estado lookup RENIEC / SUNAT
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMsg, setLookupMsg] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [lookupLocked, setLookupLocked] = useState(false); // campos bloqueados tras autocompletar

  // Cargar departamentos
  useEffect(() => {
    setDepartamentos(getDepartamentos());
  }, []);


  // Cargar opciones de provincias cuando cambia el departamento (sin resetear valores)
  useEffect(() => {
    if (formData.departamento) {
      setProvincias(getProvincias(formData.departamento));
    } else {
      setProvincias([]);
    }
  }, [formData.departamento]);

  // Cargar opciones de distritos cuando cambia provincia o departamento (sin resetear valores)
  useEffect(() => {
    if (formData.departamento && formData.provincia) {
      setDistritos(getDistritos(formData.departamento, formData.provincia));
    } else {
      setDistritos([]);
    }
  }, [formData.provincia, formData.departamento]);

  // Scroll a error
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  // Contador de reenvío de código
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-validación del código al completar 6 caracteres
  useEffect(() => {
    if (codigoValue.length === 6) {
      setCodigoValidando(true);
      setCodigoValido(null);
      fetch('/api/flask/api/web/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: codigoValue }),
      })
        .then(r => r.json())
        .then(data => {
          setCodigoValidando(false);
          setCodigoValido(data.success === true);
        })
        .catch(() => {
          setCodigoValidando(false);
          setCodigoValido(false);
        });
    } else {
      setCodigoValidando(false);
      setCodigoValido(null);
    }
  }, [codigoValue]);

  // Función para validar y convertir a mayúsculas campos de nombres (solo letras)
  const validateAndUppercaseNames = (value: string): string => {
    // Solo permitir letras, espacios y acentos
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!regex.test(value)) {
      return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
    return value.toUpperCase();
  };

  // Función para convertir a mayúsculas dirección (acepta letras, números y caracteres especiales)
  const validateAndUppercaseAddress = (value: string): string => {
    return value.toUpperCase();
  };

  const handleChange = (field: string, value: any) => {
    // Campos que solo aceptan letras
    const nameFields = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'razonSocial', 'personaContacto'];

    // Campo dirección acepta letras, números y caracteres especiales
    const addressFields = ['direccion'];

    if (nameFields.includes(field) && typeof value === 'string') {
      value = validateAndUppercaseNames(value);
    } else if (addressFields.includes(field) && typeof value === 'string') {
      value = validateAndUppercaseAddress(value);
    }

    // Si cambia el número de documento, resetear lookup
    if (field === 'dni') {
      setLookupMsg(null);
      setLookupLocked(false);
      setDocumentoRegistrado(false);
    }

    // Cascada de resets para campos de ubicación (solo cuando el usuario cambia manualmente)
    if (field === 'departamento') {
      setFormData(prev => ({ ...prev, departamento: value, provincia: '', distrito: '' }));
      setError('');
      return;
    }
    if (field === 'provincia') {
      setFormData(prev => ({ ...prev, provincia: value, distrito: '' }));
      setError('');
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Normalizar valor de SUNAT (mayúsculas) al formato exacto del ubigeo.ts (title case)
  const normalizeToUbigeo = (value: string, options: string[]): string => {
    if (!value) return '';
    const upper = value.toUpperCase().trim();
    return options.find(opt => opt.toUpperCase() === upper) || '';
  };

  // ── Consulta RENIEC (DNI) / SUNAT (RUC) ─────────────────────────────────
  const handleLookup = async (overrideDni?: string) => {
    setLookupMsg(null);
    setLookupLocked(false);

    const docNum = (overrideDni ?? formData.dni).trim();
    const isRuc  = tipoPersona === 'juridica';
    const isDni  = formData.tipoDocumento === 'DNI';
    const expectedLen = formData.tipoDocumento === 'DNI' ? 8 : formData.tipoDocumento === 'CE' ? 9 : 11;

    if (docNum.length !== expectedLen) {
      setLookupMsg({ type: 'warning', text: `Ingresa los ${expectedLen} dígitos del ${formData.tipoDocumento} antes de buscar.` });
      return;
    }

    setLookupLoading(true);
    try {
      if (isRuc) {
        // Consulta SUNAT
        const res  = await fetch(`/api/lookup/ruc?numero=${encodeURIComponent(docNum)}`);
        const data = await res.json();

        if (!data.success) {
          setLookupMsg({ type: 'error', text: data.message || 'No se encontró el RUC en SUNAT.' });
          setFormData(prev => ({ ...prev, razonSocial: '' }));
          return;
        }

        // Normalizar valores de SUNAT (devueltos en MAYÚSCULAS) al formato del ubigeo.ts
        const allDepts = getDepartamentos();
        const dept = normalizeToUbigeo(data.departamento || '', allDepts);
        const provs = dept ? getProvincias(dept) : [];
        const prov  = normalizeToUbigeo(data.provincia  || '', provs);
        const dists = dept && prov ? getDistritos(dept, prov) : [];
        const dist  = normalizeToUbigeo(data.distrito   || '', dists);

        setFormData(prev => ({
          ...prev,
          razonSocial:  data.razon_social || prev.razonSocial,
          direccion:    data.direccion    || prev.direccion,
          departamento: dept,
          provincia:    prov,
          distrito:     dist,
        }));

        const estado = data.estado || '';
        const condicion = data.condicion || '';
        const esActivo = estado.includes('ACTIVO');

        setLookupMsg({
          type: esActivo ? 'success' : 'warning',
          text: `✓ ${data.razon_social}${estado ? ` — Estado: ${estado}` : ''}${condicion ? ` · ${condicion}` : ''}`,
        });
        setLookupLocked(true);

      } else {
        // Consulta RENIEC (DNI o CE — CE no tiene RENIEC público, solo DNI)
        if (!isDni) {
          setLookupMsg({ type: 'warning', text: 'La búsqueda automática solo está disponible para DNI.' });
          return;
        }

        const res  = await fetch(`/api/lookup/dni?numero=${encodeURIComponent(docNum)}`);
        const data = await res.json();

        if (!data.success) {
          setLookupMsg({ type: 'error', text: data.message || 'No se encontró el DNI en RENIEC.' });
          setFormData(prev => ({ ...prev, nombres: '', apellidoPaterno: '', apellidoMaterno: '' }));
          return;
        }

        setFormData(prev => ({
          ...prev,
          nombres:         data.nombres          || prev.nombres,
          apellidoPaterno: data.apellido_paterno  || prev.apellidoPaterno,
          apellidoMaterno: data.apellido_materno  || prev.apellidoMaterno,
        }));

        setLookupMsg({
          type: 'success',
          text: `✓ ${data.apellido_paterno} ${data.apellido_materno}, ${data.nombres} — datos obtenidos de RENIEC.`,
        });
        setLookupLocked(true);
      }
    } catch {
      setLookupMsg({ type: 'error', text: 'No se pudo conectar con el servicio. Ingresa los datos manualmente.' });
    } finally {
      setLookupLoading(false);
    }
  };

  const validarPaso1 = () => {
    const longitudEsperada =
      formData.tipoDocumento === 'DNI' ? 8 :
      formData.tipoDocumento === 'CE' ? 9 : 11;

    if (!formData.tipoDocumento) {
      setError('Selecciona el tipo de documento');
      return false;
    }
    if (!formData.dni || formData.dni.length !== longitudEsperada) {
      setError(`${formData.tipoDocumento} debe tener ${longitudEsperada} dígitos`);
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Ingresa un correo electrónico válido');
      return false;
    }
    if (!pwdValid) {
      setError('La contraseña no cumple todos los requisitos');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Acepta los Términos y Condiciones');
      return false;
    }
    if (!captchaChecked) {
      setError('Completa la verificación "No soy un robot"');
      return false;
    }
    return true;
  };

  const validarPaso2 = () => {
    if (tipoPersona === 'natural') {
      if (formData.tipoDocumento === 'CE') {
        if (!formData.nombres.trim()) { setError('Ingresa tu nombre'); return false; }
        if (!formData.apellidoPaterno.trim()) { setError('Ingresa tu apellido paterno'); return false; }
        if (!formData.apellidoMaterno.trim()) { setError('Ingresa tu apellido materno'); return false; }
        const isPeru = formData.telefonoCodigo === '+51';
        if (!formData.telefono || (isPeru && (formData.telefono.length !== 9 || !formData.telefono.startsWith('9')))) {
          setError('Ingresa un número de celular válido'); return false;
        }
        if (!formData.nacionalidad) { setError('Selecciona tu nacionalidad'); return false; }
        if (!formData.ocupacion) { setError('Selecciona tu ocupación'); return false; }
        if (!formData.diaNac || !formData.mesNac || !formData.anioNac) { setError('Ingresa tu fecha de nacimiento completa'); return false; }
        if (!formData.departamento) { setError('Selecciona tu departamento'); return false; }
        if (!formData.provincia) { setError('Selecciona tu provincia'); return false; }
        if (!formData.distrito) { setError('Selecciona tu distrito'); return false; }
        if (!formData.direccion.trim()) { setError('Ingresa tu dirección'); return false; }
      } else {
        if (!lookupLocked) {
          // Lookup falló — validar campos manuales
          if (!formData.nombres.trim()) { setError('Ingresa tu nombre'); return false; }
          if (!formData.apellidoPaterno.trim()) { setError('Ingresa tu apellido paterno'); return false; }
        }
        const isPeru = formData.telefonoCodigo === '+51';
        if (!formData.telefono || (isPeru && (formData.telefono.length !== 9 || !formData.telefono.startsWith('9')))) {
          setError('Ingresa un número de celular válido'); return false;
        }
        if (!formData.ocupacion) { setError('Selecciona tu ocupación'); return false; }
      }
    } else {
      // Jurídica
      if (!lookupLocked && !formData.razonSocial.trim()) {
        setError('Ingresa la razón social de la empresa');
        return false;
      }
      if (!formData.personaContacto.trim()) { setError('Ingresa el nombre de la persona de contacto'); return false; }
      const isPeru = formData.telefonoCodigo === '+51';
      if (!formData.telefono || (isPeru && (formData.telefono.length !== 9 || !formData.telefono.startsWith('9')))) {
        setError('Ingresa un número de celular válido'); return false;
      }
      if (!formData.relacionEmpresa) { setError('Selecciona tu relación con la empresa'); return false; }
    }
    return true;
  };

  const validarPaso3 = () => codigoValido === true;

  const siguientePaso = async () => {
    if (paso === 1 && !validarPaso1()) return;
    if (paso === 2 && !validarPaso2()) return;
    setTransicionando(true);
    await new Promise(r => setTimeout(r, 550));
    setTransicionando(false);
    setPaso(paso + 1);
  };

  const anteriorPaso = () => {
    const prev = paso - 1;
    setPaso(prev);
    setError('');
    setLookupMsg(null);
    // Solo resetear el lookup si se regresa al paso 1 o 0 (donde se puede cambiar el documento)
    if (prev <= 1) setLookupLocked(false);
    if (prev <= 1) { setCaptchaChecked(false); setCaptchaLoading(false); }
    setIntentoContinuar(false);
  };

  const handleSubmit = async () => {
    if (!validarPaso3()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        tipo_persona: tipoPersona === 'natural' ? 'Natural' : 'Jurídica',
        tipo_documento: formData.tipoDocumento,
        dni: formData.dni,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        departamento: formData.departamento,
        provincia: formData.provincia,
        distrito: formData.distrito,
        password: formData.password,
        accept_promotions: formData.acceptPromotions,
        ...(tipoPersona === 'natural' ? {
          nombres: formData.nombres,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
        } : {
          razon_social: formData.razonSocial,
          persona_contacto: formData.personaContacto,
          relacion_empresa: formData.relacionEmpresa,
        })
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login tras registro exitoso
        await loginStore({ dni: formData.dni, password: formData.password });
        // Secuencia de transición animada antes de mostrar bienvenida
        setRegStage('processing');
        setTimeout(() => setRegStage('confirmed'), 3000);
        setTimeout(() => { setRegStage(null); setSuccess(true); }, 5200);
      } else {
        setError(data.message || 'Error al registrar. Intenta nuevamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen flex flex-col" style={{ backgroundImage: "url('/pg.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: 'transparent', boxShadow: 'none' }}>
        <div className="w-full max-w-[960px] mx-auto px-4 sm:px-10 py-3.5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <img src="/logo-principal.png" alt="QoriCash" className="h-9 w-auto" />
              <span className="text-xl font-display font-black tracking-tight text-white">Qoricash</span>
            </Link>
            <Link href="/login" className="text-sm transition" style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
              ¿Ya tienes cuenta? <span className="font-semibold text-primary-400">Inicia sesión</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Layout centrado */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 w-full max-w-6xl mx-auto px-4 sm:px-10 py-6 min-h-full" style={{ position: 'relative' }}>



          {/* Imagen hero — solo desktop */}
          <div className={`hidden lg:flex flex-[1.3] items-center justify-start${tipoPersona === 'juridica' ? ' self-stretch' : ''}`}>
            <div
              className={`relative w-full${tipoPersona === 'juridica' ? ' h-full flex items-center' : ''}`}
              style={{ transform: 'translateX(-60px)' }}
            >
              <img
                src={tipoPersona === 'juridica' ? '/qq.webp' : '/registro-hero.webp'}
                alt="QoriCash"
                className="w-full object-contain"
                style={{ position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>

          {/* Línea divisoria difuminada — fija al centro */}
          <div className="hidden lg:block" style={{ position: 'absolute', left: '50%', top: '5%', height: '90%', width: '1px', background: 'linear-gradient(to bottom, transparent 0%, rgba(30,41,59,0.15) 20%, rgba(30,41,59,0.15) 80%, transparent 100%)', pointerEvents: 'none' }} />

          {/* Formulario — centrado al mismo nivel que la imagen */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-start self-stretch px-0 lg:pl-10 pt-6 pb-10">
          <div className="w-full max-w-[340px] mx-auto lg:mx-0">

          {/* ── PANTALLA DE ÉXITO ── */}
          {success && (
            <>
              <style>{`
                @keyframes successFadeUp {
                  from { opacity: 0; transform: translateY(22px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes checkPop {
                  0%   { opacity: 0; transform: scale(0.55); }
                  65%  { transform: scale(1.1); }
                  82%  { transform: scale(0.95); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes ringInner {
                  0%, 100% { transform: scale(1);    opacity: 0.5; }
                  50%       { transform: scale(1.22); opacity: 0.15; }
                }
                @keyframes ringOuter {
                  0%, 100% { transform: scale(1.42); opacity: 0.25; }
                  50%       { transform: scale(1.68); opacity: 0.06; }
                }
              `}</style>
              <div
                className="flex flex-col items-center text-center pt-2"
                style={{ animation: 'successFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                {/* Icono check con anillos palpitantes */}
                <div
                  className="relative mb-4"
                  style={{ animation: 'checkPop 0.65s cubic-bezier(0.22,1,0.36,1) 0.08s both' }}
                >
                  {/* Anillo interior — palpita */}
                  <div className="absolute inset-0 rounded-full" style={{
                    border: '1.5px solid rgba(34,197,94,0.38)',
                    animation: 'ringInner 2.4s ease-in-out 0.75s infinite',
                  }} />
                  {/* Anillo exterior — palpita desfasado */}
                  <div className="absolute rounded-full" style={{
                    inset: '-10px',
                    border: '1px solid rgba(34,197,94,0.18)',
                    animation: 'ringOuter 2.4s ease-in-out 1.05s infinite',
                  }} />
                  {/* Círculo central con check */}
                  <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center" style={{
                    background: 'rgba(34,197,94,0.10)',
                    border: '1.5px solid rgba(34,197,94,0.35)',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>

                {/* Título */}
                <div className="mb-4" style={{ animation: 'successFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.22s both' }}>
                  <h1 className="text-xl font-black mb-1" style={{ color: '#ffffff' }}>
                    ¡Bienvenido a <span style={{ color: '#22C55E' }}>QoriCash</span>!
                  </h1>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Tu cuenta ha sido creada exitosamente</p>
                </div>

                {/* Pill + Card QoriCoins */}
                <div className="w-full" style={{ animation: 'successFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.38s both' }}>
                  <div className="flex justify-center mb-2">
                    <span className="px-4 py-1 rounded-full text-xs font-black tracking-wide"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E' }}>
                      Ganaste
                    </span>
                  </div>
                  <div className="rounded-2xl px-5 py-4 text-center bg-white"
                    style={{ border: '1px solid rgba(30,41,59,0.08)', boxShadow: '0 6px 28px rgba(30,41,59,0.07)' }}>
                    <img src="/logo-principal.png" alt="QoriCash" className="h-7 w-auto mx-auto mb-3" />
                    <p className="font-black leading-none mb-0.5" style={{ fontSize: '3rem', color: '#D4AF37' }}>40</p>
                    <p className="text-[10px] font-black tracking-[0.3em] mb-3" style={{ color: '#D4AF37' }}>QORICOINS</p>
                    <div className="mb-3" style={{ height: '1px', background: 'rgba(30,41,59,0.08)' }} />
                    <p className="text-[9px] font-semibold tracking-widest" style={{ color: 'rgba(30,41,59,0.4)' }}>
                      PUNTOS DE MEJORA PARA TU PRIMERA OPERACIÓN
                    </p>
                  </div>
                </div>

                {/* Botón */}
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/nueva-operacion')}
                  className="mt-4 w-full py-3 rounded-2xl text-sm font-black text-white tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    boxShadow: '0 6px 24px rgba(34,197,94,0.25)',
                    animation: 'successFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.52s both',
                  }}
                >
                  INICIAR CAMBIO →
                </button>

                <p className="mt-3 text-[10px] tracking-widest" style={{
                  color: 'rgba(255,255,255,0.4)',
                  animation: 'successFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.62s both',
                }}>
                  QORICASH · FOREX EXCHANGE
                </p>
              </div>
            </>
          )}

          {/* ── TRANSICIÓN ANIMADA: procesando → cuenta creada ── */}
          {regStage !== null && (
            <>
              <style>{`
                @keyframes arcSpin {
                  to { transform: rotate(360deg); }
                }
                @keyframes particleFloat {
                  0%   { opacity: 0; transform: translateY(0) scale(0.6); }
                  25%  { opacity: 1; transform: translateY(-14px) scale(1); }
                  75%  { opacity: 0.5; transform: translateY(-36px) scale(0.85); }
                  100% { opacity: 0; transform: translateY(-52px) scale(0.6); }
                }
                @keyframes stageEnter {
                  from { opacity: 0; transform: translateY(14px) scale(0.96); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes circleTrace {
                  from { stroke-dashoffset: 213.6; }
                  to   { stroke-dashoffset: 0; }
                }
                @keyframes checkTrace {
                  from { stroke-dashoffset: 58; }
                  to   { stroke-dashoffset: 0; }
                }
                @keyframes confirmBg {
                  from { opacity: 0; }
                  to   { opacity: 1; }
                }
                @keyframes confirmText {
                  from { opacity: 0; transform: translateY(8px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes dotBlink {
                  0%, 70%, 100% { opacity: 0.2; transform: scale(0.7); }
                  35%           { opacity: 1;   transform: scale(1); }
                }
              `}</style>

              <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '460px' }}>

                {/* ── Fase 1: Procesando ── */}
                {regStage === 'processing' && (
                  <div style={{ animation: 'stageEnter 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
                    {/* Arco giratorio + icono servidor */}
                    <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 24px' }}>
                      {/* Arco spinner */}
                      <svg width="88" height="88" style={{ position: 'absolute', inset: 0, animation: 'arcSpin 1.1s linear infinite' }}>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="2.5"/>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="#22C55E" strokeWidth="2.5"
                          strokeDasharray="90 149" strokeLinecap="round"/>
                      </svg>
                      {/* Icono servidor centrado */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.75)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="8" rx="2"/>
                          <rect x="2" y="14" width="20" height="8" rx="2"/>
                          <circle cx="6" cy="6"  r="1" fill="rgba(34,197,94,0.75)" stroke="none"/>
                          <circle cx="6" cy="18" r="1" fill="rgba(34,197,94,0.75)" stroke="none"/>
                          <line x1="10" y1="6"  x2="18" y2="6"/>
                          <line x1="10" y1="18" x2="18" y2="18"/>
                        </svg>
                      </div>
                      {/* Partículas flotando hacia arriba */}
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{
                          position: 'absolute',
                          width: '5px', height: '5px',
                          borderRadius: '50%',
                          background: '#22C55E',
                          bottom: '4px',
                          left: `${16 + i * 16}px`,
                          animation: `particleFloat 1.35s ease-in-out ${i * 0.3}s infinite`,
                        }}/>
                      ))}
                    </div>
                    <p className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>Creando tu cuenta…</p>
                    {/* 3 dots parpadeantes */}
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#22C55E',
                          animation: `dotBlink 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Fase 2: Cuenta creada ── */}
                {regStage === 'confirmed' && (
                  <div style={{ animation: 'stageEnter 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
                    <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 20px' }}>
                      <svg width="88" height="88" viewBox="0 0 88 88">
                        {/* Fondo del círculo — aparece al completarse el trazo */}
                        <circle cx="44" cy="44" r="38"
                          style={{ fill: 'rgba(34,197,94,0.10)', animation: 'confirmBg 0.3s 0.68s ease both', opacity: 0 }}/>
                        {/* Círculo que se traza */}
                        <circle cx="44" cy="44" r="38" fill="none" stroke="#22C55E" strokeWidth="2.5"
                          strokeDasharray="238.8" strokeDashoffset="238.8" strokeLinecap="round"
                          transform="rotate(-90 44 44)"
                          style={{ animation: 'circleTrace 0.65s cubic-bezier(0.4,0,0.2,1) 0.08s forwards' }}/>
                        {/* Checkmark que se dibuja */}
                        <polyline points="24,44 37,57 64,30" fill="none" stroke="#22C55E" strokeWidth="3.2"
                          strokeLinecap="round" strokeLinejoin="round"
                          strokeDasharray="58" strokeDashoffset="58"
                          style={{ animation: 'checkTrace 0.42s cubic-bezier(0.4,0,0.2,1) 0.7s forwards' }}/>
                      </svg>
                    </div>
                    <p className="text-base font-black mb-1" style={{ color: '#ffffff', animation: 'confirmText 0.4s 0.85s ease both', opacity: 0 }}>
                      ¡Cuenta creada!
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', animation: 'confirmText 0.4s 1.0s ease both', opacity: 0 }}>
                      Preparando tu bienvenida…
                    </p>
                  </div>
                )}

              </div>
            </>
          )}

          {/* ── FORMULARIO (oculto cuando success o en transición) ── */}
          {!success && regStage === null && <>
          {/* Flecha retroceso (visible solo en pasos > 0) */}
          <div className="mb-3" style={{ minHeight: '32px' }}>
            {paso > 0 && (
              <button type="button" onClick={paso === 1 ? () => { setPaso(0); setTipoPersona('natural'); setError(''); setLookupMsg(null); setLookupLocked(false); } : anteriorPaso} className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                Volver
              </button>
            )}
          </div>

          {/* Título */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-display font-black mb-1">
              {paso === 0 ? (
                <><span style={{ color: '#ffffff' }}>Crear </span><span style={{ color: '#22C55E' }}>Cuenta</span></>

              ) : (
                <>
                  <span style={{ color: '#ffffff' }}>Crear cuenta </span>
                  <span style={{ color: '#22C55E' }}>{tipoPersona === 'natural' ? 'Persona Natural' : 'Empresa'}</span>
                </>
              )}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Únete a QoriCash en 3 simples pasos</p>
          </div>

          {/* PASO 0 — Selección tipo de cliente */}
          {paso === 0 && (
            <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-base font-bold text-center mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>Elige el tipo de cliente</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Persona Natural */}
                <button
                  type="button"
                  onClick={() => { setTipoPersona('natural'); setFormData(prev => ({ ...prev, tipoDocumento: 'DNI' })); setPaso(1); }}
                  className="group flex flex-col items-center p-5 rounded-2xl border-2 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2.5" style={{ background: 'rgba(34,197,94,0.2)' }}>
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-black text-sm mb-1.5" style={{ color: '#ffffff' }}>Persona Natural</p>
                  <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>DNI · Carnet de Extranjería</p>
                </button>

                {/* Empresa */}
                <button
                  type="button"
                  onClick={() => { setTipoPersona('juridica'); setFormData(prev => ({ ...prev, tipoDocumento: 'RUC' })); setPaso(1); }}
                  className="group flex flex-col items-center p-5 rounded-2xl border-2 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2.5" style={{ background: 'rgba(34,197,94,0.2)' }}>
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-black text-sm mb-1.5" style={{ color: '#ffffff' }}>Empresa</p>
                  <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>Ficha RUC</p>
                </button>
              </div>
            </div>
          )}

        {/* Indicador de pasos */}
        {paso > 0 && <div className="flex items-center justify-center mb-4">
          {[
            { num: 1, label: 'Identidad' },
            { num: 2, label: 'Contacto' },
            { num: 3, label: 'Verificación' },
          ].map(({ num, label }) => (
            <div key={num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  paso > num
                    ? 'bg-primary text-white'
                    : paso === num
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-white/20 text-white/60'
                }`}>
                  {paso > num ? <CheckCircle2 className="w-4 h-4" /> : num}
                </div>
                <span className={`text-xs mt-1 font-semibold transition-colors ${paso >= num ? 'text-primary-400' : 'text-white/50'}`}>{label}</span>
              </div>
              {num < 3 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${
                  paso > num ? 'bg-primary' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>}

        {/* Card del formulario */}
        {paso > 0 && <div className="rounded-2xl px-6 py-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>

          {/* Animación creando cuenta (reemplaza contenido del card) */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 animate-in fade-in duration-300">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 animate-spin" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" strokeDasharray="80 140" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/logo-principal.png" alt="QoriCash" className="h-7 w-auto" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: '#ffffff' }}>Creando tu cuenta</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Esto solo tomará un momento...</p>
              </div>
            </div>
          )}

          {/* Contenido del formulario (oculto mientras carga) */}
          {!loading && <>

          {/* Alerta: documento ya registrado */}
          {documentoRegistrado && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800 mb-0.5">Documento ya registrado</p>
                <p className="text-sm text-amber-700">Este número de documento ya tiene una cuenta en QoriCash.{' '}
                  <a
                    href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20en%20QoriCash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:opacity-80 transition"
                    style={{ color: '#92400e' }}
                  >
                    Contactar con soporte
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div ref={errorRef} className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100/80 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-0.5">Error de validación</p>
                <p className="text-sm text-red-700/90">{error}</p>
              </div>
            </div>
          )}

          {/* PASO 1: Datos básicos */}
          {paso === 1 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right duration-300">

              {(() => {
                const isNatural = tipoPersona === 'natural';
                const docLen = isNatural ? (formData.tipoDocumento === 'DNI' ? 8 : 9) : 11;
                const valid = formData.dni.length === docLen && formData.email.includes('@') && pwdValid && formData.acceptTerms && captchaChecked;
                const fieldsetCls = { border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '0' };
                const legendCls = "ml-3 px-1";
                const legendStyle = { color: 'rgba(255,255,255,0.6)', fontSize: '10px' };
                const inputInnerCls = "w-full px-3 pb-2 bg-transparent text-sm text-white focus:outline-none placeholder-white/40";
                return (
                  <div className="space-y-2.5">
                    {/* Documento */}
                    <div className="flex gap-2 items-start">
                      {isNatural ? (
                        <fieldset style={{ ...fieldsetCls, minWidth: '90px', flexShrink: 0 }}>
                          <legend className={legendCls} style={legendStyle}>Tipo</legend>
                          <select
                            value={formData.tipoDocumento}
                            onChange={(e) => handleChange('tipoDocumento', e.target.value as TipoDocumento)}
                            className="w-full px-2 pb-2 bg-transparent text-sm text-white appearance-none cursor-pointer focus:outline-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '24px' }}
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">Carnet Ext.</option>
                          </select>
                        </fieldset>
                      ) : null}
                      <div className="flex-1 flex flex-col">
                        <fieldset style={fieldsetCls}>
                          <legend className={legendCls} style={legendStyle}>{isNatural ? 'Número de documento' : 'RUC'}</legend>
                          <input
                            type="text"
                            value={formData.dni}
                            onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                            onBlur={() => setDniTouched(true)}
                            onFocus={() => setDniTouched(false)}
                            inputMode="numeric"
                            maxLength={docLen}
                            autoComplete="off"
                            className={inputInnerCls}
                          />
                        </fieldset>
                        {dniTouched && formData.dni.length > 0 && formData.dni.length < docLen && (
                          <p className="text-[10px] text-red-500 mt-0.5 ml-1">
                            Coloca los {docLen} dígitos del {formData.tipoDocumento}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <fieldset style={fieldsetCls}>
                      <legend className={legendCls} style={legendStyle}>Correo electrónico</legend>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value.toLowerCase())}
                        autoComplete="off"
                        className={inputInnerCls}
                      />
                    </fieldset>

                    {/* Contraseña */}
                    <fieldset style={fieldsetCls}>
                      <legend className={legendCls} style={legendStyle}>Contraseña</legend>
                      <div className="flex items-center pr-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          autoComplete="new-password"
                          className={`${inputInnerCls} flex-1`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition mb-1.5" tabIndex={-1}>
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </fieldset>
                    {formData.password && (
                      <div className="grid grid-cols-1 gap-0.5 pt-0.5">
                        {pwdReqs.map((req, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            {req.met ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            )}
                            <span className="text-xs" style={{ color: req.met ? '#22C55E' : '#EF4444' }}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Términos */}
                    <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
                      <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => handleChange('acceptTerms', e.target.checked)} className="mt-0.5 h-3.5 w-3.5 text-primary border-slate-300 rounded" />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Acepto los <a href="/terminos-condiciones" target="_blank" className="text-primary hover:underline">Términos y Condiciones</a> y la <a href="/politica-privacidad" target="_blank" className="text-primary hover:underline">Política de Privacidad</a>
                      </span>
                    </label>

                    {/* Captcha */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                      <div onClick={() => { if (!captchaChecked) { setCaptchaLoading(true); setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200); }}} className="flex-shrink-0 w-5 h-5 cursor-pointer flex items-center justify-center">
                        {captchaLoading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : captchaChecked ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 border border-slate-300 rounded hover:border-primary transition" />}
                      </div>
                      <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>No soy un robot</span>
                      <div className="flex flex-col items-center gap-0.5 opacity-50">
                        <img src="/logo-principal.png" alt="" className="h-5 w-auto" />
                        <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>reCAPTCHA</span>
                      </div>
                    </div>

                    {/* Errores al intentar continuar */}
                    {intentoContinuar && !valid && (
                      <div className="space-y-0.5">
                        {!formData.tipoDocumento && <p className="text-xs text-red-500">• Selecciona el tipo de documento (DNI o Carnet)</p>}
                        {formData.tipoDocumento && formData.dni.length !== docLen && <p className="text-xs text-red-500">• Ingresa tu número de {formData.tipoDocumento} completo ({docLen} dígitos)</p>}
                        {!formData.email.includes('@') && <p className="text-xs text-red-500">• Ingresa un correo electrónico válido</p>}
                        {!pwdValid && <p className="text-xs text-red-500">• La contraseña no cumple todos los requisitos</p>}
                        {!formData.acceptTerms && <p className="text-xs text-red-500">• Acepta los Términos y Condiciones</p>}
                        {!captchaChecked && <p className="text-xs text-red-500">• Completa la verificación "No soy un robot"</p>}
                      </div>
                    )}

                    {/* Botón */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!valid) { setIntentoContinuar(true); return; }
                        setIntentoContinuar(false);
                        setDocumentoRegistrado(false);
                        setCheckingDoc(true);

                        // Verificar si el documento ya está registrado
                        try {
                          const res = await fetch(`/api/check-document?dni=${encodeURIComponent(formData.dni)}`);
                          const checkData = await res.json();
                          if (checkData.exists) {
                            setDocumentoRegistrado(true);
                            setCheckingDoc(false);
                            return;
                          }
                        } catch {
                          // Si falla el check continuar normal
                        }

                        setCheckingDoc(false);

                        if (
                          (tipoPersona === 'natural' && formData.tipoDocumento === 'DNI' && formData.dni.length === 8) ||
                          (tipoPersona === 'juridica' && formData.tipoDocumento === 'RUC' && formData.dni.length === 11)
                        ) {
                          await handleLookup();
                        }
                        await siguientePaso();
                      }}
                      disabled={checkingDoc || lookupLoading || transicionando}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-1 flex items-center justify-center gap-2"
                      style={{ background: valid ? '#22C55E' : 'rgba(30,41,59,0.18)', cursor: valid ? 'pointer' : 'default' }}
                    >
                      {checkingDoc || lookupLoading || transicionando
                        ? <><Loader2 className="w-4 h-4 animate-spin" />Verificando...</>
                        : 'Continuar'}
                    </button>
                  </div>
                );
              })()}

              <div className="hidden">dummy</div>
            </div>
          )}

          {/* PASO 2: Datos personales */}
          {paso === 2 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right duration-300">

            {(() => {
              const fsCls = { border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '0' };
              const legCls = "ml-2 px-1";
              const legSt = { color: 'rgba(255,255,255,0.6)', fontSize: '10px' };
              const inpCls = "w-full px-3 pb-2 bg-transparent text-sm text-white focus:outline-none placeholder-white/40";
              const arrSt = SELECT_ARROW_STYLE;
              const telefonoValido = formData.telefonoCodigo === '+51'
                ? formData.telefono.length === 9 && formData.telefono.startsWith('9')
                : formData.telefono.length > 0;

              if (formData.tipoDocumento === 'CE') {
                // ── FORMULARIO CE (manual) ──────────────────────────────
                const valid = !!formData.nombres.trim() && !!formData.apellidoPaterno.trim() && !!formData.apellidoMaterno.trim()
                  && telefonoValido && !!formData.nacionalidad && !!formData.ocupacion
                  && !!formData.diaNac && !!formData.mesNac && !!formData.anioNac
                  && !!formData.departamento && !!formData.provincia && !!formData.distrito && !!formData.direccion.trim();

                return (
                  <div className="space-y-2.5">
                    {/* Documento — solo lectura */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                      <div className="px-4 py-3 flex gap-8">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Documento</p>
                          <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>CE</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Número</p>
                          <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{formData.dni}</p>
                        </div>
                      </div>
                    </div>

                    {/* Nombres */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Nombre(s)</legend>
                      <input type="text" value={formData.nombres} onChange={e => handleChange('nombres', e.target.value)} autoComplete="off" className={inpCls} placeholder="" />
                    </fieldset>

                    {/* Apellido paterno */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Apellido paterno</legend>
                      <input type="text" value={formData.apellidoPaterno} onChange={e => handleChange('apellidoPaterno', e.target.value)} autoComplete="off" className={inpCls} />
                    </fieldset>

                    {/* Apellido materno */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Apellido materno</legend>
                      <input type="text" value={formData.apellidoMaterno} onChange={e => handleChange('apellidoMaterno', e.target.value)} autoComplete="off" className={inpCls} />
                    </fieldset>

                    {/* Teléfono */}
                    <div className="flex gap-2">
                      <fieldset style={{ ...fsCls, minWidth: '80px', width: '80px', flexShrink: 0 }}>
                        <legend className={legCls} style={legSt}>Código</legend>
                        <select value={formData.telefonoCodigo} onChange={e => handleChange('telefonoCodigo', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm text-white appearance-none focus:outline-none cursor-pointer" style={arrSt}>
                          {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.flag} {p.iso}</option>)}
                        </select>
                      </fieldset>
                      <fieldset className="flex-1" style={fsCls}>
                        <legend className={legCls} style={legSt}>Número de celular</legend>
                        <input type="text" value={formData.telefono} onChange={e => {
                          const raw = e.target.value.replace(/\D/g, '');
                          const isPeru = formData.telefonoCodigo === '+51';
                          if (isPeru && raw.length === 1 && raw !== '9') return;
                          if (isPeru) handleChange('telefono', raw.slice(0, 9));
                          else handleChange('telefono', raw);
                        }} inputMode="tel" className={inpCls} placeholder='' maxLength={formData.telefonoCodigo === '+51' ? 9 : undefined} />
                      </fieldset>
                    </div>
                    {formData.telefonoCodigo === '+51' && formData.telefono && !formData.telefono.startsWith('9') && (
                      <p className="text-xs text-red-500 -mt-0.5">El número debe empezar por 9</p>
                    )}

                    {/* Nacionalidad */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Nacionalidad</legend>
                      <select value={formData.nacionalidad} onChange={e => handleChange('nacionalidad', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm text-white appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.nacionalidad ? '#334155' : '#CBD5E1' }}>
                        <option value="" disabled>Seleccionar</option>
                        {NACIONALIDADES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </fieldset>

                    {/* Ocupación */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Ocupación</legend>
                      <select value={formData.ocupacion} onChange={e => handleChange('ocupacion', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm text-white appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.ocupacion ? '#ffffff' : '#CBD5E1' }}>
                        <option value="" disabled>Seleccionar</option>
                        {OCUPACIONES.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </fieldset>

                    {/* Fecha de nacimiento */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Fecha de nacimiento</p>
                      <div className="flex gap-2">
                        <fieldset style={{ ...fsCls, flex: 1 }}>
                          <legend className={legCls} style={legSt}>Día</legend>
                          <select value={formData.diaNac} onChange={e => handleChange('diaNac', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.diaNac ? '#334155' : '#CBD5E1' }}>
                            <option value="">DD</option>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </fieldset>
                        <fieldset style={{ ...fsCls, flex: 2 }}>
                          <legend className={legCls} style={legSt}>Mes</legend>
                          <select value={formData.mesNac} onChange={e => handleChange('mesNac', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.mesNac ? '#334155' : '#CBD5E1' }}>
                            <option value="">MM</option>
                            {MESES.map((m, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>)}
                          </select>
                        </fieldset>
                        <fieldset style={{ ...fsCls, flex: 1.5 }}>
                          <legend className={legCls} style={legSt}>Año</legend>
                          <select value={formData.anioNac} onChange={e => handleChange('anioNac', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.anioNac ? '#334155' : '#CBD5E1' }}>
                            <option value="">AAAA</option>
                            {ANIOS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                        </fieldset>
                      </div>
                    </div>

                    {/* Datos de ubicación */}
                    <p className="text-[10px] font-semibold uppercase tracking-wide pt-1 ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Datos de ubicación</p>

                    {/* País de residencia */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>País de residencia</legend>
                      <input type="text" value={formData.paisResidencia} onChange={e => handleChange('paisResidencia', e.target.value)} className={inpCls} />
                    </fieldset>

                    {/* Departamento */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Departamento</legend>
                      <select value={formData.departamento} onChange={e => handleChange('departamento', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.departamento ? '#334155' : '#CBD5E1' }}>
                        <option value="">Seleccionar</option>
                        {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </fieldset>

                    {/* Provincia */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Provincia</legend>
                      <select value={formData.provincia} onChange={e => handleChange('provincia', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.provincia ? '#334155' : '#CBD5E1' }} disabled={!formData.departamento}>
                        <option value="">Seleccionar</option>
                        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </fieldset>

                    {/* Distrito */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Distrito</legend>
                      <select value={formData.distrito} onChange={e => handleChange('distrito', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer" style={{ ...arrSt, color: formData.distrito ? '#334155' : '#CBD5E1' }} disabled={!formData.provincia}>
                        <option value="">Seleccionar</option>
                        {distritos.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </fieldset>

                    {/* Dirección */}
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Dirección</legend>
                      <input type="text" value={formData.direccion} onChange={e => handleChange('direccion', e.target.value)} className={inpCls} />
                    </fieldset>

                    {/* Botón continuar */}
                    <button type="button" onClick={siguientePaso} disabled={!valid || transicionando}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-1 flex items-center justify-center gap-2"
                      style={{ background: valid ? '#22C55E' : 'rgba(30,41,59,0.12)', cursor: valid ? 'pointer' : 'not-allowed' }}>
                      {transicionando ? <><Loader2 className="w-4 h-4 animate-spin" />Cargando...</> : 'Continuar'}
                    </button>
                  </div>
                );
              }

              // ── FORMULARIO DNI / RUC (existente) ───────────────────────
              // CE nunca tiene lookup disponible → campos manuales siempre visibles
              // DNI → campos manuales solo cuando el lookup fue intentado y falló (lookupMsg set)
              const dniLookupFailed = tipoPersona === 'natural' && !lookupLocked && !editingDni && (
                formData.tipoDocumento !== 'DNI' || !!lookupMsg
              );
              const rucLookupFailed = tipoPersona === 'juridica' && !lookupLocked && !editingDni && !!lookupMsg;
              const namesManual = dniLookupFailed && !!formData.nombres.trim() && !!formData.apellidoPaterno.trim();
              const rucManual = rucLookupFailed && !!formData.razonSocial.trim();
              const valid = tipoPersona === 'juridica'
                ? !editingDni && (lookupLocked || rucManual) && telefonoValido && !!formData.personaContacto.trim() && !!formData.relacionEmpresa
                : !editingDni && (lookupLocked || namesManual) && telefonoValido && !!formData.ocupacion;
              return (
                <div className="space-y-2.5">
                  {/* Card DNI + Nombres */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{formData.tipoDocumento}</p>
                      {editingDni ? (
                        <div className="flex gap-2 mt-1">
                          <input type="text" value={dniEditValue} onChange={e => setDniEditValue(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            className="flex-1 px-2 py-1 rounded-lg text-sm text-white focus:outline-none" style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent' }}
                            placeholder="Ingresa tu número de documento" autoFocus />
                          <button type="button" onClick={async () => { setFormData(prev => ({ ...prev, dni: dniEditValue })); await handleLookup(dniEditValue); setEditingDni(false); }}
                            className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
                            {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{formData.dni}</p>
                      )}
                    </div>
                    {!editingDni && (
                      <div className="px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {tipoPersona === 'juridica' ? 'Razón Social' : 'Nombres y Apellidos'}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>
                          {tipoPersona === 'juridica'
                            ? (formData.razonSocial || <span style={{ color: 'rgba(255,255,255,0.4)' }}>No encontrado</span>)
                            : (`${formData.apellidoPaterno} ${formData.apellidoMaterno} ${formData.nombres}`.trim() || <span style={{ color: 'rgba(255,255,255,0.4)' }}>No encontrado</span>)
                          }
                        </p>
                      </div>
                    )}
                    {/* Campos manuales si el lookup DNI falló */}
                    {dniLookupFailed && (
                      <div className="px-4 pb-3 space-y-2 animate-in fade-in duration-300">
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>No pudimos obtener tus datos automáticamente. Ingrésalos manualmente:</p>
                        <input type="text" value={formData.nombres}
                          onChange={e => handleChange('nombres', e.target.value)}
                          placeholder="Nombres"
                          autoComplete="off"
                          className="w-full px-2 py-1.5 rounded-lg text-sm text-white focus:outline-none placeholder-white/40" style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent' }} />
                        <input type="text" value={formData.apellidoPaterno}
                          onChange={e => handleChange('apellidoPaterno', e.target.value)}
                          placeholder="Apellido paterno"
                          autoComplete="off"
                          className="w-full px-2 py-1.5 rounded-lg text-sm text-white focus:outline-none placeholder-white/40" style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent' }} />
                        <input type="text" value={formData.apellidoMaterno}
                          onChange={e => handleChange('apellidoMaterno', e.target.value)}
                          placeholder="Apellido materno"
                          autoComplete="off"
                          className="w-full px-2 py-1.5 rounded-lg text-sm text-white focus:outline-none placeholder-white/40" style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent' }} />
                      </div>
                    )}
                    {/* Campo manual Razón Social si el lookup RUC falló */}
                    {rucLookupFailed && (
                      <div className="px-4 pb-3 space-y-2 animate-in fade-in duration-300">
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>No pudimos obtener la razón social. Ingrésala manualmente:</p>
                        <input type="text" value={formData.razonSocial}
                          onChange={e => handleChange('razonSocial', e.target.value)}
                          placeholder="Razón Social"
                          autoComplete="off"
                          className="w-full px-2 py-1.5 rounded-lg text-sm text-white focus:outline-none placeholder-white/40" style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'transparent' }} />
                      </div>
                    )}
                  </div>
                  {!editingDni && (
                    <button type="button" onClick={() => { setEditingDni(true); setDniEditValue(formData.dni); }} className="text-xs underline" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      ¿No son tus datos?
                    </button>
                  )}

                  {/* Persona de Contacto (solo Empresa) */}
                  {tipoPersona === 'juridica' && (
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Persona de contacto</legend>
                      <input type="text" value={formData.personaContacto}
                        onChange={e => handleChange('personaContacto', e.target.value)}
                        autoComplete="off"
                        className="w-full px-2 pb-1.5 bg-transparent text-sm text-white focus:outline-none placeholder-slate-300"
                        placeholder="Nombre completo" />
                    </fieldset>
                  )}

                  {/* Teléfono */}
                  <div className="flex gap-2 pt-1">
                    <fieldset style={{ ...fsCls, minWidth: '80px', width: '80px', flexShrink: 0 }}>
                      <legend className={legCls} style={legSt}>Código</legend>
                      <select value={formData.telefonoCodigo} onChange={e => handleChange('telefonoCodigo', e.target.value)} className="w-full px-2 pb-1.5 bg-transparent text-sm text-white appearance-none focus:outline-none cursor-pointer" style={arrSt}>
                        {PHONE_CODES.map(p => <option key={p.code} value={p.code}>{p.flag} {p.iso}</option>)}
                      </select>
                    </fieldset>
                    <fieldset className="flex-1" style={fsCls}>
                      <legend className={legCls} style={legSt}>Número de teléfono</legend>
                      <input type="text" value={formData.telefono} onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const isPeru = formData.telefonoCodigo === '+51';
                        if (isPeru && raw.length === 1 && raw !== '9') return;
                        if (isPeru) handleChange('telefono', raw.slice(0, 9));
                        else handleChange('telefono', raw);
                      }} autoComplete="off"
                        inputMode="tel"
                        className="w-full px-2 pb-1.5 bg-transparent text-sm text-white focus:outline-none placeholder-slate-300"
                        placeholder='' maxLength={formData.telefonoCodigo === '+51' ? 9 : undefined} />
                    </fieldset>
                  </div>
                  {formData.telefonoCodigo === '+51' && formData.telefono && !formData.telefono.startsWith('9') && (
                    <p className="text-xs text-red-500">El número debe empezar por 9</p>
                  )}

                  {/* Relación con la empresa (Empresa) / Ocupación (Natural) */}
                  {tipoPersona === 'juridica' ? (
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Relación con la empresa</legend>
                      <select value={formData.relacionEmpresa} onChange={e => handleChange('relacionEmpresa', e.target.value)}
                        className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer"
                        style={{ ...arrSt, color: formData.relacionEmpresa ? '#334155' : '#CBD5E1' }}>
                        <option value="" disabled>Seleccionar</option>
                        {RELACIONES_EMPRESA.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </fieldset>
                  ) : (
                    <fieldset style={fsCls}>
                      <legend className={legCls} style={legSt}>Ocupación</legend>
                      <select value={formData.ocupacion} onChange={e => handleChange('ocupacion', e.target.value)}
                        className="w-full px-2 pb-1.5 bg-transparent text-sm appearance-none focus:outline-none cursor-pointer"
                        style={{ ...arrSt, color: formData.ocupacion ? '#ffffff' : '#CBD5E1' }}>
                        <option value="" disabled>Seleccionar</option>
                        {OCUPACIONES.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </fieldset>
                  )}

                  {/* Botón continuar */}
                  <button type="button" onClick={siguientePaso} disabled={!valid || transicionando}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 mt-1 flex items-center justify-center gap-2"
                    style={{ background: valid ? '#22C55E' : 'rgba(30,41,59,0.12)', cursor: valid ? 'pointer' : 'not-allowed' }}>
                    {transicionando ? <><Loader2 className="w-4 h-4 animate-spin" />Cargando...</> : 'Continuar'}
                  </button>

                  {/* Soporte */}
                  <p className="text-center pt-1">
                    <a href="https://wa.me/51999999999?text=Hola%2C%20necesito%20ayuda%20con%20mi%20registro%20en%20QoriCash" target="_blank" rel="noopener noreferrer" className="text-xs underline transition" style={{ color: '#22C55E' }}>
                      Contactar con soporte
                    </a>
                  </p>
                </div>
              );
            })()}

            </div>
          )}

          {/* PASO 3: Verificación */}
          {paso === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">

              {/* Encabezado */}
              <div className="text-center pb-1">
                <h2 className="text-base font-black mb-1" style={{ color: '#ffffff' }}>Verificamos que eres tú</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Ingresa el código que te enviaremos a tu correo</p>
              </div>

              {/* Card correo */}
              <fieldset style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', padding: '0' }}>
                <legend className="px-1" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginLeft: '56px' }}>Correo</legend>
                <div className="px-3 pb-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
                  </div>
                  <p className="text-sm font-semibold flex-1" style={{ color: '#ffffff', wordBreak: 'break-all' }}>{formData.email}</p>
                </div>
                {codigoEnviado && (
                  <div className="flex items-center justify-center gap-1.5 pb-3 animate-in fade-in duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>Código enviado</span>
                  </div>
                )}
              </fieldset>

              {/* Botón enviar código (debajo de la card) */}
              {!codigoEnviado && (
                <button
                  type="button"
                  onClick={async () => {
                    setCodigoEnviando(true);
                    setError('');
                    try {
                      const res = await fetch('/api/flask/api/web/send-verification-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email, telefono: formData.telefono, telefonoCodigo: formData.telefonoCodigo }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setCodigoEnviado(true);
                        setCountdown(90);
                      } else {
                        setError(data.message || 'Error al enviar el código');
                      }
                    } catch {
                      setError('Error al conectar con el servidor');
                    } finally {
                      setCodigoEnviando(false);
                    }
                  }}
                  disabled={codigoEnviando}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition"
                  style={{ background: '#22C55E' }}
                >
                  {codigoEnviando ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
                  ) : 'Enviar código'}
                </button>
              )}

              {/* Contador reenvío */}
              {codigoEnviado && (
                <div className="text-center animate-in fade-in duration-300">
                  {countdown > 0 ? (
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Puedes reenviar el código en{' '}
                      <span className="font-semibold tabular-nums" style={{ color: '#ffffff' }}>
                        {Math.floor(countdown / 60) > 0
                          ? `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')} min`
                          : `${countdown}s`}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        setCodigoEnviando(true);
                        setCodigoValue('');
                        setCodigoValido(null);
                        setError('');
                        try {
                          const res = await fetch('/api/flask/api/web/send-verification-code', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: formData.email, telefono: formData.telefono, telefonoCodigo: formData.telefonoCodigo }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            setCountdown(90);
                          } else {
                            setError(data.message || 'Error al reenviar el código');
                          }
                        } catch {
                          setError('Error al conectar con el servidor');
                        } finally {
                          setCodigoEnviando(false);
                        }
                      }}
                      disabled={codigoEnviando}
                      className="text-xs font-semibold underline transition hover:opacity-70 flex items-center gap-1 mx-auto"
                      style={{ color: '#22C55E' }}
                    >
                      {codigoEnviando ? <><Loader2 className="w-3 h-3 animate-spin" />Enviando...</> : '¿No recibiste el código? Reenviar'}
                    </button>
                  )}
                </div>
              )}

              {/* Input código (aparece tras envío) */}
              {codigoEnviado && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Slots visuales con guiones */}
                  <style>{`
                    @keyframes caretBlink {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0; }
                    }
                    .otp-caret { animation: caretBlink 1s step-start infinite; }
                  `}</style>
                  <div
                    className="relative flex justify-center gap-2.5 py-2"
                    style={{ cursor: 'text', minHeight: '52px' }}
                    onClick={() => document.getElementById('codigo-hidden-input')?.focus()}
                  >
                    {/* Input superpuesto sobre los slots — mismo tamaño, transparente.
                        Así el browser móvil hace scroll a la posición correcta (no al -9999px). */}
                    <input
                      id="codigo-hidden-input"
                      type="text"
                      inputMode="text"
                      value={codigoValue}
                      onChange={(e) => {
                        const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        let result = '';
                        let letters = 0, digits = 0;
                        for (const c of raw) {
                          if (letters < 3 && /[A-Z]/.test(c)) { result += c; letters++; }
                          else if (letters === 3 && digits < 3 && /[0-9]/.test(c)) { result += c; digits++; }
                        }
                        setCodigoValue(result);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && codigoValue.length > 0) {
                          e.preventDefault();
                          setCodigoValue(prev => prev.slice(0, -1));
                        }
                      }}
                      maxLength={6}
                      autoFocus
                      autoComplete="one-time-code"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        color: 'transparent',
                        caretColor: 'transparent',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        zIndex: 10,
                        cursor: 'text',
                      }}
                    />
                    {Array.from({ length: 6 }).map((_, i) => {
                      const isActive = i === codigoValue.length && codigoValido === null && !codigoValidando;
                      const lineColor = codigoValido === true
                        ? '#22C55E'
                        : codigoValido === false
                          ? '#EF4444'
                          : codigoValidando
                            ? '#CBD5E1'
                            : i < codigoValue.length
                              ? '#22C55E'
                              : isActive
                                ? '#ffffff'
                                : 'rgba(255,255,255,0.25)';
                      const charColor = codigoValido === true ? '#22C55E' : codigoValido === false ? '#EF4444' : '#ffffff';
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: '34px', position: 'relative', zIndex: 1 }}>
                          <span className="text-lg font-bold h-7 flex items-end justify-center transition-colors duration-300" style={{ color: charColor, minWidth: '34px', textAlign: 'center', position: 'relative' }}>
                            {codigoValue[i]
                              ? codigoValue[i]
                              : isActive
                                ? <span className="otp-caret" style={{ display: 'inline-block', width: '2px', height: '20px', background: '#ffffff', borderRadius: '1px', marginBottom: '2px' }} />
                                : ''}
                          </span>
                          <div className="w-full transition-colors duration-300" style={{ height: '2px', borderRadius: '2px', background: lineColor }} />
                        </div>
                      );
                    })}
                  </div>
                  {/* Feedback validación */}
                  {codigoValidando && (
                    <div className="flex justify-center items-center gap-2 mt-3 animate-in fade-in duration-200">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#94a3b8' }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Verificando código...</span>
                    </div>
                  )}
                  {codigoValido === true && (
                    <div className="flex justify-center items-center gap-1.5 mt-3 animate-in fade-in zoom-in-95 duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>Código verificado correctamente</span>
                    </div>
                  )}
                  {codigoValido === false && (
                    <div className="flex justify-center items-center gap-1.5 mt-3 animate-in fade-in zoom-in-95 duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span className="text-xs font-semibold" style={{ color: '#EF4444' }}>Código incorrecto, intenta de nuevo</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cambiar correo */}
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => { setNewEmailValue(formData.email); setShowChangeEmailModal(true); }}
                  className="text-xs underline transition hover:opacity-70"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  ¿Necesitas cambiar de correo?
                </button>
              </p>

              {/* Botón Crear Cuenta */}
              {codigoEnviado && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || codigoValido !== true}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 animate-in fade-in duration-300"
                  style={{
                    background: codigoValido === true ? '#22C55E' : 'rgba(255,255,255,0.15)',
                    cursor: codigoValido === true ? 'pointer' : 'not-allowed',
                  }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creando cuenta...</> : 'Crear Cuenta'}
                </button>
              )}

            </div>
          )}

          </>} {/* fin !loading */}
        </div>}
        </>} {/* fin !success */}
        </div>{/* fin max-w formulario */}
        </div>{/* fin formulario */}
        </div>{/* fin fila centrada */}
      </div>{/* fin layout centrado */}

      {/* Modal: cambiar correo */}
      {showChangeEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-black mb-1" style={{ color: '#1E293B' }}>Actualizar correo</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(30,41,59,0.5)' }}>Ingresa el correo donde recibirás el código</p>
            <input
              type="email"
              value={newEmailValue}
              onChange={(e) => setNewEmailValue(e.target.value.toLowerCase())}
              autoComplete="off"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-primary-400 focus:outline-none text-sm text-slate-700 mb-4"
              placeholder="nuevo@correo.com"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChangeEmailModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition"
                style={{ color: 'rgba(30,41,59,0.5)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newEmailValue.includes('@')) {
                    handleChange('email', newEmailValue);
                    setShowChangeEmailModal(false);
                    setCodigoEnviado(false);
                    setCodigoValue('');
                    setCountdown(0);
                  }
                }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition"
                style={{ background: newEmailValue.includes('@') ? '#22C55E' : 'rgba(30,41,59,0.18)', cursor: newEmailValue.includes('@') ? 'pointer' : 'not-allowed' }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
