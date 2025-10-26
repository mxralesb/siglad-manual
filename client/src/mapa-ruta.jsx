import React, { useState } from 'react';
import { Input } from './App.jsx';

function MapaRuta({ setRouteInfo }) {
  const [aduanaSalida, setAduanaSalida] = useState('');
  const [aduanaEntrada, setAduanaEntrada] = useState('');
  const [kilometros, setKilometros] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aduanaSalida') {
      setAduanaSalida(value);
    } else if (name === 'aduanaEntrada') {
      setAduanaEntrada(value);
    } else if (name === 'kilometros') {
      setKilometros(value);
    }

    setRouteInfo({
      aduanaSalida: name === 'aduanaSalida' ? value : aduanaSalida,
      aduanaEntrada: name === 'aduanaEntrada' ? value : aduanaEntrada,
      kilometrosAproximados: name === 'kilometros' ? value : kilometros,
    });
  };

  return (
    <div className="space-y-4">
      <div className="field-group two-cols">
        <div className="field">
          <label className="label">Aduana de Salida</label>
          <Input
            type="text"
            name="aduanaSalida"
            placeholder="Nombre de la aduana"
            value={aduanaSalida}
            onChange={handleInputChange}
            maxLength={50}
          />
        </div>
        <div className="field">
          <label className="label">Aduana de Entrada</label>
          <Input
            type="text"
            name="aduanaEntrada"
            placeholder="Nombre de la aduana"
            value={aduanaEntrada}
            onChange={handleInputChange}
            maxLength={50}
          />
        </div>
      </div>
      <div className="field-group two-cols">
        <div className="field">
          <label className="label">Kilómetros Aproximados</label>
          <Input
            type="number"
            name="kilometros"
            placeholder="0"
            inputMode="numeric"
            value={kilometros}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}

export default MapaRuta;